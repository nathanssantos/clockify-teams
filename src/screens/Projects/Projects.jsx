/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

import { useStore } from '../../hooks';

import Project from '../../components/Project/Project';

const Projects = () => {
  const store = useStore();
  const [filterTerm, setFilterTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    if (filterTerm.length) {
      setFilteredList(
        store.projectStore.projectList.filter((item) =>
          item.name.toLowerCase().includes(filterTerm.toLowerCase()),
        ),
      );
      return;
    }
    setFilteredList(store.projectStore.projectList);
  }, [filterTerm]);

  useEffect(() => {
    setFilteredList(store.projectStore.projectList);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="screen projects">
      <Container maxWidth="lg">
        <header className="screen__header">
          <h2>Projects</h2>

          {store?.projectStore?.projectList?.length ? (
            <TextField
              id="filter-term"
              label="Filter"
              size="small"
              value={filterTerm}
              onChange={(e) => {
                setFilterTerm(e.target.value);
              }}
            />
          ) : null}
        </header>

        <main>
          {!filteredList?.length ? (
            <div>No project found.</div>
          ) : (
            filteredList.map((project, index) => (
              <Project
                key={project.id}
                id={project.id}
                color={project?.color}
                name={project?.name}
                index={index}
              />
            ))
          )}
        </main>
      </Container>
    </div>
  );
};

export default observer(Projects);
