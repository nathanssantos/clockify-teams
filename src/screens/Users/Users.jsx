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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';

import { flowResult } from 'mobx';
import { useStore } from '../../hooks';

import User from '../../components/User/User';

const Users = () => {
  const store = useStore();
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [listState, setListState] = useState([]);
  const [sendingReports, setSendingReports] = useState(false);
  const [reportsModalIsOpen, setReportsModalIsOpen] = useState(false);

  const sendReports = async (_photos) => {
    try {
      setSendingReports(true);

      setListState((list) =>
        list.map((item) =>
          _photos.map(({ id }) => id).includes(item.id)
            ? { ...item, requesting: true }
            : item,
        ),
      );

      const response = await flowResult(
        store.userStore.sendReports({
          collaborator_ids: _photos.map(({ id }) => id),
        }),
      );

      if (response.error) {
        // toast.error(SYSTEM_INSTABILITY);
        return;
      }

      // onDeletePhoto();
    } catch (error) {
      console.log(error);
    } finally {
      setSendingReports(false);

      setListState((list) =>
        list.map((item) =>
          _photos.map(({ id }) => id).includes(item.id)
            ? { ...item, requesting: false }
            : item,
        ),
      );
    }
  };

  const sendSelectedReports = async () => {
    try {
      setSendingReports(true);
      setReportsModalIsOpen(false);

      const photosToDelete = filteredList.filter(
        (_, index) => listState[index].checked && !listState[index].requesting,
      );

      await sendReports(photosToDelete);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingReports(false);
    }
  };

  const handleCheck = (id, checked) => {
    setListState((list) =>
      list.map((item) => (item.id === id ? { ...item, checked } : item)),
    );
  };

  const handleCheckAll = (checked) => {
    setListState((list) => list.map((item) => ({ ...item, checked })));
  };

  useEffect(() => {
    const order = orderBy === 'hours' ? 'desc' : 'asc';

    if (filterTerm.length) {
      setFilteredList(
        _.orderBy(
          store.userStore.userList.filter((item) =>
            item.name.toLowerCase().includes(filterTerm.toLowerCase()),
          ),
          orderBy,
          order,
        ),
      );
      return;
    }

    setFilteredList(_.orderBy(store.userStore.userList, orderBy, order));
  }, [filterTerm]);

  useEffect(() => {
    const order = orderBy === 'hours' ? 'desc' : 'asc';

    setFilteredList((prevList) => _.orderBy(prevList, orderBy, order));
  }, [orderBy]);

  useEffect(() => {
    setFilteredList(_.orderBy(store.userStore.userList, orderBy));
    setListState(
      _.orderBy(store.userStore.userList, orderBy).map(({ id }) => ({
        id,
        checked: false,
        requesting: false,
        error: false,
        sent: false,
      })),
    );

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="screen users">
      <Container maxWidth="lg">
        <Box
          component="header"
          className="screen__header"
          sx={{
            flexDirection: { sm: 'column' },
            alignItems: { sm: 'flex-start' },
          }}
        >
          <h2>Collaborators</h2>

          <Box
            className="screen__header__content"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                marginLeft: 1,
              }}
            >
              <Checkbox
                checked={!listState.find((item) => item.checked === false)}
                onChange={(event) => handleCheckAll(event.target.checked)}
                color="primary"
                disabled={sendingReports}
              />

              {listState.filter((item) => item.checked).length ? (
                <div className="screen__header__content__item">
                  <IconButton
                    onClick={() => setReportsModalIsOpen(true)}
                    disabled={sendingReports}
                  >
                    {sendingReports ? (
                      <CircularProgress style={{ width: 20, height: 20 }} />
                    ) : (
                      <EmailIcon />
                    )}
                  </IconButton>
                </div>
              ) : null}
            </Box>
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
                    label="Filter"
                    size="small"
                    value={filterTerm}
                    onChange={(e) => {
                      setFilterTerm(e.target.value);
                    }}
                  />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>

        <main>
          {!filteredList?.length ? (
            <div>No collaborators found.</div>
          ) : (
            filteredList.map((user, index) => (
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
                checked={listState[index]?.checked}
                requesting={listState[index]?.requesting}
                error={listState[index]?.error}
                success={listState[index]?.success}
                onCheck={(checked) => handleCheck(user.id, checked)}
                showMeta
                pdf
              />
            ))
          )}
        </main>
        <Dialog
          open={reportsModalIsOpen}
          onClose={() => setReportsModalIsOpen(false)}
        >
          <DialogTitle>Report</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {` Send report to ${
                listState.filter((item) => item.checked).length
              } collaborators?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={() => setReportsModalIsOpen(false)}
              color="primary"
            >
              Cancel
            </Button>
            <Button onClick={sendSelectedReports} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default observer(Users);
