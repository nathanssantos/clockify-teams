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
        <div
          className="time-entry__project-name"
          style={{
            color: project.color,
          }}
        >
          {project.name}
        </div>
      </div>
      <div className="time-entry__bottom">{`${time
        .replace("PT", "")
        .replace("H", "H")} - ${description}`}</div>
    </ListItem>
  );
};

export default observer(TimeEntry);
