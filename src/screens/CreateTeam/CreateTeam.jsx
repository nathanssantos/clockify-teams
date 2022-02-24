/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { useStore } from '../../hooks';

import User from '../../components/User/User';
import Team from '../../components/Team/Team';

import './styles.scss';

const CreateTeam = () => {
  const store = useStore();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [teamImage, setTeamImage] = useState('');
  const [userList, setUserList] = useState([]);
  const [newUserList, setNewUserList] = useState([]);

  const addUser = (_user) => {
    setUserList(
      _.sortBy(
        userList.filter((user) => user.id !== _user.id),
        'name',
      ),
    );
    setNewUserList(_.sortBy([...newUserList, _user], 'name'));
  };

  const removeUser = (_user) => {
    setNewUserList(
      _.sortBy(
        newUserList.filter((user) => user.id !== _user.id),
        'name',
      ),
    );
    setUserList(_.sortBy([...userList, _user], 'name'));
  };

  const createTeam = async () => {
    const newTeamId = store.teamStore.createTeam({
      name: teamName,
      image: teamImage,
      users: newUserList,
    });

    store.teamStore.fetchTeamList();

    navigate(`/teams/${newTeamId}`);

    if (newTeamId) alert(`Team ${teamName} created.`);
  };

  useEffect(() => {
    setUserList(store.userStore.userList);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="screen create-team">
      <Container maxWidth="lg">
        <header className="screen__header">
          <h2>Create team</h2>
        </header>

        <main>
          <div className="create-team__form">
            <div className="create-team__form__content">
              <TextField
                id="team-name"
                label="Name"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                }}
              />
              <TextField
                id="team-image"
                label="Image"
                value={teamImage}
                onChange={(e) => {
                  setTeamImage(e.target.value);
                }}
              />
              {teamName?.length || teamImage?.length ? (
                <div className="screen__header__preview">
                  <Team
                    name={teamName}
                    image={teamImage}
                    avatarSize={80}
                    fontSize={22}
                    disabled
                  />
                </div>
              ) : null}
            </div>
            <Button variant="outlined" onClick={createTeam}>
              Create
            </Button>
          </div>

          <div className="create-team__user-lists">
            <div className="user-list">
              <header className="section-header">
                <h3>All collaborators</h3>
              </header>
              {userList.map((user) => (
                <div className="user-list__item" key={user.id}>
                  <User
                    key={user.id}
                    id={user.id}
                    profilePicture={user?.profilePicture}
                    name={user?.name}
                    email={user?.email}
                    hours={user?.hours}
                  />
                  <Button
                    className="user-list__item__bt-add"
                    onClick={() => addUser(user)}
                  >
                    <ArrowForwardIcon />
                  </Button>
                </div>
              ))}
            </div>
            <div className="user-list">
              <header className="section-header">
                <h3>Selected collaborators</h3>
              </header>
              {newUserList.map((user) => (
                <div className="user-list__item" key={user.id}>
                  <Button
                    className="user-list__item__bt-add"
                    onClick={() => removeUser(user)}
                  >
                    <ArrowBackIcon />
                  </Button>
                  <User
                    id={user.id}
                    profilePicture={user?.profilePicture}
                    name={user?.name}
                    email={user?.email}
                    hours={user?.hours}
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </Container>
    </div>
  );
};

export default observer(CreateTeam);
