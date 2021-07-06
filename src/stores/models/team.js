import { makeObservable, observable } from "mobx";

export default class Team {
  id = null;
  name = null;
  image = null;
  users = [];
  fetchedTimeEntries = false;
  timeEntriesByProject = [];

  constructor(newTeam) {
    makeObservable(this, {
      id: observable,
      name: observable,
      image: observable,
      users: observable,
      fetchedTimeEntries: observable,
      timeEntriesByProject: observable,
    });

    console.log(newTeam.id);
    if (newTeam == null || newTeam.id == null) {
      throw new Error("Invalid Team constructor");
    }

    const { id, name, image, users, fetchedTimeEntries, timeEntriesByProject } =
      newTeam;

    this.id = id;
    this.name = name || "";
    this.image = image || "";
    this.users = users || [];
    this.fetchedTimeEntries = fetchedTimeEntries || false;
    this.timeEntriesByProject = timeEntriesByProject || [];
  }

  static fromApi({
    id,
    name,
    image,
    users,
    fetchedTimeEntries,
    timeEntriesByProject,
  } = {}) {
    return new Team({
      id,
      name,
      image,
      users,
      fetchedTimeEntries,
      timeEntriesByProject,
    });
  }
}
