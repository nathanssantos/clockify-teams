/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@material-ui/core";
import { observer } from "mobx-react";
import _ from "lodash";

import { useStore } from "../../hooks";
import getDuration from "../../utils/getDuration";

import User from "../../components/User/User";
import HorizontalBarChart from "../../components/Chart/HorizontalBarChart";

import "./styles.scss";

const ProjectDetail = () => {
  const store = useStore();
  const params = useParams();
  const project = store.projectStore.projectList.find(
    (project) => project.id === params.id
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) return null;

  return (
    <div className="screen project-detail">
      <Container maxWidth="lg">
        <header className="screen__header">
          <div className="screen__header__left">
            <h2>{project?.name}</h2>
          </div>
          <div className="screen__header__right">
            {
              <div className="project-detail__estimate">
                <div>
                  {`Estimativa: ${getDuration(
                    project?.estimate.estimate
                  )} horas`}
                </div>
                <div>
                  {`Total: ${getDuration(project?.duration).toFixed(2)} horas`}
                </div>

                {getDuration(project?.estimate.estimate) &&
                getDuration(project?.duration) ? (
                  <div>
                    {`Esforço: ${(
                      (getDuration(project?.duration) /
                        getDuration(project?.estimate.estimate)) *
                      100
                    ).toFixed(2)}%`}
                  </div>
                ) : null}
              </div>
            }
          </div>
        </header>
        <main>
          {project?.timeEntriesByUser.length ? (
            <>
              <div className="project-detail__chart">
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
                />
              ))}
            </div>
          ) : null}

          {!project?.timeEntriesByUser?.length ? (
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

export default observer(ProjectDetail);
