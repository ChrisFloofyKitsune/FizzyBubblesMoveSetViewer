import React from 'react';
import PropTypes from 'prop-types';
import styles from './PokemonSelect.module.css';
import * as FizzyDex from '../../fizzydex/fizzydex';

import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';


const PokemonSelect = (props) => {
  // console.log(`PokemonSelect got: ${props.pokemon?.Name} - ${props.selectedPokemonForm}`);

  if (!props.pokemon) {
    return (<div>Loading Pokemon...</div>);
  }

  let selectedForm = props.pokemon.FixFormName(props.selectedPokemonForm);
  let formsList = props.pokemon.Forms;

  return (
    <div className={styles.PokemonSelect} data-testid="PokemonSelect">
      <Autocomplete
        id="pokemon-select"
        
        options={props.pokemonList}
        getOptionLabel={p => `${p.Name} #${p.DexNum}`}
        // eslint-disable-next-line eqeqeq
        getOptionSelected={(opt, val) => val && opt.DexNum == val.DexNum}
        value={props.pokemon ? { DexNum: props.pokemon.DexNum, Name: props.pokemon.Name } : null}
        
        blurOnSelect={true}
        onChange={props.onPokemonSelect}

        disableClearable={true}
        renderInput={(params) => 
          <TextField
            {...params}
            size="small"
            label="Pokemon"
            InputLabelProps={{shrink: true}}
          />}
      />
      <Autocomplete
        id="pokemon-form-select"

        options={formsList}
        getOptionLabel={f => `${f.FormName}`}
        getOptionSelected={(opt, val) => val && opt.FormName === val.FormName}
        value={{FormName: selectedForm}}

        onChange={props.onFormSelect}
        disabled={formsList.length <= 1}

        blurOnSelect={true}
        disableClearable={true}
        renderInput={(params) =>
          <TextField
            {...params}
            size="small"
            label="Form"
            margin="normal"
            InputLabelProps={{shrink: true}}
          />}
      />
    </div>
  )
};

PokemonSelect.propTypes = {
  pokemonList: PropTypes.array,
  pokemon: PropTypes.instanceOf(FizzyDex.Pokemon),
  selectedPokemonForm: PropTypes.string,
  onPokemonSelect: PropTypes.func,
  onFormSelect: PropTypes.func,
};

PokemonSelect.defaultProps = {
  pokemonList: [],
  pokemon: null,
  selectedPokemonForm: "",
  onPokemonSelect: (ev, obj) => console.log(`POKEMON SELECT: ${JSON.stringify(obj)}`),
  onFormSelect: (ev, obj) => console.log(`FORM SELECT: ${obj.FormName}`)
};

export default PokemonSelect;
