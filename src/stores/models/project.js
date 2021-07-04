import { makeObservable, observable } from "mobx";

export default class Project {
  id = null;
  name = null;
  email = null;
  workspaceId = null;
  color = null;
  users = [];
  fetchedTimeEntries = false;
  timeEntriesByUser = [];

  constructor(newProject) {
    makeObservable(this, {
      id: observable,
      name: observable,
      email: observable,
      workspaceId: observable,
      color: observable,
      users: observable,
      fetchedTimeEntries: observable,
      timeEntriesByUser: observable,
    });

    if (newProject == null || newProject.id == null) {
      throw new Error("Invalid Project constructor");
    }

    const {
      id,
      name,
      email,
      workspaceId,
      color,
      users,
      fetchedTimeEntries,
      timeEntriesByUser,
    } = newProject;

    this.id = id;
    this.name = name || "";
    this.email = email || "";
    this.workspaceId = workspaceId || "";
    this.color = color || "";
    this.users = users || [];
    this.fetchedTimeEntries = fetchedTimeEntries || false;
    this.timeEntriesByUser = timeEntriesByUser || [];
  }

  static fromApi({
    id,
    name,
    email,
    workspaceId,
    color,
    users,
    fetchedTimeEntries,
    timeEntriesByUser,
  } = {}) {
    return new Project({
      id,
      name,
      email,
      workspaceId,
      color,
      users,
      fetchedTimeEntries,
      timeEntriesByUser,
    });
  }
}
