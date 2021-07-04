/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { observer } from "mobx-react";
import { ListItem } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import "./styles.scss";

const TimeEntry = (props) => {
  const { project = {}, time = "", description = "", disabled = false } = props;
  const history = useHistory();

  return (
    <ListItem
      button={!disabled}
      className="time-entry"
      onClick={() =>
        project.id ? history.push(`/projects/${project.id}`) : null
      }
      style={{
        borderColor: project.color,
      }}
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
    </ListItem>
  );
};

export default observer(TimeEntry);
