import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './MovesTable.module.css';

import * as FizzyDex from '../../fizzydex/fizzydex';
import PokemonTypeImage from '../PokemonTypeImage/PokemonTypeImage';
import DexTable from '../DexTable/DexTable';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { ViewAgendaRounded, ViewComfyRounded, ViewListRounded } from '@material-ui/icons';
import { Hidden } from '@material-ui/core';

const DetailLevel = Object.freeze({
  SIMPLE: "SIMPLE",
  EXPANDED: "EXPANDED",
  DETAILED: "DETAILED"
})

const HeadersPerDetailLevelUp = {
  SIMPLE: [
    "Move"
  ],
  EXPANDED: [
    "Move",
    "Type",
    "Category",
    "Power",
    "Effect",
    "Priority",
    "Makes Contact?"
  ],
  DETAILED: [
    "Move",
    "Type",
    "Category",
    "Power",
    "Effect",
    "Secondary Effect",
    "Effect Rate",
    "Target",
    "Priority",
    "Crit Rate",
    "Makes Contact?"
  ]
}

const MinColumnWidthsMap = {
  "Move": '9rem',
  "Level": '82px',
  "Type": '88px',
  "Category": '98px',
  "Power": '5.2rem',
  "Effect": '20rem',
  "Secondary Effect": '20rem',
  "Effect Rate": '80px',
  "Target": '8rem',
  "Priority": '87px',
  "Crit Rate": '5rem',
  "Makes Contact?": '90px'
}

function createMoveRow(move, isLevelUp, detailLevel, includeMaxMove = false, includeZMove = false) {
  let moveInfo = move.GetMoveInfo();
  let cells = [<span className={styles.moveName}>{move.Name}</span>];

  if (isLevelUp) {
    cells.push(move.Level === 0 ? "Evolve" : move.Level);
  }

  if (detailLevel === DetailLevel.EXPANDED || detailLevel === DetailLevel.DETAILED) {
    cells.push(<PokemonTypeImage type={moveInfo.Type} />);
    cells.push(<PokemonTypeImage type={moveInfo.Category} />);
    cells.push(moveInfo.BasePower === 0 ? "-" : moveInfo.BasePower);
    cells.push(moveInfo.BattleEffect);
  }

  if (detailLevel === DetailLevel.DETAILED) {
    cells.push(moveInfo.SecondaryEffect);
    cells.push(moveInfo.EffectRate);
    cells.push(moveInfo.Target);
  }

  if (detailLevel === DetailLevel.EXPANDED || detailLevel === DetailLevel.DETAILED) {
    cells.push(moveInfo.SpeedPriority);
  }

  if (detailLevel === DetailLevel.DETAILED) {
    cells.push(moveInfo.CriticalHitRate);
  }

  if (detailLevel === DetailLevel.EXPANDED || detailLevel === DetailLevel.DETAILED) {
    cells.push(moveInfo.MakesPhysicalContact);
  }

  return cells;
}

const MovesTable = (props) => {

  const [detailLevel, setDetailLevel] = useState(window.innerWidth < 1000 ? DetailLevel.SIMPLE : DetailLevel.EXPANDED);

  let headers = HeadersPerDetailLevelUp[detailLevel].slice();
  // console.log(detailLevel);

  if (props.isLevelUp) {
    headers.splice(1, 0, "Level");
  }
  // console.log(headers.map(h => MinColumnWidthsMap[h]));

  return (
    <div className={styles.MovesTable} data-testid="MovesTable">
      <ToggleButtonGroup
        className={styles.DetailSelector}
        value={detailLevel}
        exclusive
        onChange={(ev, val) => {
          if (val !== null)
            setDetailLevel(val);
        }}
        size="small"
      >
        <ToggleButton value={DetailLevel.SIMPLE}>
          <ViewAgendaRounded style={{ marginRight: '0.25rem' }} />
          <Hidden xsDown>{DetailLevel.SIMPLE}</Hidden>
        </ToggleButton>
        <ToggleButton value={DetailLevel.EXPANDED}>
          <ViewListRounded style={{ marginRight: '0.25rem' }} />
          <Hidden xsDown>{DetailLevel.EXPANDED}</Hidden>
        </ToggleButton>
        <ToggleButton value={DetailLevel.DETAILED}>
          <ViewComfyRounded style={{ marginRight: '0.25rem' }} />
          <Hidden xsDown>{DetailLevel.DETAILED}</Hidden>
        </ToggleButton>
      </ToggleButtonGroup>
      <DexTable
        headerLabels={headers}
        tableWidth={'10rem'}
        rowCellContents={props.moves.map(m => createMoveRow(m, props.isLevelUp, detailLevel))}
        minColumnWidths={headers.map(h => MinColumnWidthsMap[h])}
      />
    </div>
  );
};

MovesTable.propTypes = {
  moves: PropTypes.arrayOf(PropTypes.instanceOf(FizzyDex.Move)).isRequired,
  isLevelUp: PropTypes.bool
};

MovesTable.defaultProps = {
  isLevelUp: false
};

export default MovesTable;
