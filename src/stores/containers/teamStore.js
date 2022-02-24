/* eslint-disable react-hooks/rules-of-hooks */
import { action, makeObservable, observable } from 'mobx';
import { getRoot } from 'mobx-easy';

import useLocalStorage from '../../hooks/useLocalStorage';
import { getDuration } from '../../utils';

import Team from '../models/Team';

export default class TeamStore {
  teamList = [];

  constructor() {
    makeObservable(this, {
      teamList: observable,

      setTeamList: action.bound,
      createTeam: action.bound,
      editTeam: action.bound,
      fetchTeamList: action.bound,
      formatTeamData: action.bound,
    });
  }

  createTeam(team = {}) {
    try {
      const { users } = team;
      const [_teamList, setTeamList] = useLocalStorage('team-list');

      const teamList = _teamList || [];

      let id = 1;

      if (teamList.length) {
        id = teamList.length + 1;
        setTeamList([
          ...teamList,
          {
            ...team,
            id,
            users: users.map((user) => user.id),
          },
        ]);
      } else {
        setTeamList([
          {
            ...team,
            id: 1,
            users: users.map((user) => user.id),
          },
        ]);
      }

      return id;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      this.fetchTeamList();
    }
  }

  editTeam(id, team = {}) {
    try {
      const [teamList, setTeamList] = useLocalStorage('team-list');
      const { users } = team;

      setTeamList(
        teamList.map((team) => {
          if (team.id === id) {
            return {
              ...team,
              ...team,
              users: users.map((user) => user.id),
            };
          }
          return team;
        }),
      );

      return id;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      this.fetchTeamList();
    }
  }

  removeTeam(payload = {}) {
    try {
      const [teamList, setTeamList] = useLocalStorage('team-list');

      const newTeamList = teamList.filter((team) => team.id !== payload.id);

      setTeamList(newTeamList);

      this.setTeamList(
        newTeamList.map((team) => ({
          ...team,
          users: getRoot().userStore.userList.filter((user) =>
            team.users.includes(user.id),
          ),
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }

  setTeamList(payload = []) {
    this.teamList = payload.map((team) => Team.fromApi(team));
  }

  fetchTeamList() {
    try {
      getRoot().authStore.feedFetchDataLog('fetching team list...');

      const [teamList] = useLocalStorage('team-list');

      if (teamList.length) {
        const newTeamList = [];

        for (const team of teamList) {
          const newTeam = this.formatTeamData(team);

          newTeamList.push({
            ...newTeam,
            users: getRoot().userStore.userList.filter((user) =>
              team.users.includes(user.id),
            ),
          });
        }

        this.setTeamList(newTeamList);

        getRoot().authStore.feedFetchDataLog(
          'fetch team list success',
          'success',
        );
      }

      return false;
    } catch (error) {
      console.log(error);
      getRoot().authStore.feedFetchDataLog('fetch team list error', 'error');
      return false;
    }
  }

  formatTeamData(team = {}) {
    try {
      const usersWithTimeEntries = [];
      let teamTimeEntriesByProject = [];

      for (const user of team.users) {
        const userFound = getRoot().userStore.userList.find(
          (_user) => _user.id === user,
        );

        if (userFound) {
          const { timeEntries, hours } = userFound;

          for (const timeEntry of timeEntries) {
            const projectFound = teamTimeEntriesByProject.find(
              (project) => project.id === timeEntry.projectId,
            );

            let hours = 0;
            const time = timeEntry?.timeInterval?.duration;

            if (time?.length) {
              hours += getDuration(time);
            }

            if (projectFound) {
              teamTimeEntriesByProject = teamTimeEntriesByProject.map(
                (project) => {
                  if (project.id === timeEntry.projectId) {
                    return {
                      ...project,
                      id: timeEntry.projectId,
                      timeEntries: [...project.timeEntries, timeEntry],
                      hours: project.hours + hours,
                    };
                  }

                  return project;
                },
              );
            } else {
              teamTimeEntriesByProject.push({
                id: timeEntry.projectId,
                timeEntries: [timeEntry],
                hours,
              });
            }
          }

          const newUser = getRoot().userStore.userList.find(
            (_user) => _user.id === user.id,
          );

          usersWithTimeEntries.push({
            ...newUser,
            timeEntries,
            hours,
          });
        }
      }

      let index = 0;

      for (const project of teamTimeEntriesByProject) {
        if (project.id) {
          const projectFound = getRoot().projectStore.projectList.find(
            (_project) => _project.id === project.id,
          );

          if (projectFound) {
            teamTimeEntriesByProject[index] = {
              ...teamTimeEntriesByProject[index],
              name: projectFound.name,
              color: projectFound.color,
            };
          }
        } else {
          teamTimeEntriesByProject[index] = {
            ...teamTimeEntriesByProject[index],
            name: 'Without project',
            color: '#ffffff',
          };
        }

        index++;
      }

      return {
        ...team,
        users: usersWithTimeEntries,
        timeEntriesByProject: teamTimeEntriesByProject,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
