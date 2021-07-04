import React from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { Avatar, ListItem } from "@material-ui/core";

import "./styles.scss";

const User = (props) => {
  const { id, name = "", profilePicture = "", email = "", disabled } = props;
  const history = useHistory();

  return (
    <ListItem
      button={!disabled}
      onClick={() => (!disabled ? history.push(`/users/${id}`) : null)}
      className="user"
    >
      <Avatar alt={name} src={profilePicture} className="user__avatar" />
      <div className="user__data">
        <div className="user__name">{name}</div>
        <div className="user__email">{email}</div>
      </div>
    </ListItem>
  );
};

export default observer(User);
