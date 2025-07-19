import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('rend le bouton avec le texte fourni', () => {
    render(<Button>Cliquez-moi</Button>)
    
    expect(screen.getByRole('button', { name: 'Cliquez-moi' })).toBeInTheDocument()
  })

  it('applique les classes par défaut', () => {
    render(<Button>Test</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('applique la variante destructive', () => {
    render(<Button variant="destructive">Supprimer</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-destructive', 'text-white')
  })

  it('applique la variante outline', () => {
    render(<Button variant="outline">Contour</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border', 'bg-background')
  })

  it('applique la variante secondary', () => {
    render(<Button variant="secondary">Secondaire</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('applique la variante ghost', () => {
    render(<Button variant="ghost">Fantôme</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
  })

  it('applique la variante link', () => {
    render(<Button variant="link">Lien</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('text-primary', 'underline-offset-4')
  })

  it('applique la taille sm', () => {
    render(<Button size="sm">Petit</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-8', 'px-3')
  })

  it('applique la taille lg', () => {
    render(<Button size="lg">Grand</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-10', 'px-6')
  })

  it('applique la taille icon', () => {
    render(<Button size="icon">🔍</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('size-9')
  })

  it('applique les classes personnalisées', () => {
    render(<Button className="custom-class">Test</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('gère les événements de clic', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Cliquez</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('désactive le bouton quand disabled est true', () => {
    render(<Button disabled>Désactivé</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('passe les props supplémentaires', () => {
    render(<Button data-testid="custom-button" aria-label="Bouton personnalisé">Test</Button>)
    
    const button = screen.getByTestId('custom-button')
    expect(button).toHaveAttribute('aria-label', 'Bouton personnalisé')
  })

  it('utilise Slot quand asChild est true', () => {
    render(
      <Button asChild>
        <a href="/test">Lien</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('combine plusieurs variantes et tailles', () => {
    render(
      <Button variant="destructive" size="lg" className="extra-class">
        Bouton combiné
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'bg-destructive',
      'text-white',
      'h-10',
      'px-6',
      'extra-class'
    )
  })
}) 