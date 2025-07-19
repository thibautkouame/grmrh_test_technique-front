describe('Test basique', () => {
  it('devrait passer', () => {
    expect(1 + 1).toBe(2)
  })

  it('devrait gérer les chaînes', () => {
    expect('hello').toBe('hello')
  })

  it('devrait gérer les objets', () => {
    const obj = { name: 'test' }
    expect(obj.name).toBe('test')
  })
}) 