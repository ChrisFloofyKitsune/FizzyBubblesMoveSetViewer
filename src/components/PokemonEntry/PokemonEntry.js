import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PokemonEntry.module.css';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import * as FizzyDex from '../../fizzydex/fizzydex';
import PokemonTypeImage from '../PokemonTypeImage/PokemonTypeImage';
import AbilitiesTable from '../AbilitiesTable/AbilitiesTable';
import MovesTable from '../MovesTable/MovesTable';
import TypeWeaknessChart from '../TypeWeaknessChart/TypeWeaknessChart';

const PokemonEntry = (props) => {

  // const [artworkURL, setArtworkURL] = useState(null);

  // useEffect(() => {
  //   setArtworkURL(props.pokemon.GetForm(props.selectedForm).ArtworkURL);
  // }, [props.pokemon, props.selectedForm]);

  // if (!props.pokemon) {
  //   return (
  //     <div className={styles.PokemonEntry}>
  //       No Pokemon Loaded...
  //     </div>
  //   );
  // }

  // console.log(`PokemonEntry got: ${props.pokemon.Name} ${props.selectedForm}`);

  const pokemon = props.pokemon;
  const form = pokemon.GetForm(props.selectedForm);
  const moveList = form.GetMoves();
  let levelUpMoves = moveList.LevelUpMoves.slice();
  if (form.ExtraMove)
    levelUpMoves.unshift(new FizzyDex.LevelUpMove(form.ExtraMove, "Special", form));

  console.log(levelUpMoves);

  return (
    <div className={styles.PokemonEntry} data-testid="PokemonEntry">
      {/* { artworkURL ?
      <img
        className={styles.artworkImage}
        id="pokemonArtwork"
        alt="Pokemon Artwork"
        src={artworkURL}
        onError={() => setArtworkURL(null)}
        /> : ""} */}
      <Typography variant="h1">
        <span id="pokemonName">{`${pokemon.Name}`}</span>
        <img
          className={styles.humpySprite}
          id="pokemonImage"
          alt="Pokemon Humpy Sprite"
          src={form.HumpySpriteURL}
        />
        <img
          className={styles.humpySprite}
          id="pokemonImageShiny"
          alt="Pokemon Shiny Humpy Sprite"
          src={form.HumpyShinyURL}
        />
      </Typography>
      <Typography variant="h3">
        {'Type: '}
        <PokemonTypeImage type={form.PrimaryType}/>
        {form.SecondaryType ? (<PokemonTypeImage type={form.SecondaryType}/>) : ""}
      </Typography>
      <Typography variant="h3">
        {'Egg Groups: '}
        <span className={styles.eggGroups}>{pokemon.EggGroups.join(", ")}</span>
      </Typography>
      <Typography variant="h3">
        {(pokemon.GenderRatioM === 0 && pokemon.GenderRatioF === 0) ? 
          "Genderless" :
          `Gender Ratios - Male: ${pokemon.GenderRatioM}% / Female: ${pokemon.GenderRatioF}%`}
      </Typography>
      <Box marginTop={3}>
        <Typography variant="h2">
          Type Weaknesses
        </Typography>
        <TypeWeaknessChart form={form}/>
      </Box>
      <Box marginTop={3} id="abilities">
        <Typography variant="h2">
          Abilities
        </Typography>
        <AbilitiesTable ability1={form.Ability1} ability2={form.Ability2} hiddenAbility={form.HiddenAbility}/>
      </Box>
      <Box marginTop={3} top={-3} id="levelUpMoves">
        <Typography variant="h2">
          Level Up Moves
        </Typography>
        <MovesTable moves={levelUpMoves} isLevelUp/>
      </Box>
      <Box marginTop={3} top={-3} id="eggMoves">
        <Typography variant="h2">
          Egg Moves
        </Typography>
        {moveList.EggMoves.length > 0 ? 
          <MovesTable moves={moveList.EggMoves}/> : 
          <Typography variant='h3'>No Egg Moves</Typography>}
      </Box>
      <Box marginTop={3} top={-3} id="tutorMoves">
        <Typography variant="h2">
          Tutor Moves
        </Typography>
        {moveList.TutorMoves.length > 0 ? 
          <MovesTable moves={moveList.TutorMoves}/> : 
          <Typography variant='h3'>No Tutor Moves</Typography>}
      </Box>
      <Box marginTop={3} top={-3} id="machineMoves">
        <Typography variant="h2">
          Machine (TM/HM/TR) Moves
        </Typography>
        {moveList.MachineMoves.length > 0 ?
          <MovesTable moves={moveList.MachineMoves}/> :
          <Typography variant='h3'>No Machine Moves</Typography>}
      </Box>
    </div>
  )
};

PokemonEntry.propTypes = {
  pokemon: PropTypes.instanceOf(FizzyDex.Pokemon),
  selectedForm: PropTypes.string
};

PokemonEntry.defaultProps = {
  pokemon: null,
  selectedForm: "Normal"
};

export default PokemonEntry;
