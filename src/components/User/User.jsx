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
// import EmailIcon from '@mui/icons-material/Email';
import PropTypes from 'prop-types';

import { flowResult } from 'mobx';

import { useStore } from '../../hooks';

import { WARNING_TYPES } from '../../stores/containers/userStore';

import './styles.scss';
import { convertFloatIntoTime } from '../../utils';

const UserMeta = (props) => {
  const store = useStore();
  const { hours, warnings, user, pdf } = props;
  const [fetchingPDF, setFetchingPDF] = useState(false);

  const fetchPdf = async () => {
    setFetchingPDF(true);
    await flowResult(store.userStore.fetchUserSummaryReport(user));
    setFetchingPDF(false);
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

      {pdf ? (
        fetchingPDF ? (
          <CircularProgress style={{ width: 20, height: 20, margin: 14 }} />
        ) : (
          <IconButton onClick={fetchPdf}>
            <PictureAsPdfIcon />
          </IconButton>
        )
      ) : null}

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
      {/*  <Tooltip arrow placement="left" title="Send report">
        <IconButton onClick={() => {}}>
          <Email />
        </IconButton>
      </Tooltip> */}
    </div>
  );
};

UserMeta.propTypes = {
  hours: PropTypes.number.isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
  pdf: PropTypes.bool,
  warnings: PropTypes.instanceOf(Object).isRequired,
};

UserMeta.defaultProps = {
  pdf: false,
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
  } = props;
  const navigate = useNavigate();

  return (
    <ListItem className="user">
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
};

export default observer(User);
