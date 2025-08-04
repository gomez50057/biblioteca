'use client';

import PropTypes from 'prop-types';
import styles from './Tooltip.module.css';

/**
 * Tooltip component wraps children and shows a tooltip on hover.
 *
 * Props:
 * - text: string to display in the tooltip
 * - children: React node to wrap
 */
export default function Tooltip({ children, text }) {
  return (
    <div className={styles.container}>
      {children}
      <span className={styles.text}>{text}</span>
    </div>
  );
}

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node,
};

Tooltip.defaultProps = {
  children: null,
};