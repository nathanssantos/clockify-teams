/* eslint-disable react-hooks/rules-of-hooks */
import { action, makeObservable, observable } from "mobx";
import { getRoot } from "mobx-easy";
import useLocalStorage from "../../hooks/useLocalStorage";
import getDuration from "../../utils/getDuration";

import Team from "../models/team";

export default class TeamStore {
  teamList = [];

  constructor() {
    makeObservable(this, {
      teamList: observable,

      setTeamList: action.bound,
      createTeam: action.bound,
      editTeam: action.bound,
      fetchTeamList: action.bound,
      fetchTeamData: action.bound,
    });
  }

  createTeam(payload = {}) {
    try {
      const { users } = payload;
      const [_teamList, setTeamList] = useLocalStorage("team-list");

      const teamList = _teamList || [];

      let id = teamList.length + 1;

      if (teamList.length) {
        setTeamList([
          ...teamList,
          {
            ...payload,
            id,
            users: users.map((user) => user.id),
          },
        ]);
      } else {
        setTeamList([
          {
            ...payload,
            id,
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

  editTeam(id, payload = {}) {
    try {
      const [teamList, setTeamList] = useLocalStorage("team-list");
      const { users } = payload;

      setTeamList(
        teamList.map((team) => {
          if (team.id === id) {
            return {
              ...team,
              ...payload,
              users: users.map((user) => user.id),
            };
          }
          return team;
        })
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
      const [teamList, setTeamList] = useLocalStorage("team-list");
      const newTeamList = teamList.filter((team) => team.id !== payload.id);
      setTeamList(newTeamList);
      this.setTeamList(
        newTeamList.map((team) => ({
          ...team,
          users: getRoot().userStore.userList.filter((user) =>
            team.users.includes(user.id)
          ),
        }))
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
      getRoot().authStore.feedFetchDataLog("fetching team list...");

      const [teamList] = useLocalStorage("team-list");

      if (teamList.length) {
        this.setTeamList(
          teamList.map((team) => ({
            ...team,
            users: getRoot().userStore.userList.filter((user) =>
              team.users.includes(user.id)
            ),
          }))
        );

        getRoot().authStore.feedFetchDataLog(
          "fetch team list success",
          "success"
        );
      }

      return false;
    } catch (error) {
      console.log(error);
      getRoot().authStore.feedFetchDataLog("fetch team list error", "error");
      return false;
    }
  }

  fetchTeamData(payload = {}) {
    try {
      const { id, users = [] } = payload;

      let usersWithTimeEntries = [];
      let teamTimeEntriesByProject = [];
      for (const user of users) {
        const userFound = getRoot().userStore.userList.find(
          (_user) => _user.id === user.id
        );

        if (userFound) {
          const { timeEntries, hours } = userFound;

          for (const timeEntry of timeEntries) {
            const projectFound = teamTimeEntriesByProject.find(
              (project) => project.id === timeEntry.projectId
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
                }
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
            (_user) => _user.id === user.id
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
            (_project) => _project.id === project.id
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
            name: "Sem projeto",
            color: "#ffffff",
          };
        }

        index++;
      }

      const newTeam = {
        ...payload,
        users: usersWithTimeEntries,
        timeEntriesByProject: teamTimeEntriesByProject,
        fetchedTimeEntries: true,
      };

      this.setTeamList(
        this.teamList.map((team) => {
          if (team.id === id) {
            return newTeam;
          }

          return team;
        })
      );

      return newTeam;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
