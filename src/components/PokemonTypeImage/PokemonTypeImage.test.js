import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PokemonTypeImage from './PokemonTypeImage';

describe('<PokemonTypeImage />', () => {
  test('it should mount', () => {
    render(<PokemonTypeImage />);
    
    const pokemonTypeImage = screen.getByTestId('PokemonTypeImage');

    expect(pokemonTypeImage).toBeInTheDocument();
  });
});