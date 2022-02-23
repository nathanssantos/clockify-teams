import React, { useState } from 'react';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react';
import { Button } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { Search } from '@material-ui/icons';

import { useStore } from '../../hooks';
import Loader from '../Loader/Loader';

import './styles.scss';

const date = new Date();

const QueryDateSeletor = () => {
  const store = useStore();
  const [fetching, setFetching] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(date.getFullYear(), date.getMonth(), 1),
  );
  const [endDate, setEndDate] = useState(
    new Date(date.getFullYear(), date.getMonth() + 1, 0),
  );

  const fetchData = async () => {
    store.authStore.clearDataLog();
    store.authStore.setStatusConfirmingIdentity();
    store.userStore.setQueryDate(startDate, endDate);
    setFetching(true);
    await flowResult(store.projectStore.fetchProjectList());
    await flowResult(store.userStore.fetchUserList());
    store.projectStore.formatProjectList();
    store.teamStore.fetchTeamList();
    store.userStore.getUsersTeams();
    setFetching(false);
    store.authStore.confirmIdentity();
  };

  if (store.authStore.isUnauthenticated) return null;

  return (
    <div className='query-date-selector'>
      <Loader active={fetching} />

      <div className='query-date-selector__content'>
        <KeyboardDatePicker
          inputVariant='filled'
          id='start-date'
          label='Data inicial'
          format='dd/MM/yyyy'
          value={startDate}
          onChange={setStartDate}
          KeyboardButtonProps={{
            'aria-label': 'Selecione a data inicial',
          }}
          disabled={fetching}
        />
        <KeyboardDatePicker
          inputVariant='filled'
          id='end-date'
          label='Data final'
          format='dd/MM/yyyy'
          value={endDate}
          onChange={setEndDate}
          KeyboardButtonProps={{
            'aria-label': 'Selecione a data final',
          }}
          disabled={fetching}
        />
        <Button
          variant='outlined'
          disabled={fetching}
          onClick={fetchData}
          className='query-date-selector__bt-search'
        >
          <Search />
        </Button>
      </div>
    </div>
  );
};

export default observer(QueryDateSeletor);
