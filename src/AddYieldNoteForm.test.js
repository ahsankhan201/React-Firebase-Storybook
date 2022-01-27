import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { AddYieldForm } from './components/AddYieldNoteForm';

describe('AddYieldForm Component', () => {
  it('shows all required input fields with empty values', () => {
    const { getByTestId, getByText } = render(<AddYieldForm />);
    fireEvent.submit(getByText(/Add Yield Note/i));
    expect(getByTestId('textarea').value).toEqual('');
    expect(getByTestId('tag-input').value).toEqual(undefined);
  });
});
