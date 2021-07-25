import { makeObservable, observable } from "mobx";

export default class Team {
  id = null;
  name = null;
  image = null;
  users = [];
  timeEntriesByProject = [];

  constructor(newTeam) {
    makeObservable(this, {
      id: observable,
      name: observable,
      image: observable,
      users: observable,
      timeEntriesByProject: observable,
    });

    if (newTeam == null || newTeam.id == null) {
      throw new Error("Invalid Team constructor");
    }

    const { id, name, image, users, timeEntriesByProject } = newTeam;

    this.id = id;
    this.name = name || "";
    this.image = image || "";
    this.users = users || [];
    this.timeEntriesByProject = timeEntriesByProject || [];
  }

  static fromApi({ id, name, image, users, timeEntriesByProject } = {}) {
    return new Team({
      id,
      name,
      image,
      users,
      timeEntriesByProject,
    });
  }
}
