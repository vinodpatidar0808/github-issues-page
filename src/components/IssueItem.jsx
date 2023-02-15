import moment from 'moment/moment';
import React from 'react';
import styles from './IssueItem.module.css';

const Issue = ({ issue }) => {
  console.log(issue);
  return (
    <div className={styles.container}>
      <p className={styles.title}>
        {issue.title}
        {issue.labels.map((label) => (
          <span
            key={label.id}
            className={styles.label}>
            {label.name}
          </span>
        ))}
      </p>
      <p>
        #{issue.number} opened {moment(issue.created_at).fromNow()} by {issue.user.login}
      </p>
    </div>
  );
};

export default Issue;
