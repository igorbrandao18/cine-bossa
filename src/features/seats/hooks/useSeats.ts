import { useState, useEffect } from 'react'
import { SeatsService } from '../services/seatsService'
import { Seat } from '../types/seat'

export function useSeats(sessionId: string) {
  const [seats, setSeats] = useState<Seat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSeats()
  }, [sessionId])

  const loadSeats = async () => {
    try {
      setLoading(true)
      const response = await SeatsService.getSessionSeats(sessionId)
      setSeats(response.seats)
    } catch (err) {
      setError('Erro ao carregar assentos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { seats, loading, error }
} 