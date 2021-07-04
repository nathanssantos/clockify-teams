import { action, flow, makeObservable, observable } from "mobx";
import { getEnv, getRoot } from "mobx-easy";

import getDuration from "../../utils/getDuration";
import getDate from "../../utils/getDate";

import User from "../models/user";

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
      fetchUserData: action.bound,

      fetchUserList: flow,
      fetchUserTimeEntries: flow,
      fetchAllUsersTimeEntries: flow,
    });
  }

  setUserList(payload = []) {
    this.userList = payload.map((user) => User.fromApi(user));
  }

  setQueryDate(start, end) {
    this.queryStartDate = start;
    this.queryEndDate = end;
  }

  fetchUserData(payload = {}) {
    try {
      const { id } = payload;
      const userFound = this.userList.find((user) => user.id === id);

      let timeEntriesByDay = [];
      let teams = [];

      for (const timeEntry of userFound.timeEntries) {
        const time = timeEntry?.timeInterval?.duration;
        const date = timeEntry?.timeInterval?.start;
        const project = getRoot().projectStore.projectList.find(
          ({ id }) => id === timeEntry?.projectId
        );

        const dateFound = timeEntriesByDay.find(
          (entry) => entry.date === getDate(date)
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
                      project: project
                        ? project
                        : { name: "Sem projeto", color: "#ffffff" },
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
                  project: project
                    ? project
                    : { name: "Sem projeto", color: "#ffffff" },
                },
              ],
              hours: getDuration(time),
            });
          }
        }
      }

      for (const team of getRoot().teamStore.teamList) {
        for (const user of team.users) if (user.id === id) teams.push(team);
      }

      this.setUserList(
        this.userList.map((user) => {
          if (user.id === id) {
            return {
              ...payload,
              timeEntriesByDay,
              teams,
            };
          }

          return user;
        })
      );

      return false;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  *fetchUserList(payload = {}) {
    try {
      getRoot().authStore.feedFetchDataLog("fetching user list...");

      const { pageSize = 300 } = payload;
      const { defaultWorkspace } = getRoot().authStore.user;

      const response = yield getEnv().get(
        `/workspaces/${defaultWorkspace}/users`,
        {
          params: {
            "page-size": pageSize,
            status: "ACTIVE",
          },
        }
      );

      if (response.status !== 200) {
        getRoot().authStore.feedFetchDataLog("fetch user list error", "error");
        return false;
      }

      if (response?.data?.length) {
        this.setUserList(response.data);
        getRoot().authStore.feedFetchDataLog(
          "fetch user list success",
          "success"
        );
        return true;
      }

      getRoot().authStore.feedFetchDataLog("fetch user list error", "error");
      return false;
    } catch (error) {
      console.log(error);
      getRoot().authStore.feedFetchDataLog("fetch user list error", "error");
      return false;
    }
  }

  *fetchUserTimeEntries(payload = {}) {
    const { id, name, pageSize = 1000 } = payload;

    try {
      getRoot().authStore.feedFetchDataLog(
        `fetching user ${name} time entries...`
      );

      const { defaultWorkspace } = getRoot().authStore.user;

      const response = yield getEnv().get(
        `/workspaces/${defaultWorkspace}/user/${id}/time-entries`,
        {
          params: {
            start: this.queryStartDate,
            end: this.queryEndDate,
            "page-size": pageSize,
          },
        }
      );

      if (response.status !== 200) {
        getRoot().authStore.feedFetchDataLog(
          `fetch user ${name} time entries error`,
          "error"
        );
        return false;
      }

      if (response?.data) {
        let hours = 0;

        for (const item of response.data) {
          const time = item?.timeInterval?.duration;

          if (time?.length) {
            hours += getDuration(time);
          }
        }

        getRoot().authStore.feedFetchDataLog(
          `fetch user ${name} time entries success`,
          "success"
        );

        return {
          timeEntries: response.data,
          hours,
        };
      }

      getRoot().authStore.feedFetchDataLog(
        `fetch user ${name} time entries error`,
        "error"
      );

      return false;
    } catch (error) {
      console.log(error);
      getRoot().authStore.feedFetchDataLog(
        `fetch user ${name} time entries error`,
        "error"
      );
      return false;
    }
  }

  *fetchAllUsersTimeEntries() {
    try {
      getRoot().authStore.feedFetchDataLog(
        "fetching all users time entries..."
      );

      let newUsers = [];

      for (const user of this.userList) {
        const data = yield this.fetchUserTimeEntries(user);

        if (data) {
          const { timeEntries, hours } = data;

          newUsers.push({
            ...user,
            timeEntries,
            hours,
          });
        }
      }

      if (newUsers.length) {
        this.setUserList(newUsers);
        getRoot().authStore.feedFetchDataLog(
          "fetch all users time entries success",
          "success"
        );
        return true;
      }

      getRoot().authStore.feedFetchDataLog(
        "fetch all users time entries error",
        "error"
      );
      return false;
    } catch (error) {
      getRoot().authStore.feedFetchDataLog(
        "fetch all users time entries error",
        "error"
      );
      return false;
    }
  }
}
