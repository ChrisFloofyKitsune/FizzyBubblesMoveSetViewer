import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FooterLink from './FooterLink';

describe('<FooterLink />', () => {
  test('it should mount', () => {
    render(<FooterLink />);
    
    const footerLink = screen.getByTestId('FooterLink');

    expect(footerLink).toBeInTheDocument();
  });
});