/* eslint-disable react/prop-types */
import React from 'react';
import { LinearProgress } from '@material-ui/core';

import './styles.scss';

const Loader = ({ active }) => {
  if (active) {
    return (
      <div className='loader'>
        <LinearProgress />
      </div>
    );
  }

  return null;
};

export default Loader;
