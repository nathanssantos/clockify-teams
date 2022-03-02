import { makeObservable, observable } from 'mobx';

export default class User {
  id = null;

  name = null;

  email = null;

  defaultWorkspace = null;

  profilePicture = null;

  timeEntries = [];

  timeEntriesByDay = [];

  teams = [];

  hours = null;

  warnings = {};

  meta = {
    valuePerHour: 0,
    attachments: [],
  };

  constructor(newUser) {
    makeObservable(this, {
      id: observable,
      name: observable,
      email: observable,
      defaultWorkspace: observable,
      profilePicture: observable,
      timeEntries: observable,
      timeEntriesByDay: observable,
      teams: observable,
      hours: observable,
      warnings: observable,
      meta: observable,
    });

    if (newUser == null || newUser.id == null) {
      throw new Error('Invalid user constructor');
    }

    const {
      id,
      name,
      email,
      defaultWorkspace,
      profilePicture,
      timeEntries,
      timeEntriesByDay,
      teams,
      hours,
      warnings,
      meta,
    } = newUser;

    this.id = id;
    this.name = name || '';
    this.email = email || '';
    this.defaultWorkspace = defaultWorkspace || '';
    this.profilePicture = profilePicture || '';
    this.timeEntries = timeEntries || [];
    this.timeEntriesByDay = timeEntriesByDay || [];
    this.teams = teams || [];
    this.hours = hours || 0;
    this.warnings = warnings || {};
    this.meta = meta || {};
  }

  static fromApi({
    id,
    name,
    email,
    defaultWorkspace,
    profilePicture,
    timeEntries,
    timeEntriesByDay,
    teams,
    hours,
    warnings,
    meta,
  } = {}) {
    return new User({
      id,
      name,
      email,
      defaultWorkspace,
      profilePicture,
      timeEntries,
      timeEntriesByDay,
      teams,
      hours,
      warnings,
      meta,
    });
  }
}
