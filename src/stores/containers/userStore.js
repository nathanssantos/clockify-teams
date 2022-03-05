import { action, flow, makeObservable, observable } from 'mobx';
import { getEnv, getRoot } from 'mobx-easy';
import axios from 'axios';
import { reportsAPI } from '../../services/baseAPI';
import useLocalStorage from '../../hooks/useLocalStorage';

import {
  getDuration,
  getDate,
  formatDate,
  removeAllSpecialCharacters,
} from '../../utils';

import User from '../models/User';

export const WARNING_TYPES = {
  // NO_PROJECT: 'Time entry without project',
  NO_DESCRIPTION: 'Time entry without description',
  TIME_LIMIT: 'Time entry longer than 6 hours',
};
export default class UserStore {
  userList = [];

  queryStartDate = null;

  queryEndDate = null;

  constructor() {
    makeObservable(this, {
      userList: observable,
      queryStartDate: observable,
      queryEndDate: observable,

      setUserList: action.bound,
      formatUserData: action.bound,
      getUsersTeams: action.bound,
      storeUserMeta: action.bound,

      fetchUserList: flow,
      fetchUserTimeEntries: flow,
      fetchUserSummaryReport: flow,
      sendReport: flow,
    });
  }

  setUserList(payload = []) {
    this.userList = payload.map((user) => User.fromApi(user));
  }

  setQueryDate(start, end) {
    this.queryStartDate = start;
    this.queryEndDate = end;
  }

  *fetchUserTimeEntries(payload = {}) {
    const { id, name, pageSize = 5000 } = payload;
    const { NO_DESCRIPTION, /* NO_PROJECT, */ TIME_LIMIT } = WARNING_TYPES;

    try {
      getRoot().authStore.feedFetchDataLog(
        `fetching user ${name} time entries...`,
      );

      const { defaultWorkspace } = getRoot().authStore.user;

      const response = yield getEnv().get(
        `/workspaces/${defaultWorkspace}/user/${id}/time-entries`,
        {
          params: {
            start: `${
              new Date(this.queryStartDate).toISOString().split('T')[0]
            }T00:00:00.000Z`,

            end: `${
              new Date(this.queryEndDate).toISOString().split('T')[0]
            }T23:59:59.999Z`,

            'page-size': pageSize,
          },
        },
      );

      if (response.status !== 200) {
        getRoot().authStore.feedFetchDataLog(
          `error fetching ${name} time entries`,
          'error',
        );
        return false;
      }

      if (response?.data) {
        let hours = 0;
        const warnings = {};
        Object.keys(WARNING_TYPES).forEach((key) => {
          warnings[key] = 0;
        });

        const newTimeEntries = response.data.map((entry) => {
          const time = entry?.timeInterval?.duration;
          const newTimeEntry = { ...entry, warnings: [] };

          // if (!entry?.projectId?.length) {
          //   newTimeEntry.warnings.push(NO_PROJECT);
          //   warnings.NO_PROJECT++;
          // }

          if (!entry?.description?.length) {
            newTimeEntry.warnings.push(NO_DESCRIPTION);
            warnings.NO_DESCRIPTION++;
          }

          if (time?.length) {
            const duration = getDuration(time);
            if (duration) {
              hours += duration;

              if (duration >= 6) {
                newTimeEntry.warnings.push(TIME_LIMIT);
                warnings.TIME_LIMIT++;
              }
            }
          }

          return newTimeEntry;
        });

        getRoot().authStore.feedFetchDataLog(
          `fetched ${name} time entries`,
          'success',
        );

        return {
          timeEntries: newTimeEntries,
          hours,
          warnings,
        };
      }

      getRoot().authStore.feedFetchDataLog(
        `error fetching ${name} time entries`,
        'error',
      );

      return false;
    } catch (error) {
      console.log(error);
      getRoot().authStore.feedFetchDataLog(
        `error fetching ${name} time entries`,
        'error',
      );
      return false;
    }
  }

