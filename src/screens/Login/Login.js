/* eslint-disable react-hooks/exhaustive-deps */
import { flowResult } from "mobx";
import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import {
  TextField,
  Container,
  Button,
  LinearProgress,
} from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";

import useLocalStorage from "../../hooks/useLocalStorage";
import { useStore } from "../../hooks";

import User from "../../components/User/User";

import "./styles.scss";

const date = new Date();

const Login = () => {
  const store = useStore();
  const [inputValue, setInputValue] = useState("");
  const [fetching, setFetching] = useState(false);
  const [apiKey] = useLocalStorage("clockify-api-key");
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(
    new Date(date.getFullYear(), date.getMonth() + 1, 0)
  );

  const authenticate = async () => {
    setFetching(true);
    await flowResult(store.authStore.authenticate(inputValue));
    setFetching(false);
  };

  const fetchData = async () => {
    store.userStore.setQueryDate(startDate, endDate);
    setFetching(true);
    await flowResult(store.projectStore.fetchProjectList());
    await flowResult(store.userStore.fetchUserList());
    await flowResult(store.userStore.fetchAllUsersTimeEntries());
    store.teamStore.fetchTeamList();
    setFetching(false);
    store.authStore.confirmIdentity();
  };

  useEffect(() => {
    const dataLogContainer = document.querySelector(".login .fetch-data-log");
    if (dataLogContainer) {
      dataLogContainer.scrollTop = dataLogContainer.scrollHeight;
    }
  }, [store.authStore.fetchDataLog.length]);

  useEffect(() => {
    if (apiKey?.length) setInputValue(apiKey);
  }, []);

  return (
    <div className="screen login">
      <Container maxWidth="xl" className="login__container">
        <h1>Clockify Teams</h1>
        <div className="login__box">
          {!store.authStore.isConfirmingIdentity ? (
            <>
              {!store.authStore.autoLogin ? (
                <TextField
                  id="api-key"
                  label="Clockify API Key"
                  variant="filled"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                  }}
                />
              ) : null}
              {fetching || store.authStore.autoLogin ? (
                <LinearProgress />
              ) : (
                <Button variant="outlined" onClick={authenticate}>
                  Autenticar
                </Button>
              )}
            </>
          ) : (
            <>
              <User
                disabled
                name={store?.authStore?.user?.name}
                profilePicture={store?.authStore?.user?.profilePicture}
                email={store?.authStore?.user?.email}
              />
              <div className="query-date">
                <KeyboardDatePicker
                  margin="normal"
                  id="start-date"
                  label="Data inicial"
                  format="dd/MM/yyyy"
                  value={startDate}
                  onChange={setStartDate}
                  KeyboardButtonProps={{
                    "aria-label": "Selecione a data inicial",
                  }}
                />
                <KeyboardDatePicker
                  margin="normal"
                  id="end-date"
                  label="Data final"
                  format="dd/MM/yyyy"
                  value={endDate}
                  onChange={setEndDate}
                  KeyboardButtonProps={{
                    "aria-label": "Selecione a data final",
                  }}
                />
              </div>

              <div className="fetch-data-log">
                {store.authStore.fetchDataLog.map(({ text, color }) => (
                  <div style={{ color }} key={text}>
                    {text}
                  </div>
                ))}
              </div>
              {fetching || store.authStore.autoLogin ? (
                <LinearProgress />
              ) : (
                <Button variant="outlined" onClick={fetchData}>
                  Entrar
                </Button>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default observer(Login);
