import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import Navbar from '../src/component/Navbar'
import { useAuth } from '../src/hooks/authHook'

vi.mock('../src/hooks/authHook', () => ({
  useAuth: vi.fn(),
}))

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useAuth.mockReturnValue({
      user: { username: 'Alice' },
      setUser: vi.fn(),
    })
  })

  it('renders the username and main actions', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(screen.getByText('Good Morning')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
  })
})