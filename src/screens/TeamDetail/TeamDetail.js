/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@material-ui/core";
import _ from "lodash";

import { useStore } from "../../hooks";

import User from "../../components/User/User";
import HorizontalBarChart from "../../components/Chart/HorizontalBarChart";

import "./styles.scss";
import { Avatar } from "@material-ui/core";

const TeamDetail = () => {
  const store = useStore();
  const params = useParams();
  const [team, setTeam] = useState(null);
  const teamData = store.teamStore.teamList.find(
    (team) => team.id === Number(params.id)
  );

  useEffect(() => {
    setTeam(teamData);
  }, [teamData]);

  useEffect(() => {
    store.teamStore.fetchTeamTimeEntries(teamData);
    window.scrollTo(0, 0);
  }, []);

  if (!team) return null;

  return (
    <div className="screen team-detail">
      <Container maxWidth="xl">
        <header className="screen__header">
          <div className="screen__header__left">
            <Avatar
              alt={team?.name}
              src={team?.image}
              className="team-detail__avatar"
            />
            <h2>Equipe {team?.name}</h2>
          </div>
        </header>

        <main>
          {team?.fetchedTimeEntries ? (
            <>
              <div className="team-detail__chart">
                <header className="section-header">
                  <h3>Horas por projeto</h3>
                </header>
                <HorizontalBarChart
                  data={{
                    labels: _.orderBy(
                      team.timeEntriesByProject,
                      "hours",
                      "desc"
                    ).map((project) => project.name),
                    datasets: [
                      {
                        label: "Horas",
                        data: _.orderBy(
                          team.timeEntriesByProject,
                          "hours",
                          "desc"
                        ).map((project) =>
                          project?.hours ? project.hours.toFixed(2) : 0
                        ),
                        backgroundColor: _.orderBy(
                          team.timeEntriesByProject,
                          "hours",
                          "desc"
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
                    labels: _.orderBy(team.users, "hours", "desc").map(
                      (user) => user.name
                    ),
                    datasets: [
                      {
                        label: "Horas",
                        data: _.orderBy(team.users, "hours", "desc").map(
                          (user) => (user?.hours ? user.hours.toFixed(2) : 0)
                        ),
                        backgroundColor: ["rgba(255, 255, 255, 0.08)"],
                        borderWidth: 0,
                      },
                    ],
                  }}
                />
              </div>
            </>
          ) : null}

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
                    hourValue={user?.hourValue}
                    payment={user?.payment}
                  />
                ))
              : null}
          </div>
        </main>
      </Container>
    </div>
  );
};

export default TeamDetail;
