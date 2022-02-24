import { makeObservable, observable } from 'mobx';

export default class Project {
  id = null;

  name = null;

  email = null;

  workspaceId = null;

  color = null;

  duration = null;

  estimate = null;

  users = [];

  timeEntriesByUser = [];

  constructor(newProject) {
    makeObservable(this, {
      id: observable,
      name: observable,
      email: observable,
      workspaceId: observable,
      color: observable,
      duration: observable,
      estimate: observable,
      users: observable,
      timeEntriesByUser: observable,
    });

    if (newProject == null || newProject.id == null) {
      throw new Error('Invalid Project constructor');
    }

    const {
      id,
      name,
      email,
      workspaceId,
      color,
      duration,
      estimate,
      users,
      timeEntriesByUser,
    } = newProject;

    this.id = id;
    this.name = name || '';
    this.email = email || '';
    this.workspaceId = workspaceId || '';
    this.color = color || '';
    this.duration = duration || '';
    this.estimate = estimate || '';
    this.users = users || [];
    this.timeEntriesByUser = timeEntriesByUser || [];
  }

  static fromApi({
    id,
    name,
    email,
    workspaceId,
    color,
    duration,
    estimate,
    users,
    timeEntriesByUser,
  } = {}) {
    return new Project({
      id,
      name,
      email,
      workspaceId,
      color,
      duration,
      estimate,
      users,
      timeEntriesByUser,
    });
  }
}
