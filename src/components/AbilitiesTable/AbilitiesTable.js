import React from 'react';
import PropTypes from 'prop-types';
import styles from './AbilitiesTable.module.css';

import * as FizzyDex from '../../fizzydex/fizzydex';
import DexTable from '../DexTable/DexTable';

function createAbilityRowContents(label, ability) {
  let abilityData = {}
  try {
    abilityData = FizzyDex.GetAbilityInfo(ability);
  } catch {
    abilityData = { Name: ability, GameText: "Could not load ability data" };
  }
  return [
    (<div>
      <span className={styles.abilityLabel}>{label}</span><br />
      <span className={styles.abilityName}>{abilityData.Name}</span>
    </div>),
    abilityData.GameText,
    (<div className={styles.detailsCell}>
      {
        !abilityData.EffectDetail ?
          "-" :
          abilityData.EffectDetail
            .replace(/(?<!Sp)\. /g, '.\n')
            .split('\n')
            .map((line, i) => <p key={i}>{line}</p>)
      }
    </div>)
  ];
}

const AbilitiesTable = (props) => {
  const headers = ['Ability', 'Effect', 'Details'];

  const rowProps = [
    { Prop: "ability1", Label: "Ability 1" },
    { Prop: "ability2", Label: "Ability 2" },
    { Prop: "hiddenAbility", Label: "Hidden Ability" }
  ];

  const tableRows = [];

  rowProps.forEach(p => {
    if (props[p.Prop])
      tableRows.push(createAbilityRowContents(p.Label, props[p.Prop]))
  });

  return (
    <div className={styles.AbilitiesTable} data-testid="AbilitiesTable">
      <DexTable
        headerLabels={headers}
        tableWidth={'50rem'}
        rowCellContents={tableRows}
      />
    </div>
  );
};

AbilitiesTable.propTypes = {
  ability1: PropTypes.string,
  ability2: PropTypes.string,
  hiddenAbility: PropTypes.string
};

AbilitiesTable.defaultProps = {
  ability1: undefined,
  ability2: undefined,
  hiddenAbility: undefined
};

export default AbilitiesTable;
