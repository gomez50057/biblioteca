'use client';
import React from 'react';
import styles from './Tooltip.module.css';

export default function Tooltip({
  text,
  children,
  offset = '125%'
}) {
  return (
    <div
      className={styles.container}
      style={{ '--tooltip-bottom': offset }}
    >
      {children}
      <span className={styles.text}>
        {text}
      </span>
    </div>
  );
}