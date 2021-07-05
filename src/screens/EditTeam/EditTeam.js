/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { TextField, Button, Container } from "@material-ui/core";
import { ArrowBack, ArrowForward } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import _ from "lodash";

import { useStore } from "../../hooks";

import User from "../../components/User/User";
import Team from "../../components/Team/Team";

import "./styles.scss";

const EditTeam = () => {
  const store = useStore();
  const params = useParams();
  const history = useHistory();
  const teamData = store.teamStore.teamList.find(
    (team) => team.id === Number(params.id)
  );
  const [teamName, setTeamName] = useState("");
  const [teamImage, setTeamImage] = useState("");
  const [userList, setUserList] = useState([]);
  const [newUserList, setNewUserList] = useState([]);

  const addUser = (_user) => {
    setUserList(
      _.sortBy(
        userList.filter((user) => user.id !== _user.id),
        "name"
      )
    );
    setNewUserList(_.sortBy([...newUserList, _user], "name"));
  };

  const removeUser = (_user) => {
    setNewUserList(
      _.sortBy(
        newUserList.filter((user) => user.id !== _user.id),
        "name"
      )
    );
    setUserList(_.sortBy([...userList, _user], "name"));
  };

  const editTeam = async () => {
    const newTeamId = await store.teamStore.editTeam(teamData.id, {
      name: teamName,
      image: teamImage,
      users: newUserList,
    });

    history.push(`/teams/${newTeamId}`);

    if (newTeamId) alert(`A equipe ${teamName} foi criada.`);
  };

  useEffect(() => {
    for (const user of teamData.users) {
      console.log(teamData.users);
      addUser(user);
    }
  }, [teamData]);

  useEffect(() => {
    setUserList(store.userStore.userList);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="screen create-team">
      <Container maxWidth="xl">
        <header className="screen__header">
          <h2>{`Editar equipe ${teamData.name}`}</h2>
        </header>

        <main>
          <div className="create-team__form">
            <div className="create-team__form__content">
              <TextField
                id="team-name"
                label="Nome"
                variant="filled"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                }}
              />
              <TextField
                id="team-image"
                label="Imagem"
                variant="filled"
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
            <Button variant="outlined" onClick={editTeam}>
              Salvar Alterações
            </Button>
          </div>

          <div className="create-team__user-lists">
            <div className="user-list">
              <header className="section-header">
                <h3>Todos os colaboradores</h3>
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
                    hourValue={user?.hourValue}
                    payment={user?.payment}
                  />
                  <Button
                    className="user-list__item__bt-add"
                    onClick={() => addUser(user)}
                  >
                    <ArrowForward />
                  </Button>
                </div>
              ))}
            </div>
            <div className="user-list">
              <header className="section-header">
                <h3>Colaboradores na equipe</h3>
              </header>
              {newUserList.map((user) => (
                <div className="user-list__item" key={user.id}>
                  <Button
                    className="user-list__item__bt-add"
                    onClick={() => removeUser(user)}
                  >
                    <ArrowBack />
                  </Button>
                  <User
                    id={user.id}
                    profilePicture={user?.profilePicture}
                    name={user?.name}
                    email={user?.email}
                    hours={user?.hours}
                    hourValue={user?.hourValue}
                    payment={user?.payment}
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

export default observer(EditTeam);
