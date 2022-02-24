import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';

import './styles.scss';

const Loader = (props) => {
  const { active } = props;

  if (active) {
    return (
      <div className="loader">
        <LinearProgress style={{ height: 1 }} />
      </div>
    );
  }

  return null;
};

Loader.propTypes = {
  active: PropTypes.bool,
};

Loader.defaultProps = {
  active: false,
};

export default Loader;
