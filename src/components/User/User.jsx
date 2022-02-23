import React, { useState } from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  CircularProgress,
  IconButton,
  ListItem,
  Tooltip,
} from "@material-ui/core";
import {
  Warning,
  Check,
  /*   Email, */
  PictureAsPdf,
  AccessTime,
} from "@material-ui/icons";
import { flowResult } from "mobx";

import { useStore } from "../../hooks";

import { WARNING_TYPES } from "../../stores/containers/userStore";

import "./styles.scss";

const UserMeta = (props) => {
  const store = useStore();
  const { hours, warnings, user, pdf } = props;
  const [fetchingPDF, setFetchingPDF] = useState(false);

  const fetchPdf = async () => {
    setFetchingPDF(true);
    await flowResult(store.userStore.fetchUserSummaryReport(user));
    setFetchingPDF(false);
  };

  console.log(warnings);
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

      {pdf ? (
        <Tooltip arrow placement="left" title="Visualizar relatório">
          {fetchingPDF ? (
            <CircularProgress style={{ width: 20, height: 20, margin: 14 }} />
          ) : (
            <IconButton onClick={fetchPdf}>
              <PictureAsPdf />
            </IconButton>
          )}
        </Tooltip>
      ) : null}

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
                  <li
                    key={WARNING_TYPES[key]}
                    className="warning-list__item"
                  >{`${value}x ${WARNING_TYPES[key]}`}</li>
                ))}
            </ul>
          }
        >
          <div className="user__meta__item warning">
            <Warning
              color={
                warnings.NO_PROJECT > 0 || warnings.NO_DESCRIPTION > 0
                  ? "error"
                  : "inherit"
              }
            />
          </div>
        </Tooltip>
      ) : (
        <div className="user__meta__item">
          <Check color="secondary" />
        </div>
      )}
      {/*  <Tooltip arrow placement="left" title="Enviar relatório ao colaborador">
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
    lastName = "",
    profilePicture = "",
    email = "",
    showMeta = false,
    pdf = false,
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
        style={{ pointerEvents: disabled ? "none" : "initial" }}
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

export default observer(User);
