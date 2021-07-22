import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { Avatar, IconButton, ListItem, Tooltip } from "@material-ui/core";
import { Warning, Email, PictureAsPdf, AccessTime } from "@material-ui/icons";

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
      {/* <Tooltip
        arrow
        interactive
        placement="left"
        title={
          <ul className="warning-list">
            {warnings.map((warning) => (
              <li className="warning-list__item">{warning.toString()}</li>
            ))}
          </ul>
        }
      >
        <div className="user__meta__item">
          <Warning color="error" />
        </div>
      </Tooltip>
      <Tooltip arrow placement="left" title="Visualizar relatório">
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
      {showMeta ? (
        <UserMeta
          hours={hours}
          warnings={[
            "2x Entrada maior que 4 horas",
            "4x Entrada sem projeto",
            "1x Entrada sem descrição",
          ]}
        />
      ) : null}
    </ListItem>
  );
};

export default observer(User);
