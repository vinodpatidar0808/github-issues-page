import React from 'react';
import styles from './IssueItem.module.css';

const Issue = ({ issue }) => {
  return (
    <div className={styles.container}>
      <h4>{issue.title}</h4>
    </div>
  );
};

export default Issue;
