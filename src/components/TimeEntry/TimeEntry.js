/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { observer } from "mobx-react";
import { ListItem, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Warning } from "@material-ui/icons";

import "./styles.scss";

const TimeEntry = (props) => {
  const {
    project = {},
    time = "",
    description = "",
    disabled = false,
    showMeta = false,
    warnings = [],
  } = props;
  const history = useHistory();

  return (
    <ListItem
      button={!disabled}
      className="time-entry"
      style={{
        borderColor: project.color,
      }}
    >
      <div
        className="time-entry__pressable"
        onClick={() =>
          project.id ? history.push(`/projects/${project.id}`) : null
        }
      >
        <div className="time-entry__top">
          <div className="time-entry__project-name">{project.name}</div>
        </div>
        <div className="time-entry__bottom">
          <div
            className="time-entry__time"
            style={{
              borderColor: project.color,
            }}
          >
            {time.replace("PT", "").replace("H", "hr ").replace("M", "min")}
          </div>
          -<div className="time-entry__description">{description}</div>
        </div>
      </div>
      {showMeta && warnings?.length ? (
        <div className="time-entry__meta">
          <Tooltip
            arrow
            interactive
            placement="left"
            title={
              <ul className="warning-list">
                {warnings.map((warning) => (
                  <li className="warning-list__item">{warning}</li>
                ))}
              </ul>
            }
          >
            <div className="time-entry__meta__item warning">
              <Warning
                color={
                  warnings.length === 1 &&
                  warnings[0] === "Entrada maior que 6 horas"
                    ? "inherit"
                    : "error"
                }
              />
            </div>
          </Tooltip>
        </div>
      ) : null}
    </ListItem>
  );
};

export default observer(TimeEntry);
