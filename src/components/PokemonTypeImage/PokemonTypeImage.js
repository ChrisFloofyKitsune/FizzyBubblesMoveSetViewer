import React from 'react';
import PropTypes from 'prop-types';
import styles from './PokemonTypeImage.module.css';

const reqImage = require.context('../../img', true, /.png$/);
const typeList = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
  "unknown",
  "physical",
  "special",
  "status"
];

function getTypeImage(type, rotated = false) {
  type = type?.toLowerCase() ?? "unknown";
  if (typeList.some(entry => type === entry)) {
    return reqImage(`./${type}${rotated ? "90" : ""}.png`).default;
  }

  return reqImage(`./unknown${rotated ? "90" : ""}.png`).default;
}

const PokemonTypeImage = (props) => (
  <img 
    className={styles.PokemonTypeImage}
    data-testid="PokemonTypeImage"
    alt={`${props.type} type`}
    src={getTypeImage(props.type, props.rotated)}
  />
);

PokemonTypeImage.propTypes = {
  type: PropTypes.string,
  rotated: PropTypes.bool
};

PokemonTypeImage.defaultProps = {
  type: "unknown",
  rotated: false
};

export default PokemonTypeImage;
