import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AbilitiesTable from './AbilitiesTable';

describe('<AbilitiesTable />', () => {
  test('it should mount', () => {
    render(<AbilitiesTable />);
    
    const abilitiesTable = screen.getByTestId('AbilitiesTable');

    expect(abilitiesTable).toBeInTheDocument();
  });
});