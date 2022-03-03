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
import DownloadIcon from '@mui/icons-material/Download';
import exportFromJSON from 'export-from-json';

import { flowResult } from 'mobx';
import { useStore, useLocalStorage } from '../../hooks';

import User from '../../components/User/User';
import { formatDate } from '../../utils';

import './styles.scss';

const Users = () => {
  const store = useStore();
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [listState, setListState] = useState([]);
  const [sendingReports, setSendingReports] = useState(false);
  const [reportsModalIsOpen, setReportsModalIsOpen] = useState(false);

  const order = orderBy === 'hours' ? 'desc' : 'asc';

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

  const getTotal = (hours, meta = { valuePerHour: 0, attachments: [] }) => {
    let total = 0;
    const { valuePerHour } = meta;

    if (!meta?.attachments?.length) return hours * valuePerHour;

    if (meta?.attachments?.length > 1) {
      total += meta.attachments.reduce((acc, item) => acc.value + item.value);
    } else if (meta?.attachments?.length === 1) {
      total += Number(meta?.attachments[0].value);
    }

    return hours * valuePerHour + total;
  };

  const exportXLS = async () => {
    const [storedUsersMeta] = useLocalStorage('user-meta');

    try {
      exportFromJSON({
        data: filteredList.map(({ id, name, email, hours, warnings }) => {
          const meta = storedUsersMeta[id];

          console.log(meta);
          return {
            name,
            email,
            hours: hours.toFixed(2),
            valuePerHour: meta?.valuePerHour || 0,
            attachments: meta?.attachments?.length
              ? JSON.stringify(meta.attachments)
              : '',
            total: String(getTotal(hours, meta).toFixed(2)),
            warnings: JSON.stringify(warnings),
          };
        }),
        fileName: `Clockify_Teams_REPORT___from_${formatDate(
          store.userStore.queryStartDate,
        )}_to_${formatDate(store.userStore.queryEndDate)}`,
        exportType: exportFromJSON.types.xls,
      });
    } catch (error) {
      console.log(error);
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
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            gap={2}
          >
            <h2>Collaborators</h2>
            <Button
              onClick={exportXLS}
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="large"
            >
              XLS
            </Button>
          </Box>

          <Box
            className="screen__header__content"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
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
                  <Button
                    onClick={() => setReportsModalIsOpen(true)}
                    disabled={sendingReports}
                    variant="outlined"
                    size="large"
                    sx={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      minWidth: 40,
                    }}
                  >
                    {sendingReports ? (
                      <CircularProgress style={{ width: 20, height: 20 }} />
                    ) : (
                      <EmailIcon />
                    )}
                  </Button>
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
            <div>No collaborator found.</div>
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
                meta={user?.meta}
                checked={listState[index]?.checked}
                requesting={listState[index]?.requesting}
                error={listState[index]?.error}
                success={listState[index]?.success}
                onCheck={(checked) => handleCheck(user.id, checked)}
                showMeta
                pdf
                hasCheckBox
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
