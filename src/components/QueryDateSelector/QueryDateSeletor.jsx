/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { flowResult } from 'mobx';
import { observer } from 'mobx-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import SearchIcon from '@mui/icons-material/Search';

import { Box } from '@mui/material';
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
    <div className="query-date-selector">
      <div className="query-date-selector__loader">
        <Loader active={fetching} />
      </div>

      <Box className="query-date-selector__content" gap={2}>
        <Box
          display="flex"
          gap={2}
          width={{ xs: '100%', md: 'initial' }}
          flex={{ md: 3 }}
        >
          <Box flex={{ xs: 1 }}>
            <DatePicker
              views={['day']}
              label="Data inicial"
              value={startDate}
              disabled={fetching}
              onChange={setStartDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={null}
                  size="small"
                  fullWidth
                  sx={{ width: '100%' }}
                />
              )}
            />
          </Box>
          <Box flex={{ xs: 1 }}>
            <DatePicker
              views={['day']}
              label="Data final"
              value={endDate}
              disabled={fetching}
              onChange={setEndDate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  helperText={null}
                  size="small"
                  sx={{ width: '100%' }}
                />
              )}
            />
          </Box>
        </Box>

        <Box width={{ xs: '100%', sm: 'initial' }}>
          <Button
            fullWidth
            variant="outlined"
            disabled={fetching}
            onClick={fetchData}
            className="query-date-selector__bt-search"
          >
            <SearchIcon />
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default observer(QueryDateSeletor);
