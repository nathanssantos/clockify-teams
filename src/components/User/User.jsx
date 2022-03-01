/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import WarningIcon from '@mui/icons-material/Warning';
import CheckIcon from '@mui/icons-material/Check';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';

import PropTypes from 'prop-types';

import { flowResult } from 'mobx';

import { useStore } from '../../hooks';

import { WARNING_TYPES } from '../../stores/containers/userStore';

import { convertFloatIntoTime } from '../../utils';

import './styles.scss';

const UserMeta = (props) => {
  const store = useStore();

  const { hours, warnings, error, success, user, pdf } = props;

  const [fetchingPDF, setFetchingPDF] = useState(false);
  const [sendingReport, setSendingReport] = useState(false);
  const [reportModalIsOpen, setReportModalIsOpen] = useState(false);
  const [reportState, setReportState] = useState('idle');

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

  return (
    <div className="user__meta">
      <div
        className="user__meta__item"
        style={{ color: hours >= 200 ? '#f44336' : '#ffffff' }}
      >
        {convertFloatIntoTime(hours)} • {hours.toFixed(2)}
        <AccessTimeIcon color={hours >= 200 ? 'error' : ''} />
      </div>

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
        <IconButton onClick={setReportModalIsOpen} disabled={sendingReport}>
          {sendingReport ? (
            <CircularProgress style={{ width: 20, height: 20 }} />
          ) : (
            <EmailIcon />
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
        <DialogTitle>Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Send report to "${user.email}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={() => setReportModalIsOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={sendReport} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

UserMeta.propTypes = {
  hours: PropTypes.number.isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
  pdf: PropTypes.bool,
  warnings: PropTypes.instanceOf(Object).isRequired,
  error: PropTypes.bool,
  success: PropTypes.bool,
};

UserMeta.defaultProps = {
  pdf: false,
  error: false,
  success: false,
};

const User = (props) => {
  const {
    id,
    name,
    lastName,
    profilePicture,
    email,
    showMeta,
    pdf,
    disabled,
    hours,
    warnings,
    error,
    success,
    hasCheckBox,
    checked,
    onCheck,
  } = props;
  const navigate = useNavigate();

  return (
    <ListItem className="user">
      {hasCheckBox ? (
        <div className="user__checkbox">
          <Checkbox
            checked={checked}
            onChange={(event) => onCheck(event.target.checked)}
            color="primary"
          />
        </div>
      ) : null}

      <div
        className="user__pressable"
        onClick={() => (!disabled ? navigate(`/users/${id}`) : null)}
        style={{ pointerEvents: disabled ? 'none' : 'initial' }}
      >
        <Avatar alt={name} src={profilePicture} className="user__avatar" />
        <div className="user__profile">
          <div className="user__name">{name}</div>
          <div className="user__email">{email}</div>
        </div>
      </div>
      {showMeta ? (
        <UserMeta
          pdf={pdf}
          hours={hours}
          warnings={warnings}
          user={{ id, name, lastName, email }}
          error={error}
          success={success}
        />
      ) : null}
    </ListItem>
  );
};

User.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string,
  lastName: PropTypes.string,
  profilePicture: PropTypes.string,
  email: PropTypes.string,
  showMeta: PropTypes.bool,
  pdf: PropTypes.bool,
  disabled: PropTypes.bool,
  hours: PropTypes.number,
  warnings: PropTypes.instanceOf(Object),
  checked: PropTypes.bool,
  error: PropTypes.bool,
  hasCheckBox: PropTypes.bool,
  success: PropTypes.bool,
  onCheck: PropTypes.func,
};

User.defaultProps = {
  id: null,
  name: '',
  lastName: '',
  profilePicture: '',
  email: '',
  showMeta: false,
  pdf: false,
  disabled: false,
  hours: 0,
  warnings: null,
  checked: false,
  success: false,
  error: false,
  hasCheckBox: false,
  onCheck: () => '',
};

export default observer(User);
