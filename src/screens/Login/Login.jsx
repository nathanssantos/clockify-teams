/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { flowResult } from 'mobx';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';

import useLocalStorage from '../../hooks/useLocalStorage';
import { useStore } from '../../hooks';

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
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          flexDirection="column"
          width="100%"
          maxWidth="400px"
        >
          <h1>Clockify Teams</h1>
          <Box className="login__box" width="100%">
            {!store.authStore.isConfirmingIdentity ? (
              <>
                {!store.authStore.autoLogin ? (
                  <TextField
                    id="api-key"
                    label="Clockify API Key"
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
                <div className="login__user">
                  <Avatar
                    alt={store?.authStore?.user?.name}
                    src={store?.authStore?.user?.profilePicture}
                    className="login__user__avatar"
                  />
                  <div className="login__user__profile">
                    <div className="login__user__name">
                      {store?.authStore?.user?.name}
                    </div>
                    <div className="login__user__email">
                      {store?.authStore?.user?.email}
                    </div>
                  </div>

                  <div className="login__user__logout">
                    <IconButton onClick={store.authStore.unauthenticate}>
                      <LogoutIcon />
                    </IconButton>
                  </div>
                </div>

                <Box className="fetch-data-log" width="100%">
                  {store.authStore.fetchDataLog.map(({ text, color }) => (
                    <div style={{ color }} key={text}>
                      {text}
                    </div>
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default observer(Login);
