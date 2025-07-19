import { cn, saveToken, getToken, removeToken, isAuthenticated } from '@/lib/utils'
import Cookies from 'js-cookie'

// Mock js-cookie
jest.mock('js-cookie', () => ({
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
}))

const mockCookies = Cookies as jest.Mocked<typeof Cookies>

describe('utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('cn', () => {
    it('combine les classes CSS correctement', () => {
      const result = cn('class1', 'class2', { class3: true, class4: false })
      expect(result).toBe('class1 class2 class3')
    })

    it('gère les classes conditionnelles', () => {
      const isActive = true
      const result = cn('base-class', { 'active': isActive, 'inactive': !isActive })
      expect(result).toBe('base-class active')
    })

    it('retourne une chaîne vide pour des classes vides', () => {
      const result = cn('', null, undefined, false && 'hidden')
      expect(result).toBe('')
    })

    it('fusionne les classes Tailwind correctement', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBe('py-1 px-4') // px-4 devrait remplacer px-2
    })
  })

  describe('saveToken', () => {
    it('sauvegarde le token avec les bonnes options', () => {
      const token = 'test-token'
      saveToken(token)

      expect(mockCookies.set).toHaveBeenCalledWith(
        '__grmrh_db_jwt',
        token,
        expect.objectContaining({
          expires: 1/24,
          secure: false, // En développement
          sameSite: 'strict'
        })
      )
    })

    it('utilise secure: true en production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      saveToken('test-token')

      expect(mockCookies.set).toHaveBeenCalledWith(
        '__grmrh_db_jwt',
        'test-token',
        expect.objectContaining({
          secure: true
        })
      )

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('getToken', () => {
    it('récupère le token depuis les cookies', () => {
      mockCookies.get.mockReturnValue('test-token')
      
      const result = getToken()
      
      expect(mockCookies.get).toHaveBeenCalledWith('__grmrh_db_jwt')
      expect(result).toBe('test-token')
    })

    it('retourne undefined si aucun token', () => {
      mockCookies.get.mockReturnValue(undefined)
      
      const result = getToken()
      
      expect(result).toBeUndefined()
    })
  })

  describe('removeToken', () => {
    it('supprime le token des cookies', () => {
      removeToken()
      
      expect(mockCookies.remove).toHaveBeenCalledWith('__grmrh_db_jwt')
    })
  })

  describe('isAuthenticated', () => {
    it('retourne true si un token existe', () => {
      mockCookies.get.mockReturnValue('valid-token')
      
      const result = isAuthenticated()
      
      expect(result).toBe(true)
    })

    it('retourne false si aucun token', () => {
      mockCookies.get.mockReturnValue(undefined)
      
      const result = isAuthenticated()
      
      expect(result).toBe(false)
    })

    it('retourne false si token est une chaîne vide', () => {
      mockCookies.get.mockReturnValue('')
      
      const result = isAuthenticated()
      
      expect(result).toBe(false)
    })
  })
}) 