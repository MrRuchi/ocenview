import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = sessionStorage.getItem('ovr_token')
    const storedUser = sessionStorage.getItem('ovr_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (authData) => {
    setToken(authData.token)
    setUser({ username: authData.username, role: authData.role, userId: authData.userId })
    sessionStorage.setItem('ovr_token', authData.token)
    sessionStorage.setItem('ovr_user', JSON.stringify({
      username: authData.username, role: authData.role, userId: authData.userId
    }))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    sessionStorage.removeItem('ovr_token')
    sessionStorage.removeItem('ovr_user')
  }

  const isAdmin = () => user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