  formatUserData(user) {
    try {
      let timeEntriesByDay = [];

      for (const timeEntry of user.timeEntries) {
        const time = timeEntry?.timeInterval?.duration;
        const date = timeEntry?.timeInterval?.start;
        const project = getRoot().projectStore.projectList.find(
          ({ id }) => id === timeEntry?.projectId,
        );

        const dateFound = timeEntriesByDay.find(
          (entry) => entry.date === getDate(date),
        );

        if (time?.length && date?.length) {
          if (dateFound) {
            timeEntriesByDay = timeEntriesByDay.map((entry) => {
              if (entry.date === getDate(date)) {
                return {
                  date: entry.date,
                  timeEntries: [
                    ...entry.timeEntries,
                    {
                      ...timeEntry,
                      project: project || {
                        name: 'Without project',
                        color: '#ffffff',
                      },
                    },
                  ],
                  hours: entry.hours + getDuration(time),
                };
              }

              return entry;
            });
          } else {
            timeEntriesByDay.push({
              date: getDate(date),
              timeEntries: [
                {
                  ...timeEntry,
                  project: project || {
                    name: 'Without project',
                    color: '#ffffff',
                  },
                },
              ],
              hours: getDuration(time),
            });
          }
        }
      }

      return {
        ...user,
        timeEntriesByDay,
      };
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  getUsersTeams() {
    const newUsers = [];

    for (const user of this.userList) {
      const teams = [];

      for (const team of getRoot().teamStore.teamList) {
        for (const _user of team.users)
          if (_user.id === user.id) teams.push(team);
      }

      newUsers.push({ ...user, teams });
    }

    this.setUserList(newUsers);
  }

  storeUserMeta(payload = {}) {
    const { id, userMeta } = payload;

    const [storedUsersMeta, setStoredUsersMeta] = useLocalStorage('user-meta');

    const newUserMeta = {
      ...storedUsersMeta,
      [id]: userMeta,
    };

    if (storedUsersMeta[id]) {
      newUserMeta[id] = { ...storedUsersMeta[id].meta, ...userMeta };
    }

    setStoredUsersMeta(newUserMeta);
  }

  *fetchUserList(payload = {}) {
    try {
      getRoot().authStore.feedFetchDataLog('fetching user list...');

      const [storedUsersMeta] = useLocalStorage('user-meta');

      const { pageSize = 5000 } = payload;
      const { defaultWorkspace } = getRoot().authStore.user;

      const response = yield getEnv().get(
        `/workspaces/${defaultWorkspace}/users`,
        {
          params: {
            'page-size': pageSize,
            status: 'ACTIVE',
          },
        },
      );

      if (response.status !== 200) {
        getRoot().authStore.feedFetchDataLog(
          'error fecthing user list',
          'error',
        );
        return false;
      }

      if (response?.data?.length) {
        getRoot().authStore.feedFetchDataLog('fetched user list', 'success');

        const newUsers = [];

        for (const user of response.data) {
          const userTimeEntries = yield this.fetchUserTimeEntries(user);

          if (userTimeEntries) {
            const userData = {
              ...user,
              ...userTimeEntries,
            };

            if (storedUsersMeta && storedUsersMeta[user.id]) {
              userData.meta = storedUsersMeta[user.id];
            }

            const newUser = this.formatUserData(userData);

            newUsers.push(newUser);
          }
        }

        if (newUsers.length) {
          this.setUserList(newUsers);
          getRoot().authStore.feedFetchDataLog(
            'fetched all users time entries',
            'success',
          );
          return true;
        }
      }

      getRoot().authStore.feedFetchDataLog('error fetching user list', 'error');
      return false;
    } catch (error) {
      console.log(error);
      getRoot().authStore.feedFetchDataLog('error fetching user list', 'error');
      return false;
    }
  }

  *fetchUserSummaryReport(user) {
    try {
      const { defaultWorkspace } = getRoot().authStore.user;

      const response = yield reportsAPI.post(
        `/workspaces/${defaultWorkspace}/reports/summary`,
        {
          amountShown: 'HIDE_AMOUNT',
          dateRangeStart: `${
            new Date(this.queryStartDate).toISOString().split('T')[0]
          }T00:00:00.000Z`,
          dateRangeEnd: `${
            new Date(this.queryEndDate).toISOString().split('T')[0]
          }T23:59:59.999Z`,
          exportType: 'PDF',
          summaryFilter: {
            groups: ['PROJECT', 'TIMEENTRY'],
          },
          users: {
            ids: [user.id],
            contains: 'CONTAINS',
            status: 'ALL',
          },
          userLocale: 'pt_BR',
        },
        {
          responseType: 'blob',
        },
      );

      const normalizedUserName = user.name
        .toLowerCase()
        .split(' ')
        .map((word) => removeAllSpecialCharacters(word))
        .join('-');

      const fileName = `${normalizedUserName}__from_${formatDate(
        this.queryStartDate,
      )}_to_${formatDate(this.queryEndDate)}`;

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });

      // const url = window.URL.createObjectURL(blob);
      // window.open(url);

      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        const body = document.querySelector('body');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }

      return false;
    } catch (error) {
      console.log(error);
      getRoot().authStore.feedFetchDataLog('error fetching user list', 'error');
      return false;
    }
  }

  *sendReport(payload = {}) {
    try {
      const { toId, attachments, valuePerHour } = payload;
      const [token] = useLocalStorage('clockify-api-key');

      const response = yield axios.post(
        import.meta.env.VITE_API_URL,
        {
          toId,
          attachments,
          valuePerHour,
          dateRangeStart: this.queryStartDate,
          dateRangeEnd: this.queryEndDate,
        },
        { headers: { secret: import.meta.env.VITE_API_SECRET, token } },
      );

      const { status } = response;

      if (response.status !== 200) {
        return {
          error: {
            status,
          },
        };
      }

      return true;
    } catch (error) {
      console.log(error);

      return {
        error: {
          status: 400,
        },
      };
    }
  }
}
