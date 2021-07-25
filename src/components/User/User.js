import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { Avatar, /* IconButton, */ ListItem, Tooltip } from "@material-ui/core";
import {
  Warning,
  Check,
  /*   Email,
  PictureAsPdf, */
  AccessTime,
} from "@material-ui/icons";

import { WARNING_TYPES } from "../../stores/containers/userStore";

import "./styles.scss";

const UserMeta = (props) => {
  const { hours, warnings } = props;

  return (
    <div className="user__meta">
      <Tooltip
        arrow
        placement="left"
        title="Horas trabalhadas no período selecionado"
      >
        <div
          className="user__meta__item"
          style={{ color: hours >= 200 ? "#f44336" : "#ffffff" }}
        >
          {hours.toFixed(2)}
          <AccessTime color={hours >= 200 ? "error" : ""} />
        </div>
      </Tooltip>

      {Object.entries(warnings).filter(([key, value]) => value > 0)?.length ? (
        <Tooltip
          arrow
          interactive
          placement="left"
          title={
            <ul className="warning-list">
              {Object.entries(warnings)
                .filter(([key, value]) => value > 0)
                .map(([key, value]) => (
                  <li className="warning-list__item">{`${value}x ${WARNING_TYPES[key]}`}</li>
                ))}
            </ul>
          }
        >
          <div className="user__meta__item">
            <Warning color="error" />
          </div>
        </Tooltip>
      ) : (
        <div className="user__meta__item">
          <Check color="secondary" />
        </div>
      )}
      {/* <Tooltip arrow placement="left" title="Visualizar relatório">
        <IconButton>
          <PictureAsPdf />
        </IconButton>
      </Tooltip>
      <Tooltip arrow placement="left" title="Enviar relatório ao colaborador">
        <IconButton onClick={() => {}}>
          <Email />
        </IconButton>
      </Tooltip> */}
    </div>
  );
};

const User = (props) => {
  const {
    id,
    name = "",
    profilePicture = "",
    email = "",
    showMeta = false,
    disabled = false,
    hours = 0,
    warnings = {},
  } = props;
  const history = useHistory();

  return (
    <ListItem className="user">
      <div
        className="user__pressable"
        onClick={() => (!disabled ? history.push(`/users/${id}`) : null)}
      >
        <Avatar alt={name} src={profilePicture} className="user__avatar" />
        <div className="user__profile">
          <div className="user__name">{name}</div>
          <div className="user__email">{email}</div>
        </div>
      </div>
      {showMeta ? <UserMeta hours={hours} warnings={warnings} /> : null}
    </ListItem>
  );
};

export default observer(User);
