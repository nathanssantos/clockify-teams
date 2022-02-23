import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Avatar, Container, FormControlLabel, Switch } from '@material-ui/core';
import { AccessTime } from '@material-ui/icons';

import { useStore } from '../../hooks';

import LineChart from '../../components/Chart/LineChart';
import TimeEntry from '../../components/TimeEntry/TimeEntry';
import Team from '../../components/Team/Team';

import './styles.scss';

const UserDetail = () => {
  const store = useStore();
  const params = useParams();
  const user = store.userStore.userList.find(({ id }) => id === params.id);
  const [filteredTimeEntries, setFilteredTimeEntries] = useState([]);
  const [filterWarnings, setFilterWarnings] = useState(false);

  useEffect(() => {
    if (filterWarnings) {
      setFilteredTimeEntries(
        user.timeEntriesByDay
          .filter((day) =>
            day.timeEntries.find((entry) => entry?.warnings?.length),
          )
          .map((day) => ({
            ...day,
            timeEntries: day.timeEntries.filter(
              (entry) => entry?.warnings?.length,
            ),
          })),
      );
      return;
    }
    setFilteredTimeEntries(user.timeEntriesByDay);
  }, [filterWarnings]);

  useEffect(() => {
    setFilteredTimeEntries(user.timeEntriesByDay);
    window.scrollTo(0, 0);
  }, []);

  if (!user) return null;

  return (
    <div className='screen user-detail'>
      <Container maxWidth='lg'>
        <header className='screen__header'>
          <div className='screen__header__left'>
            <Avatar
              alt={user?.name}
              src={user?.profilePicture}
              className='user-detail__avatar'
            />
            <h2>{user?.name}</h2>
          </div>
          <div
            className='screen__header__right'
            style={{ color: user.hours >= 200 ? '#f44336' : '#ffffff' }}
          >
            {user.hours.toFixed(2)}
            <AccessTime color={user.hours >= 200 ? 'error' : ''} />
          </div>
        </header>
        <main>
          {user?.teams.length ? (
            <div className='user-detail__teams'>
              <header className='section-header'>
                <h3>Equipes do colaborador</h3>
              </header>
              {user.teams.map((team) => (
                <Team
                  // card
                  key={team.id}
                  id={team.id}
                  name={team?.name}
                  image={team?.image}
                />
              ))}
            </div>
          ) : null}

          {user?.timeEntries.length ? (
            <div className='user-detail__chart'>
              <header className='section-header'>
                <h3>Horas por dia</h3>
              </header>
              <LineChart
                data={{
                  labels: user.timeEntriesByDay
                    .map((entry) => entry.date)
                    .reverse(),
                  datasets: [
                    {
                      label: 'Horas',
                      data: user.timeEntriesByDay
                        .map((entry) => entry.hours)
                        .reverse(),
                      backgroundColor: ['rgba(255, 255, 255, 0.1)'],
                      borderColor: ['rgba(255, 255, 255, 0.1)'],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          ) : null}

          {user?.timeEntries?.length ? (
            <div className='time-entries'>
              <header className='section-header'>
                <h3>Entradas de tempo</h3>
                <div className='time-entries__filter'>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={filterWarnings}
                        onChange={() => setFilterWarnings(!filterWarnings)}
                        name='filterWarnings'
                        color='primary'
                      />
                    }
                    label='Filtrar warnings'
                  />
                </div>
              </header>

              {filteredTimeEntries?.length
                ? filteredTimeEntries.map((day) => (
                    <div className='time-entries__day' key={day.date}>
                      <header className='section-header'>
                        <h3>{day.date}</h3>
                      </header>
                      <div className='description'>
                        {day.timeEntries.map((entry) => (
                          <TimeEntry
                            key={entry.id}
                            disabled={!entry?.project?.id}
                            project={entry.project}
                            time={entry.timeInterval.duration}
                            description={entry.description}
                            warnings={entry.warnings}
                            showMeta
                          />
                        ))}
                      </div>
                    </div>
                  ))
                : 'Nenhuma entrada de tempo.'}
            </div>
          ) : null}

          {!user?.timeEntries.length ? (
            <div>
              Nenhuma entrada encontrada para este usuário no período
              selecionado.
            </div>
          ) : null}
        </main>
      </Container>
    </div>
  );
};

export default observer(UserDetail);
