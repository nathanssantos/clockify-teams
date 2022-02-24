/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { flowResult } from 'mobx';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { Box } from '@mui/system';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useStore } from '../../hooks';

import User from '../../components/User/User';

import './styles.scss';

const Login = () => {
  const store = useStore();
  const [inputValue, setInputValue] = useState('');
  const [fetching, setFetching] = useState(false);
  const [apiKey] = useLocalStorage('clockify-api-key');

  const authenticate = async () => {
    setFetching(true);
    await flowResult(store.authStore.authenticate(inputValue));
    setFetching(false);
  };

  useEffect(() => {
    const dataLogContainer = document.querySelector('.login .fetch-data-log');
    if (dataLogContainer) {
      dataLogContainer.scrollTop = dataLogContainer.scrollHeight;
    }
  }, [store.authStore.fetchDataLog.length]);

  useEffect(() => {
    if (apiKey?.length) setInputValue(apiKey);
  }, []);

  return (
    <div className="screen login">
      <Container maxWidth="lg" className="login__container">
        <Box position="relative">
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
                    Entrar
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

                <div className="fetch-data-log">
                  {store.authStore.fetchDataLog.map(({ text, color }) => (
                    <div style={{ color }} key={text}>
                      {text}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default observer(Login);
