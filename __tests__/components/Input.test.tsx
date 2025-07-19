import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('rend le champ de saisie avec le placeholder', () => {
    render(<Input placeholder="Entrez votre nom" />)
    
    expect(screen.getByPlaceholderText('Entrez votre nom')).toBeInTheDocument()
  })

  it('applique les classes par défaut', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('flex', 'h-9', 'w-full', 'rounded-md', 'border')
  })

  it('applique les classes personnalisées', () => {
    render(<Input className="custom-class" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('gère les événements de saisie', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })
    
    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('test')
  })

  it('désactive le champ quand disabled est true', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('passe les props supplémentaires', () => {
    render(<Input data-testid="custom-input" aria-label="Champ personnalisé" />)
    
    const input = screen.getByTestId('custom-input')
    expect(input).toHaveAttribute('aria-label', 'Champ personnalisé')
  })

  it('utilise le bon type par défaut', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    // Par défaut, les inputs HTML ont type="text" même si non spécifié
    expect(input).not.toHaveAttribute('type', 'password')
  })

  it('utilise le type spécifié', () => {
    render(<Input type="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('gère les valeurs contrôlées', () => {
    render(<Input value="valeur initiale" onChange={() => {}} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('valeur initiale')
  })
}) 