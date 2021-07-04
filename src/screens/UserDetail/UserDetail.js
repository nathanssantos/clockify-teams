/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Container } from "@material-ui/core";

import { useStore } from "../../hooks";

import LineChart from "../../components/Chart/LineChart";
import TimeEntry from "../../components/TimeEntry/TimeEntry";
import Team from "../../components/Team/Team";

import "./styles.scss";

const UserDetail = () => {
  const store = useStore();
  const params = useParams();
  const user = store.userStore.userList.find(
    (project) => project.id === params.id
  );

  store.userStore.fetchUserData(user);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="screen user-detail">
      <Container maxWidth="xl">
        <header className="screen__header">
          <div className="screen__header__left">
            <Avatar
              alt={user?.name}
              src={user?.profilePicture}
              className="user-detail__avatar"
            />
            <h2>{user?.name}</h2>
          </div>
        </header>
        <main>
          {user?.teams.length ? (
            <div className="user-detail__teams">
              <header className="section-header">
                <h3>Equipes do colaborador</h3>
              </header>
              {user.teams.map((team) => (
                <Team
                  key={team.id}
                  id={team.id}
                  name={team?.name}
                  image={team?.image}
                />
              ))}
            </div>
          ) : null}

          {user?.timeEntries.length ? (
            <>
              <div className="user-detail__chart">
                <header className="section-header">
                  <h3>Horas por dia</h3>
                </header>
                <LineChart
                  data={{
                    labels: user.timeEntriesByDay
                      .map((entry) => entry.date)
                      .reverse(),
                    datasets: [
                      {
                        label: "Horas",
                        data: user.timeEntriesByDay
                          .map((entry) => entry.hours)
                          .reverse(),
                        backgroundColor: ["rgba(255, 255, 255, 0.1)"],
                        borderColor: ["rgba(255, 255, 255, 0.1)"],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
            </>
          ) : null}

          {user?.timeEntries?.length ? (
            <div className="time-entries">
              {user.timeEntriesByDay.map((day) => (
                <div className="time-entries__day">
                  <header className="section-header">
                    <h3>{day.date}</h3>
                  </header>
                  <div className="description">
                    {day.timeEntries.map((entry) => (
                      <TimeEntry
                        key={entry.id}
                        disabled={!entry?.project?.id}
                        project={entry.project}
                        time={entry.timeInterval.duration}
                        description={entry.description}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </main>
      </Container>
    </div>
  );
};

export default UserDetail;
