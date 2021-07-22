/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { Container, TextField } from "@material-ui/core";

import { useStore } from "../../hooks";

import User from "../../components/User/User";

const Users = () => {
  const store = useStore();
  const [filterTerm, setFilterTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    if (filterTerm.length) {
      setFilteredList(
        store.userStore.userList.filter((item) =>
          item.name.toLowerCase().includes(filterTerm.toLowerCase())
        )
      );
      return;
    }
    setFilteredList(store.userStore.userList);
  }, [filterTerm]);

  useEffect(() => {
    setFilteredList(store.userStore.userList);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="screen users">
      <Container maxWidth="lg">
        <header className="screen__header">
          <h2>Colaboradoes</h2>

          {store?.userStore?.userList?.length ? (
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
        </header>

        <main>
          {!filteredList?.length ? (
            <div>Nenhum colaborador encontrado.</div>
          ) : (
            filteredList.map((user) => (
              <User
                id={user.id}
                key={user.id}
                profilePicture={user?.profilePicture}
                name={user?.name}
                email={user?.email}
                hours={user?.hours}
                hourValue={user?.hourValue}
                payment={user?.payment}
                showMeta
              />
            ))
          )}
        </main>
      </Container>
    </div>
  );
};

export default observer(Users);
