/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react";
import { ListItem } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import "./styles.scss";

const Project = (props) => {
  const { id, index, name = "", color = "", disabled = false } = props;
  const [showColor, setShowColor] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const colorEffect = setTimeout(() => {
      setShowColor(true);
    }, index * 50 + 100);

    return () => {
      clearTimeout(colorEffect);
    };
  }, []);

  return (
    <ListItem
      button={!disabled}
      onClick={() => (!disabled ? history.push(`/projects/${id}`) : null)}
      className="project"
      style={{
        borderColor: showColor ? color : "transparent",
      }}
    >
      <div className="project__name">{name}</div>
    </ListItem>
  );
};

export default observer(Project);
