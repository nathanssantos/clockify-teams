import AuthStore from "./authStore";
import UserStore from "./userStore";
import ProjectStore from "./projectStore";
import TeamStore from "./teamStore";

export default class RootStore {
  authStore = null;
  userStore = null;
  projectStore = null;
  teamStore = null;

  init() {
    this.authStore = new AuthStore();
    this.userStore = new UserStore();
    this.projectStore = new ProjectStore();
    this.teamStore = new TeamStore();
  }
}
