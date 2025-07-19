import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie"
import { userType } from "./definitions"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const saveToken = (token: string) => {
  // expiration du token : 1 heure
  Cookies.set(userType.token, token, { 
    expires: 1/24, 
    secure: process.env.NODE_ENV === 'production', // HTTPS en production
    sameSite: 'strict' // Protection CSRF
  })
}

export const getToken = () => {
  return Cookies.get(userType.token)
}

export const removeToken = () => {
  Cookies.remove(userType.token)
}

export const isAuthenticated = () => {
  const token = getToken()
  return !!token
}
