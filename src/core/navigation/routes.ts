export const APP_ROUTES = {
  HOME: '/',
  MOVIES: {
    LIST: '/movies',
    DETAILS: (movieId: string) => `/movies/${movieId}` as const,
  },
  SESSIONS: {
    LIST: (movieId: string) => `/movies/${movieId}/sessions` as const,
    DETAILS: (sessionId: string) => `/sessions/${sessionId}` as const,
  },
  SEATS: {
    SELECT: (sessionId: string) => `/seats/${sessionId}` as const,
  },
  CHECKOUT: {
    PAYMENT: (sessionId: string, selectedSeats: string[]) => ({
      pathname: '/checkout',
      params: {
        sessionId,
        selectedSeats: selectedSeats.join(','),
      },
    } as const),
  },
} as const

export type AppRoutes = typeof APP_ROUTES 