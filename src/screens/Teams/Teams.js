/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Container, TextField, Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

import { useStore } from "../../hooks";

import Team from "../../components/Team/Team";

import "./styles.scss";

const Teams = () => {
  const store = useStore();
  const history = useHistory();
  const [filterTerm, setFilterTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    if (filterTerm.length) {
      setFilteredList(
        store.teamStore.teamList.filter((item) =>
          item.name.toLowerCase().includes(filterTerm.toLowerCase())
        )
      );
      return;
    }
    setFilteredList(store.teamStore.teamList);
  }, [filterTerm]);

  useEffect(() => {
    setFilteredList(store.teamStore.teamList);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="screen teams">
      <Container maxWidth="lg">
        <header className="screen__header">
          <h2>Equipes</h2>

          <div className="screen__header__right">
            {store?.teamStore?.teamList?.length ? (
              <TextField
                id="filter-term"
                label="Filtro"
                variant="filled"
                value={filterTerm}
                onChange={(e) => {
                  setFilterTerm(e.target.value);
                }}
              />
            ) : null}
          </div>
        </header>

        <main>
          {!filteredList?.length ? (
            <div>Nenhuma equipe encontrada.</div>
          ) : (
            filteredList.map((team) => (
              <Team
                card
                key={team.id}
                id={team.id}
                name={team?.name}
                image={team?.image}
              />
            ))
          )}
        </main>
      </Container>
      <Fab
        className="teams__create-team"
        color="primary"
        aria-label="Criar equipe"
        onClick={() => {
          history.push("/teams/create");
        }}
      >
        <Add />
      </Fab>
    </div>
  );
};

export default observer(Teams);
