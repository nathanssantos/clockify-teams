/* eslint-disable no-loop-func */
import { action, flow, makeObservable, observable } from "mobx";
import { getEnv, getRoot } from "mobx-easy";

import Project from "../models/project";

import getDuration from "../../utils/getDuration";
export default class ProjectStore {
  projectList = [];

  constructor() {
    makeObservable(this, {
      projectList: observable,
      setProjectList: action.bound,
      fetchProjectTimeEntries: action.bound,
      fetchProjectList: flow,
    });
  }

  setProjectList(payload = []) {
    this.projectList = payload.map((project) => Project.fromApi(project));
  }

  *fetchProjectList(payload = {}) {
    try {
      getRoot().authStore.feedFetchDataLog("fetching project list...");

      const { pageSize = 300 } = payload;
      const { defaultWorkspace } = getRoot().authStore.user;

      const response = yield getEnv().get(
        `/workspaces/${defaultWorkspace}/projects`,
        {
          params: {
            archived: false,
            "page-size": pageSize,
          },
        }
      );

      if (response.status !== 200) {
        getRoot().authStore.feedFetchDataLog(
          "fetch project list error",
          "error"
        );
        return false;
      }

      if (response?.data?.length) {
        this.setProjectList(response.data);
        getRoot().authStore.feedFetchDataLog(
          "fetch project list success",
          "success"
        );

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      getRoot().authStore.feedFetchDataLog("fetch project list error", "error");
      return false;
    }
  }

  fetchProjectTimeEntries(payload = {}) {
    try {
      const { id } = payload;

      let projectTimeEntriesByUser = [];
      for (const user of getRoot().userStore.userList) {
        const projectTimeEntriesFound = user.timeEntries.filter(
          (entry) => entry.projectId === id
        );

        for (const timeEntry of projectTimeEntriesFound) {
          const userFound = projectTimeEntriesByUser.find(
            (user) => user.id === timeEntry.userId
          );

          let hours = 0;

          const time = timeEntry?.timeInterval?.duration;

          if (time?.length) {
            hours += getDuration(time);
          }

          if (userFound) {
            projectTimeEntriesByUser = projectTimeEntriesByUser.map((user) => {
              if (user.id === timeEntry.userId) {
                return {
                  ...user,
                  timeEntries: [...user.timeEntries, timeEntry],
                  hours: user.hours + hours,
                };
              }

              return user;
            });
          } else {
            projectTimeEntriesByUser.push({
              ...user,
              timeEntries: [timeEntry],
              hours,
            });
          }
        }
      }

      this.setProjectList(
        this.projectList.map((project) => {
          if (project.id === id) {
            return {
              ...payload,

              timeEntriesByUser: projectTimeEntriesByUser,
              fetchedTimeEntries: true,
            };
          }

          return project;
        })
      );

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
