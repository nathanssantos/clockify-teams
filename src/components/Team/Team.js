import React from "react";
import { observer } from "mobx-react";
import { Avatar, ListItem } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import "./styles.scss";

const Team = (props) => {
  const {
    id,
    name = "",
    image = "",
    avatarSize = 50,
    fontSize = 16,
    disabled = false,
    card = false,
  } = props;
  const history = useHistory();

  if (card) {
    return (
      <ListItem
        className="team card"
        button={!disabled}
        onClick={() => (!disabled ? history.push(`/teams/${id}`) : null)}
      >
        {image.length ? (
          <img className="team__image" src={image} alt={name} />
        ) : null}

        <div className="team__data">
          <div className="team__name" style={{ fontSize }}>
            {name}
          </div>
        </div>
      </ListItem>
    );
  }

  return (
    <ListItem
      className="team"
      button={!disabled}
      onClick={() => (!disabled ? history.push(`/teams/${id}`) : null)}
    >
      <Avatar
        alt={name}
        src={image}
        className="team__avatar"
        style={{ width: avatarSize, height: avatarSize }}
      />

      <div className="team__data">
        <div className="team__name" style={{ fontSize }}>
          {name}
        </div>
      </div>
    </ListItem>
  );
};

export default observer(Team);
