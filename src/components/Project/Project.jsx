/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import ListItem from '@mui/material/ListItem';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import './styles.scss';

const Project = (props) => {
  const { id, index, name, color, disabled = false } = props;

  const [showColor, setShowColor] = useState(false);
  const navigate = useNavigate();

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
      onClick={() => (!disabled ? navigate(`/projects/${id}`) : null)}
      className="project"
      style={{
        borderColor: showColor ? color : 'transparent',
      }}
    >
      <div className="project__name">{name}</div>
    </ListItem>
  );
};

Project.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
};

Project.defaultProps = {
  name: '',
  color: '',
  disabled: false,
};

export default observer(Project);
