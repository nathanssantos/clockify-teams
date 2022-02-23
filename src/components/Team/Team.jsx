import React from 'react';
import { observer } from 'mobx-react';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import './styles.scss';

const Team = (props) => {
  const { id, name, image, avatarSize, fontSize, disabled, card } = props;
  const navigate = useNavigate();

  if (card) {
    return (
      <ListItem
        className="team card"
        button={!disabled}
        onClick={() => (!disabled ? navigate(`/teams/${id}`) : null)}
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
      onClick={() => (!disabled ? navigate(`/teams/${id}`) : null)}
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

Team.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  image: PropTypes.string,
  avatarSize: PropTypes.number,
  fontSize: PropTypes.number,
  disabled: PropTypes.bool,
  card: PropTypes.bool,
};

Team.defaultProps = {
  name: '',
  image: '',
  avatarSize: 50,
  fontSize: 16,
  disabled: false,
  card: false,
};

export default observer(Team);
