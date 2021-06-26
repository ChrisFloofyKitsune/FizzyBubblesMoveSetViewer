import React from 'react';
import PropTypes from 'prop-types';
import styles from './TypeWeaknessChart.module.css';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import * as FizzyDex from '../../fizzydex/fizzydex';
import PokemonTypeImage from '../PokemonTypeImage/PokemonTypeImage';

function weaknessToClass(value) {
  switch (value) {
    case 0: return "noEffect";
    case 0.25: return "doubleResist";
    case 0.5: return "resist";
    case 2: return "weak";
    case 4: return "doubleWeak";
    default: return undefined;
  }
}

function weaknessToText(value) {
  let frac;
  switch (value) {
    case 0.25: frac = "¼"; break;
    case 0.5: frac = "½"; break;
    default: frac = value; break;
  }
  return `×${frac}`;
}

const TypeWeaknessChart = (props) => {
  const weaknesses = props.form.TypeWeaknesses;

  return (
    <div className={styles.TypeWeaknessChart} data-testid="TypeWeaknessChart">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(weaknesses).map(type =>
                <TableCell key={`header${type}`}>
                  <PokemonTypeImage type={type} rotated />
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {Object.keys(weaknesses).map(type => {
                return (
                  <TableCell
                    key={`body${type}`}
                    className={styles[weaknessToClass(weaknesses[type])]}
                  >
                    {weaknessToText(weaknesses[type])}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

TypeWeaknessChart.propTypes = {
  form: PropTypes.instanceOf(FizzyDex.Form).isRequired
};

TypeWeaknessChart.defaultProps = {};

export default TypeWeaknessChart;
