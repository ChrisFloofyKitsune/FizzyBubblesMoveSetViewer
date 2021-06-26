import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TypeWeaknessChart from './TypeWeaknessChart';

describe('<TypeWeaknessChart />', () => {
  test('it should mount', () => {
    render(<TypeWeaknessChart />);
    
    const typeWeaknessChart = screen.getByTestId('TypeWeaknessChart');

    expect(typeWeaknessChart).toBeInTheDocument();
  });
});