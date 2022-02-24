/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// import _ from 'lodash';

import { useStore } from '../../hooks';

import User from '../../components/User/User';
// import HorizontalBarChart from '../../components/Chart/HorizontalBarChart';

import './styles.scss';

const TeamDetail = () => {
  const store = useStore();
  const params = useParams();
  const navigate = useNavigate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const team = store.teamStore.teamList.find(
    ({ id }) => id === Number(params.id),
  );

  const openConfirmationModal = () => {
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const removeTeam = () => {
    store.teamStore.removeTeam(team);
    closeConfirmationModal();
    navigate(`/teams`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!team) return null;

  return (
    <>
      <div className="screen team-detail">
        <Container maxWidth="lg">
          <header className="screen__header">
            <div className="screen__header__left">
              <Avatar
                alt={team?.name}
                src={team?.image}
                className="team-detail__avatar"
              />
              <h2>{team?.name}</h2>
            </div>
            <div className="screen__header__right">
              <Button onClick={openConfirmationModal}>
                <DeleteIcon />
              </Button>
            </div>
          </header>

          <main>
            <div className="user-list">
              <header className="section-header">
                <h3>Colaboradores na equipe</h3>
              </header>
              {team?.users?.length
                ? team.users.map((user) => (
                    <User
                      id={user.id}
                      key={user.id}
                      profilePicture={user?.profilePicture}
                      name={user?.name}
                      email={user?.email}
                      hours={user?.hours}
                      warnings={user?.warnings}
                      showMeta
                    />
                  ))
                : null}
            </div>

            {/* {team.timeEntriesByProject?.length ? (
              <>
                <div className="team-detail__chart">
                  <header className="section-header">
                    <h3>Horas por projeto</h3>
                  </header>
                  <HorizontalBarChart
                    data={{
                      labels: _.orderBy(
                        team.timeEntriesByProject,
                        'hours',
                        'desc',
                      ).map((project) => project.name),
                      datasets: [
                        {
                          label: 'Horas',
                          data: _.orderBy(
                            team.timeEntriesByProject,
                            'hours',
                            'desc',
                          ).map((project) =>
                            project?.hours ? project.hours.toFixed(2) : 0,
                          ),
                          backgroundColor: _.orderBy(
                            team.timeEntriesByProject,
                            'hours',
                            'desc',
                          ).map((project) => `${project.color}85`),
                          borderWidth: 0,
                        },
                      ],
                    }}
                  />
                </div>

                <div className="team-detail__chart">
                  <header className="section-header">
                    <h3>Horas por colaborador</h3>
                  </header>
                  <HorizontalBarChart
                    data={{
                      labels: _.orderBy(team.users, 'hours', 'desc').map(
                        (user) => user.name,
                      ),
                      datasets: [
                        {
                          label: 'Horas',
                          data: _.orderBy(team.users, 'hours', 'desc').map(
                            (user) => (user?.hours ? user.hours.toFixed(2) : 0),
                          ),
                          backgroundColor: ['rgba(255, 255, 255, 0.08)'],
                          borderWidth: 0,
                        },
                      ],
                    }}
                  />
                </div>
              </>
            ) : null} */}
          </main>
        </Container>
        <Fab
          className="team-detail__edit-team"
          color="primary"
          aria-label="Editar equipe"
          onClick={() => {
            navigate(`/teams/edit/${team.id}`);
          }}
        >
          <EditIcon />
        </Fab>
      </div>
      <Dialog
        open={showConfirmationModal}
        onClose={closeConfirmationModal}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {`Excluir equipe ${team.name}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Você tem certeza que deseja excluir a equipe ${team.name}?`}
          </DialogContentText>
          <DialogContentText>Esta ação é irreversível.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeConfirmationModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={removeTeam} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default observer(TeamDetail);
