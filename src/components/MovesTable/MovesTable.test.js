import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MovesTable from './MovesTable';

describe('<MovesTable />', () => {
  test('it should mount', () => {
    render(<MovesTable />);
    
    const movesTable = screen.getByTestId('MovesTable');

    expect(movesTable).toBeInTheDocument();
  });
});