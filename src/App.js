import React, { useEffect, useState } from 'react';
import { flowResult } from 'mobx';
import { wrapRoot } from 'mobx-easy';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import baseAPI from './services/baseAPI';
import RootStore from './stores/containers/rootStore';

import { RootStoreProvider } from './hooks';
import useLocalStorage from './hooks/useLocalStorage';

import Router from './components/Router/Router';
import Theme from './components/Theme/Theme';
import QueryDateSeletor from './components/QueryDateSelector/QueryDateSeletor';

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
    <div className='app'>
      <RootStoreProvider value={rootStore}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Theme>
            <Router />
            <QueryDateSeletor />
          </Theme>
        </MuiPickersUtilsProvider>
      </RootStoreProvider>
    </div>
  );
};

export default App;
