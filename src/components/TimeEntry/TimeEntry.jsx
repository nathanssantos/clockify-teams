/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { observer } from 'mobx-react';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import { useNavigate } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import PropTypes from 'prop-types';

import './styles.scss';

const TimeEntry = (props) => {
  const { project, time, description, disabled, showMeta, warnings } = props;
  const navigate = useNavigate();

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
          project.id ? navigate(`/projects/${project.id}`) : null
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
            {time.replace('PT', '').replace('H', 'hr ').replace('M', 'min')}
          </div>
          -<div className="time-entry__description">{description}</div>
        </div>
      </div>
      {showMeta && warnings?.length ? (
        <div className="time-entry__meta">
          <Tooltip
            arrow
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
              <WarningIcon
                color={
                  warnings.length === 1 &&
                  warnings[0] === 'Entrada maior que 6 horas'
                    ? 'inherit'
                    : 'error'
                }
              />
            </div>
          </Tooltip>
        </div>
      ) : null}
    </ListItem>
  );
};

TimeEntry.propTypes = {
  project: PropTypes.instanceOf(Object),
  time: PropTypes.string,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  showMeta: PropTypes.bool,
  warnings: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
};

TimeEntry.defaultProps = {
  project: {},
  time: '',
  description: '',
  disabled: false,
  showMeta: false,
  warnings: [],
};

export default observer(TimeEntry);
