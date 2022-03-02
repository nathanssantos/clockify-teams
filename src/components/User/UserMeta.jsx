/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { flowResult } from 'mobx';
import NumberFormat from 'react-number-format';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { useStore } from '../../hooks';

import { WARNING_TYPES } from '../../stores/containers/userStore';

import { convertFloatIntoTime, masks } from '../../utils';

import './styles.scss';

const { Currency } = masks;

const UserMeta = (props) => {
  const store = useStore();

  const { hours, warnings, error, success, user, pdf } = props;

  const [mounted, setMounted] = useState(false);
  const [fetchingPDF, setFetchingPDF] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportState, setReportState] = useState('idle');
  const [valuePerHour, setValuePerHour] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [total, setTotal] = useState(0);
  const [attachmentsTotal, setAttachmentsTotal] = useState(0);

  const fetchPdf = async () => {
    setFetchingPDF(true);
    await flowResult(store.userStore.fetchUserSummaryReport(user));
    setFetchingPDF(false);
  };

  const getReportState = () => {
    if (success) return '#2ecc71';
    if (error) return '#f44336';

    switch (reportState) {
      case 'success': {
        return '#2ecc71';
      }

      case 'error': {
        return '#f44336';
      }

      default: {
        return '#fff';
      }
    }
  };

  const sendReport = async () => {
    try {
      setReportModalIsOpen(false);
      setSendingReport(true);
      const response = await flowResult(
        store.userStore.sendReport({ collaborator_id: user.id }),
      );

      if (response.error) {
        setReportState('error');
        return;
      }

      setReportState('success');
    } catch (error) {
      console.log(error);
    } finally {
      setSendingReport(false);
    }
  };

  const addNewAttachment = () => {
    setAttachments((prevState) => [
      ...prevState,
      { description: '', value: 0 },
    ]);
  };

  const removeAttachment = (index) => {
    setAttachments((prevState) => prevState.filter((_, i) => index !== i));
  };

  const updateAttachmentsTotal = (_attachments) => {
    let _total = 0;

    if (_attachments?.length > 1) {
      _total += _attachments.reduce(
        (acc, item) => Number(acc.value) + Number(item.value),
      );
    } else if (_attachments.length === 1) {
      _total += Number(_attachments[0].value);
    }

    setAttachmentsTotal(_total);

    return _total;
  };

  const updateTotal = (_attachments) => {
    const _total = hours * valuePerHour;

    const _attachmentsTotal = updateAttachmentsTotal(_attachments);

    setTotal(_total + _attachmentsTotal);
  };

  const getColor = (value) => {
    if (value < 0) return '#f44336';
    if (value > 0) return '#2ecc71';
    return '#fff';
  };

  useEffect(() => {
    if (!mounted) return;

    store.userStore.storeUserMeta({
      id: user.id,
      userMeta: {
        valuePerHour,
        attachments,
      },
    });

    updateTotal(attachments);
  }, [valuePerHour, attachments]);

  useEffect(() => {
    if (user?.meta?.valuePerHour) setValuePerHour(user.meta.valuePerHour);
    if (user?.meta?.attachments) {
      setAttachments(user.meta.attachments.map((item) => ({ ...item })));
    }

    setMounted(true);
  }, []);

  return (
    <div className="user__meta">
      <Box display="flex" alignItems="center" gap={2} padding={2}>
        <div className="user__meta__item" style={{ color: getReportState() }}>
          {pdf ? (
            <IconButton onClick={fetchPdf} disabled={fetchingPDF}>
              {fetchingPDF ? (
                <CircularProgress style={{ width: 20, height: 20 }} />
              ) : (
                <PictureAsPdfIcon />
              )}
            </IconButton>
          ) : null}
        </div>

        <div className="user__meta__item" style={{ color: getReportState() }}>
          <IconButton
            onClick={() => setReportModalIsOpen(true)}
            disabled={sendingReport}
          >
            {sendingReport ? (
              <CircularProgress style={{ width: 20, height: 20 }} />
            ) : (
              <div className="user__meta__payment-report-icon">
                <EmailIcon />
                <div className="user__meta__payment-report-icon__money-icon">
                  <AttachMoneyIcon />
                </div>
              </div>
            )}
          </IconButton>
        </div>

        {Object.entries(warnings).filter(([, value]) => value > 0)?.length ? (
          <Tooltip
            arrow
            placement="left"
            title={
              <ul className="warning-list">
                {Object.entries(warnings)
                  .filter(([, value]) => value > 0)
                  .map(([key, value]) => (
                    <li
                      key={WARNING_TYPES[key]}
                      className="warning-list__item"
                    >{`${value}x ${WARNING_TYPES[key]}`}</li>
                  ))}
              </ul>
            }
          >
            <div className="user__meta__item warning">
              <WarningIcon
                color={
                  warnings.NO_PROJECT > 0 || warnings.NO_DESCRIPTION > 0
                    ? 'error'
                    : 'inherit'
                }
              />
            </div>
          </Tooltip>
        ) : (
          <div className="user__meta__item">
            <CheckIcon color="secondary" />
          </div>
        )}

        <Dialog
          open={reportModalIsOpen}
          onClose={() => setReportModalIsOpen(false)}
        >
          <DialogTitle>{user.name}</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={4} paddingTop={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                gap={2}
                sx={{
                  alignItems: {
                    xs: 'center',
                    sx: 'initial',
                  },
                  flexDirection: {
                    xs: 'row',
                    sm: 'row',
                  },
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  flex={2}
                  style={{ color: hours >= 200 ? '#f44336' : '#ffffff' }}
                >
                  <AccessTimeIcon color={hours >= 200 ? 'error' : ''} />
                  {convertFloatIntoTime(hours)} • {hours.toFixed(2)}
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  flex={1}
                >
                  <TextField
                    id="value-per-hour"
                    label="Per hour"
                    size="small"
                    value={valuePerHour}
                    onChange={(e) => {
                      setValuePerHour(e.target.value);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">R$</InputAdornment>
                      ),
                      inputComponent: Currency,
                    }}
                  />
                </Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                paddingBottom={2}
                style={{ borderBottom: '1px solid rgba(236, 240, 241, 0.5)' }}
              >
                <DialogContentText
                  display="flex"
                  alignItems="center"
                  gap={1}
                  style={{
                    color: hours >= 200 ? '#f44336' : '#ffffff',
                    borderBottom: '1px solid rgba(236, 240, 241, 0.5)',
                  }}
                >
                  Attachments
                </DialogContentText>
                {attachments.map((item, index) => (
                  <Box
                    display="flex"
                    gap={2}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${index}`}
                  >
                    <Box display="flex" flex={1}>
                      <TextField
                        label="Description"
                        size="small"
                        fullWidth
                        value={item.description}
                        onChange={(e) => {
                          setAttachments((prevState) => {
                            const newAttachments = [...prevState];
                            newAttachments[index].description = e.target.value;
                            return newAttachments;
                          });
                        }}
                      />
                    </Box>
                    <Box display="flex" flex={1}>
                      <TextField
                        label="Value"
                        size="small"
                        fullWidth
                        value={item.value}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">R$</InputAdornment>
                          ),
                          inputComponent: Currency,
                        }}
                        onChange={(e) => {
                          setAttachments((prevState) => {
                            const newAttachments = [...prevState];
                            newAttachments[index].value = e.target.value;
                            updateTotal(prevState);
                            return newAttachments;
                          });
                        }}
                      />
                    </Box>
                    <IconButton onClick={() => removeAttachment(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Box alignSelf="flex-end">
                  <IconButton onClick={addNewAttachment}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box alignSelf="flex-end" color={getColor(total)}>
                Total: R${' '}
                <NumberFormat
                  value={total}
                  thousandSeparator="."
                  decimalScale={2}
                  decimalSeparator=","
                  fixedDecimalScale
                  isNumericString
                  displayType="text"
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box display="flex" gap={2}>
              <Button
                autoFocus
                onClick={() => setReportModalIsOpen(false)}
                variant="outlined"
              >
                Close
              </Button>
              <Button
                onClick={sendReport}
                startIcon={<EmailIcon />}
                variant="outlined"
              >
                Send Report
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </Box>
      <Box display="flex" alignItems="center" gap={2} padding={2}>
        <Box
          color={hours >= 200 ? '#f44336' : '#ffffff'}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <Box>{convertFloatIntoTime(hours)}</Box>
          <AccessTimeIcon color={hours >= 200 ? 'error' : ''} />
          R${' '}
          <NumberFormat
            value={valuePerHour}
            thousandSeparator="."
            decimalScale={2}
            decimalSeparator=","
            fixedDecimalScale
            isNumericString
            displayType="text"
          />
        </Box>
        +
        <Box color={getColor(attachmentsTotal)}>
          R${' '}
          <NumberFormat
            value={attachmentsTotal}
            thousandSeparator="."
            decimalScale={2}
            decimalSeparator=","
            fixedDecimalScale
            isNumericString
            displayType="text"
          />
        </Box>
        =
        <Box color={getColor(total)}>
          R${' '}
          <NumberFormat
            value={total}
            thousandSeparator="."
            decimalScale={2}
            decimalSeparator=","
            fixedDecimalScale
            isNumericString
            displayType="text"
          />
        </Box>
      </Box>
    </div>
  );
};

export default observer(UserMeta);
