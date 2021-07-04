/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@material-ui/core";
import _ from "lodash";

import { useStore } from "../../hooks";

import User from "../../components/User/User";
import HorizontalBarChart from "../../components/Chart/HorizontalBarChart";

import "./styles.scss";

const TeamDetail = () => {
  const store = useStore();
  const params = useParams();
  const [project, setProject] = useState(null);
  const projectData = store.projectStore.projectList.find(
    (project) => project.id === params.id
  );

  useEffect(() => {
    setProject(projectData);
  }, [projectData]);

  useEffect(() => {
    store.projectStore.fetchProjectTimeEntries(projectData);
    window.scrollTo(0, 0);
  }, []);

  if (!project) return null;

  return (
    <div className="screen team-detail">
      <Container maxWidth="xl">
        <header className="screen__header">
          <div className="screen__header__left">
            <h2>{project?.name}</h2>
          </div>
        </header>
        <main>
          {project?.fetchedTimeEntries && project?.timeEntriesByUser.length ? (
            <>
              <div className="team-detail__chart">
                <header className="section-header">
                  <h3>Horas por colaborador</h3>
                </header>
                <HorizontalBarChart
                  data={{
                    labels: _.orderBy(
                      project.timeEntriesByUser,
                      "hours",
                      "desc"
                    ).map((user) => user.name),
                    datasets: [
                      {
                        label: "Horas",
                        data: _.orderBy(
                          project.timeEntriesByUser,
                          "hours",
                          "desc"
                        ).map((user) =>
                          user?.hours ? user.hours.toFixed(2) : 0
                        ),
                        backgroundColor: [`${project.color}85`],
                        borderWidth: 0,
                      },
                    ],
                  }}
                />
              </div>
            </>
          ) : null}

          {project?.timeEntriesByUser?.length ? (
            <div className="user-list">
              <header className="section-header">
                <h3>Colaboradores no projeto</h3>
              </header>
              {project.timeEntriesByUser.map((user) => (
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
              ))}
            </div>
          ) : null}

          {project?.fetchedTimeEntries &&
          !project?.timeEntriesByUser.length &&
          !project?.timeEntriesByUser?.length ? (
            <div>
              Nenhuma entrada encontrada para este projeto no período
              selecionado.
            </div>
          ) : null}
        </main>
      </Container>
    </div>
  );
};

export default TeamDetail;
