import React from 'react';
import PropTypes from 'prop-types';
import styles from './FooterLink.module.css';

import Button from '@material-ui/core/Button';
import { Link } from 'react-scroll';

const FooterLink = (props) => (
  <Link
    className={styles.FooterLink}
    activeClass={styles.FooterLinkActive}
    to={props.to}
    spy
    smooth
    duration={500}
  >
    <Button
      classes={{
        label: styles.FooterLinkButtonLabel,
      }}
    >
      {props.icon ?? ""}
      {props.label}
    </Button>
  </Link>
);

FooterLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  icon: PropTypes.node
};

FooterLink.defaultProps = {

};

export default FooterLink;
