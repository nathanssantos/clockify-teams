/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { flowResult } from 'mobx';
import { wrapRoot } from 'mobx-easy';
import ptBrLocale from 'date-fns/locale/pt-BR';
// import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import DateFnsUtils from '@date-io/date-fns';

import baseAPI from './services/baseAPI';
import RootStore from './stores/containers/rootStore';

import { RootStoreProvider } from './hooks/useStore';
import useLocalStorage from './hooks/useLocalStorage';

import Router from './components/Router/Router';
import ThemeProvider from './components/ThemeProvider/ThemeProvider';
import QueryDateSeletor from './components/QueryDateSelector/QueryDateSeletor';

window.cptable = {};

const App = () => {
  const [rootStore, setRootStore] = useState(null);
  const [apiKey] = useLocalStorage('clockify-api-key');

  const init = async () => {
    const newRootStore = wrapRoot({ RootStore, env: baseAPI });
    setRootStore(newRootStore);

    if (apiKey?.length) {
      newRootStore.authStore.setAutoLogin(true);
      await flowResult(newRootStore.authStore.authenticate(apiKey));
      newRootStore.authStore.setAutoLogin(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (!rootStore) return null;

  return (
    <div className="app">
      <RootStoreProvider value={rootStore}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBrLocale}>
          <ThemeProvider>
            <Router />
            <QueryDateSeletor />
          </ThemeProvider>
        </LocalizationProvider>
      </RootStoreProvider>
    </div>
  );
};

export default App;
