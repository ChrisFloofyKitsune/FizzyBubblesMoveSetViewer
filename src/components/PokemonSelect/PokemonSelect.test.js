import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PokemonSelect from './PokemonSelect';

describe('<PokemonSelect />', () => {
  test('it should mount', () => {
    render(<PokemonSelect />);
    
    const pokemonSelect = screen.getByTestId('PokemonSelect');

    expect(pokemonSelect).toBeInTheDocument();
  });
});