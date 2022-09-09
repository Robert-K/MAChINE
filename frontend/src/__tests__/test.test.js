import React from 'react'
import App from '../App'
import {
  fireEvent,
  getByLabelText,
  getByRole,
  render,
  screen,
  waitFor,
} from '@testing-library/react'

test('Renders without crashing', () => {
  render(<App />)
})

test('Login with username', async () => {
  const username = 'Test User'
  render(<App />)
  const nameInput = screen.getByLabelText('Name')
  fireEvent.change(nameInput, { target: { value: username } })
  const submitButton = screen.getByRole('button', {
    name: 'Start your journey!',
  })
  expect(submitButton).toBeVisible()
  fireEvent.click(submitButton)
  await waitFor(() => {
    expect(screen.getByText(username)).toBeVisible()
  })
})
