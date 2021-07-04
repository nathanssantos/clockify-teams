import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { observer } from "mobx-react";

import { useStore } from "../../hooks";

import Header from "../Header/Header";

import TeamDetail from "../../screens/TeamDetail/TeamDetail";
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
    <BrowserRouter>
      {store?.authStore?.isAuthenticated ? (
        <>
          <Header />
          <Switch>
            <Route path="/teams/create">
              <CreateTeam />
            </Route>
            <Route path="/teams/:id">
              <TeamDetail />
            </Route>
            <Route path="/teams">
              <Teams />
            </Route>
            <Route path="/users/:id">
              <UserDetail />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/projects/:id">
              <ProjectDetail />
            </Route>
            <Route path="/">
              <Projects />
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
    </BrowserRouter>
  );
};

export default observer(Router);
