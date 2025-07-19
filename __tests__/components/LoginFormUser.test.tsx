import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginFormUser from '@/app/components/LoginFormUser'

// Mocks ici...
jest.mock('@/lib/backend-helper', () => ({
  backendHelper: {
    createUser: jest.fn(),
    userLogin: jest.fn(),
  },
}))
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('LoginFormUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('affiche le formulaire d\'inscription par défaut', () => {
    render(<LoginFormUser />)
    expect(screen.getByPlaceholderText('Nom complet')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Mot de passe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirmer le mot de passe')).toBeInTheDocument()
  })

  it('affiche les onglets Inscription et Connexion', () => {
    render(<LoginFormUser />)
    expect(screen.getByText('Inscription')).toBeInTheDocument()
    expect(screen.getByText('Connexion')).toBeInTheDocument()
  })

  it('affiche le tag grmrh', () => {
    render(<LoginFormUser />)
    expect(screen.getAllByText('grmrh')).toHaveLength(2) // Une fois pour mobile, une fois pour desktop
  })

  it('gère les changements dans les champs de saisie', () => {
    render(<LoginFormUser />)
    
    const nameInput = screen.getByPlaceholderText('Nom complet')
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Mot de passe')
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(passwordInput).toHaveValue('password123')
  })

  it('gère l\'inscription réussie', async () => {
    const mockCreateUser = jest.fn().mockResolvedValue({ success: true })
    const { backendHelper } = require('@/lib/backend-helper')
    backendHelper.createUser = mockCreateUser
    
    render(<LoginFormUser />)
    
    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Nom complet'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmer le mot de passe'), { target: { value: 'password123' } })
    
    // Soumettre le formulaire
    const submitButton = screen.getByText("S'inscrire")
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        nom: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
    })
  })

  it('gère les erreurs d\'inscription', async () => {
    const mockCreateUser = jest.fn().mockRejectedValue(new Error('Email déjà utilisé'))
    const { backendHelper } = require('@/lib/backend-helper')
    backendHelper.createUser = mockCreateUser
    
    render(<LoginFormUser />)
    
    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Nom complet'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmer le mot de passe'), { target: { value: 'password123' } })
    
    // Soumettre le formulaire
    const submitButton = screen.getByText("S'inscrire")
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalled()
    })
  })

  it('affiche le bouton de soumission avec le bon texte', () => {
    render(<LoginFormUser />)
    expect(screen.getByText("S'inscrire")).toBeInTheDocument()
  })

  it('désactive le bouton pendant le chargement', async () => {
    const mockCreateUser = jest.fn().mockImplementation(() => new Promise(() => {})) // Promise qui ne se résout jamais
    const { backendHelper } = require('@/lib/backend-helper')
    backendHelper.createUser = mockCreateUser
    
    render(<LoginFormUser />)
    
    // Remplir le formulaire
    fireEvent.change(screen.getByPlaceholderText('Nom complet'), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Mot de passe'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('Confirmer le mot de passe'), { target: { value: 'password123' } })
    
    // Soumettre le formulaire
    const submitButton = screen.getByText("S'inscrire")
    fireEvent.click(submitButton)
    
    // Le bouton devrait être désactivé et afficher "Création en cours..."
    await waitFor(() => {
      expect(screen.getByText('Création en cours...')).toBeInTheDocument()
    })
  })
})