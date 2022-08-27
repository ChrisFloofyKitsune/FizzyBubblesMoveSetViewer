import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import * as FizzyDex from './fizzydex/fizzydex';

import { createMuiTheme, ThemeProvider, StylesProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

import { AlbumRounded, ChildFriendlyRounded, InfoRounded, SchoolRounded, TrendingUpRounded, VerticalAlignTopRounded } from '@material-ui/icons';

import styles from './App.module.css';
import PokemonSelect from './components/PokemonSelect/PokemonSelect';
import PokemonEntry from './components/PokemonEntry/PokemonEntry';
import FooterLink from './components/FooterLink/FooterLink';


function ParseURLHash(hash) {
  let dexNum = "0";
  let form = null;

  if (hash) {
    // console.log("decoding hash");
    var match = hash.match(/DexNum=(.*?)(?:&|$)/);
    if (match) {
      dexNum = match[1];

      match = hash.match(/Form=(.*?)(?:&|$)/);
      if (match) {
        form = decodeURIComponent(match[1]);
      }
    }
  }

  // console.log("read dexNum: " + dexNum);
  return [dexNum, form];
}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  }
})

function App() {
  const [isLoaded, setLoaded] = useState(false);
  const [errorText, setErrorText] = useState(null);

  const [pokeSelect, _setPokeSelect] = useState({
    DexNum: "0",
    Form: null,
    Pokemon: null
  });

  function SetPokeSelect(dexNum, form) {
    if (dexNum === "0") dexNum = "1";

    let pokemon = FizzyDex.GetPokemon(dexNum);
    form = pokemon.FixFormName(form);

    _setPokeSelect({
      DexNum: dexNum,
      Form: form,
      Pokemon: pokemon
    })
  }

  const [pokemonList, setPokemonList] = useState([]);

  const OnHashChange = useCallback((hash) => {
    // console.log(`OnHashChange triggered: ${hash}`);

    let [_dexNum, _form] = ParseURLHash(hash ?? window.location.hash);
    SetPokeSelect(_dexNum, _form);

    //Don't fire this again until we're ready for it
    window.onhashchange = null;
  }, []);

  useEffect(() => {
    function attachHashListener() {
      setTimeout(() => {
        window.onhashchange = () => {
          // console.log("Hash changed by user!");
          OnHashChange(window.location.hash);
        }
      }, 0);
    }

    if (!pokeSelect.Pokemon) {
      attachHashListener();
      return;
    }

    // console.log("UPDATE HASH EFFECT RUN");

    let [urlDexNum, urlForm] = ParseURLHash(window.location.hash);
    let urlName = "";
    let match = window.location.hash.match(/Name=(.*?)(?:&|$)/);
    if (match)
      urlName = match[1];

    let form = pokeSelect.Pokemon.FixFormName(pokeSelect.Form);
    let newForm = form !== pokeSelect.Pokemon.DefaultFormName ? form : null;

    let newHash = (`#Name=${pokeSelect.Pokemon.Name}&DexNum=${pokeSelect.Pokemon.DexNum}`
      + (newForm ? `&Form=${encodeURIComponent(newForm)}` : "")
    );

    if (window.location.hash === newHash) {
      attachHashListener();
      return;
    }

    document.title = `FizzyDex - #${pokeSelect.Pokemon.DexNum} ${pokeSelect.Pokemon.Name}${newForm ? ` - ${newForm}` : ""}`;

    // console.log(`Hash is currently: ${window.location.hash}
    //   With Params: ${urlName}, ${urlDexNum}, ${urlForm}
    //   Changing to: ${newHash}
    //   With Params: ${pokeSelect.Pokemon.Name}, ${pokeSelect.Pokemon.DexNum}, ${newForm} `);
    //Detect if the dex num was changed manually, need a non-exact comparision here.
    // eslint-disable-next-line eqeqeq

    window.onhashchange = null;

    // eslint-disable-next-line eqeqeq
    if (urlName !== pokeSelect.Pokemon.Name && urlDexNum === pokeSelect.Pokemon.DexNum) {
      let url = new URL(window.location);
      url.hash = newHash;

      window.history.replaceState(null, "", url);
      // console.log("history state replaced");

      // eslint-disable-next-line eqeqeq
    } else if (urlDexNum !== pokeSelect.Pokemon.DexNum || urlForm !== pokeSelect.Form) {
      window.location.hash = newHash;
      // console.log("new hash set");
    }

    attachHashListener();
  }, [OnHashChange, pokeSelect.DexNum, pokeSelect.Form, pokeSelect.Pokemon]);

  useLayoutEffect(() => {
    console.log("LOADING STUFF")
    Promise.all([
      FizzyDex.LoadPokemonListJSON('https://fizzydex.s3.us-west-1.amazonaws.com/pokemonList.json'),
      FizzyDex.LoadPokemonMoveListJSON('https://fizzydex.s3.us-west-1.amazonaws.com/pokemonMoveList.json'),
      FizzyDex.LoadMoveDexJSON('https://fizzydex.s3.us-west-1.amazonaws.com/moveDex.json'),
      FizzyDex.LoadAbilityDexJSON('https://fizzydex.s3.us-west-1.amazonaws.com/abilityDex.json')
    ]).catch(err => {
      console.log("ERROR!")
      setErrorText(String(err));
    }).then(() => {

      //POST LOAD STUFF
      console.log("STUFF LOADED");

      // Load data from the hash (if any)
      // by manually running this
      // This will also initialize the
      // dex to Bulbasuar (#1) if there's no
      // data in the hash
      OnHashChange(window.location.hash);

      setPokemonList(FizzyDex.Data.PokemonList.map(p => {
        return {
          Name: p.Name, DexNum: p.DexNum
        }
      }));

      setLoaded(true);

    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (errorText !== null) {
    return (
      <div>
        ERROR LOADING FILES!!<br />
        <code>{String(errorText)}</code>
      </div>
    );
  }

  if (!isLoaded || !pokeSelect.Pokemon) {
    return (
      <div className={styles.loadingText}>
        NOW LOADING...
      </div>
    );
  }

  //formList = [(<li>FORM NAME HERE</li>)];
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <CssBaseline />
        <Container className={styles.App}>
          <div id='top'>
            <Paper>
              <div className={styles.paper}>
                <PokemonSelect
                  pokemonList={pokemonList}
                  pokemon={pokeSelect.Pokemon}
                  selectedPokemonForm={pokeSelect.Form}

                  onPokemonSelect={(ev, val) => {
                    SetPokeSelect(val.DexNum, pokeSelect.Form);
                  }}
                  onFormSelect={(ev, val) => {
                    SetPokeSelect(pokeSelect.DexNum, val.FormName);
                  }}
                />
              </div>
            </Paper>
          </div>
          <hr />
          <Paper>
            <div className={styles.paper}>
              <PokemonEntry pokemon={pokeSelect.Pokemon} selectedForm={pokeSelect.Form} />
            </div>
          </Paper>
        </Container>
        <footer className={styles.Footer}>
          <FooterLink label="Top" to="top" icon={<VerticalAlignTopRounded />} />
          <FooterLink label="Ability" to="abilities" icon={<InfoRounded />} />
          <FooterLink label="Lvl Up" to="levelUpMoves" icon={<TrendingUpRounded />} />
          <FooterLink label="Egg" to="eggMoves" icon={<ChildFriendlyRounded />} />
          <FooterLink label="Tutor" to="tutorMoves" icon={<SchoolRounded />} />
          <FooterLink label="Machine" to="machineMoves" icon={<AlbumRounded />} />
        </footer>
      </StylesProvider>
    </ThemeProvider>
  );

}

export default App;
