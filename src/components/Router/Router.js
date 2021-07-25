import React from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import { observer } from "mobx-react";

import { useStore } from "../../hooks";

import Header from "../Header/Header";

import TeamDetail from "../../screens/TeamDetail/TeamDetail";
import EditTeam from "../../screens/EditTeam/EditTeam";
import CreateTeam from "../../screens/CreateTeam/CreateTeam";
import Teams from "../../screens/Teams/Teams";
import UserDetail from "../../screens/UserDetail/UserDetail";
import Users from "../../screens/Users/Users";
import Projects from "../../screens/Projects/Projects";
import ProjectDetail from "../../screens/ProjectDetail/ProjectDetail";
import Login from "../../screens/Login/Login";

const Router = () => {
  const store = useStore();

  return (
    <HashRouter>
      {store?.authStore?.isAuthenticated ? (
        <>
          <Header />
          <Switch>
            <Route path="/users/:id">
              <UserDetail />
            </Route>
            <Route path="/projects/:id">
              <ProjectDetail />
            </Route>
            <Route path="/projects">
              <Projects />
            </Route>
            <Route path="/teams/edit/:id">
              <EditTeam />
            </Route>
            <Route path="/teams/create">
              <CreateTeam />
            </Route>
            <Route path="/teams/:id">
              <TeamDetail />
            </Route>
            <Route path="/teams">
              <Teams />
            </Route>
            <Route path="/">
              <Users />
            </Route>
          </Switch>
        </>
      ) : (
        <Switch>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      )}
    </HashRouter>
  );
};

export default observer(Router);
