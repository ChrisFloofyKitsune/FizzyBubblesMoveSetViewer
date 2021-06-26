import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DexTable from './DexTable';

describe('<DexTable />', () => {
  test('it should mount', () => {
    render(<DexTable />);
    
    const dexTable = screen.getByTestId('DexTable');

    expect(dexTable).toBeInTheDocument();
  });
});