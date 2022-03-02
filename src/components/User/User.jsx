/* eslint-disable no-nested-ternary */
import React from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';

import './styles.scss';
import UserMeta from './UserMeta';

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
    meta,
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
          user={{ id, name, lastName, email, meta }}
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
  meta: PropTypes.instanceOf(Object),
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
  meta: { valuePerHour: 0, attachments: [] },
  checked: false,
  success: false,
  error: false,
  hasCheckBox: false,
  onCheck: () => '',
};

export default observer(User);
