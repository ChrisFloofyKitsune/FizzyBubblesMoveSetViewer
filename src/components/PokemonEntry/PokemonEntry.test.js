import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PokemonEntry from './PokemonEntry';

describe('<PokemonEntry />', () => {
  test('it should mount', () => {
    render(<PokemonEntry />);
    
    const pokemonEntry = screen.getByTestId('PokemonEntry');

    expect(pokemonEntry).toBeInTheDocument();
  });
});