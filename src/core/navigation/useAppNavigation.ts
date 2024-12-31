import { router } from 'expo-router'
import { APP_ROUTES } from './routes'

export function useAppNavigation() {
  const navigate = {
    toHome: () => router.push(APP_ROUTES.HOME),
    
    toMovies: {
      list: () => router.push(APP_ROUTES.MOVIES.LIST),
      details: (movieId: string) => 
        router.push(APP_ROUTES.MOVIES.DETAILS(movieId)),
    },
    
    toSessions: {
      list: (movieId: string) => 
        router.push(APP_ROUTES.SESSIONS.LIST(movieId)),
      details: (sessionId: string) => 
        router.push(APP_ROUTES.SESSIONS.DETAILS(sessionId)),
    },
    
    toSeats: {
      select: (sessionId: string) => 
        router.push(APP_ROUTES.SEATS.SELECT(sessionId)),
    },
    
    toCheckout: {
      payment: (sessionId: string, selectedSeats: string[]) => 
        router.push(APP_ROUTES.CHECKOUT.PAYMENT(sessionId, selectedSeats)),
    },

    back: () => router.back(),
  }

  return navigate
} 