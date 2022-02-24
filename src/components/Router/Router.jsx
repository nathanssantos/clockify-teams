import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react';

import { useStore } from '../../hooks';

import Header from '../Header/Header';

import TeamDetail from '../../screens/TeamDetail/TeamDetail';
import EditTeam from '../../screens/EditTeam/EditTeam';
import CreateTeam from '../../screens/CreateTeam/CreateTeam';
import Teams from '../../screens/Teams/Teams';
import UserDetail from '../../screens/UserDetail/UserDetail';
import Users from '../../screens/Users/Users';
import Projects from '../../screens/Projects/Projects';
import ProjectDetail from '../../screens/ProjectDetail/ProjectDetail';
import Login from '../../screens/Login/Login';

const Router = () => {
  const store = useStore();

  return (
    <HashRouter>
      {store?.authStore?.isAuthenticated ? (
        <>
          <Header />
          <Routes>
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/teams/edit/:id" element={<EditTeam />} />
            <Route path="/teams/create" element={<CreateTeam />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/" element={<Users />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      )}
    </HashRouter>
  );
};

export default observer(Router);
