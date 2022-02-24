/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import _ from 'lodash';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { Box } from '@mui/system';
import { useStore } from '../../hooks';

import User from '../../components/User/User';

const Users = () => {
  const store = useStore();
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [orderBy, setOrderBy] = useState('name');

  useEffect(() => {
    if (filterTerm.length) {
      setFilteredList(
        store.userStore.userList.filter((item) =>
          item.name.toLowerCase().includes(filterTerm.toLowerCase()),
        ),
      );
      return;
    }
    setFilteredList(store.userStore.userList);
  }, [filterTerm]);

  useEffect(() => {
    const order = orderBy === 'hours' ? 'desc' : 'asc';

    setFilteredList((prevList) => _.orderBy(prevList, orderBy, order));
  }, [orderBy]);

  useEffect(() => {
    setFilteredList(_.orderBy(store.userStore.userList, orderBy));
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="screen users">
      <Container maxWidth="lg">
        <Box component="header" className="screen__header">
          <h2>Colaboradores</h2>

          <Box display="flex" gap={2} width={{ xs: '100%', sm: 'initial' }}>
            {store?.userStore?.userList?.length ? (
              <Box flex={{ xs: 2 }}>
                <FormControl fullWidth sx={{ minWidth: { sm: 150 } }}>
                  <InputLabel id="order-by-label">Order by</InputLabel>
                  <Select
                    labelId="order-by-label"
                    id="order-by"
                    value={orderBy}
                    label="Order by"
                    onChange={(event) => setOrderBy(event.target.value)}
                    size="small"
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="email">E-mail</MenuItem>
                    <MenuItem value="hours">Workload</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            ) : null}

            {store?.userStore?.userList?.length ? (
              <Box flex="3">
                <TextField
                  fullWidth
                  id="filter-term"
                  label="Filtro"
                  size="small"
                  // variant="filled"
                  value={filterTerm}
                  onChange={(e) => {
                    setFilterTerm(e.target.value);
                  }}
                />
              </Box>
            ) : null}
          </Box>
        </Box>

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
                lastName={user?.lastName}
                email={user?.email}
                hours={user?.hours}
                payment={user?.payment}
                warnings={user?.warnings}
                showMeta
                pdf
              />
            ))
          )}
        </main>
      </Container>
    </div>
  );
};

export default observer(Users);
