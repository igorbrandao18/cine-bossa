import { apiClient } from '@/core/api/client'
import { SeatsResponse } from '../types/seat'

export class SeatsService {
  static async getSessionSeats(sessionId: string): Promise<SeatsResponse> {
    const response = await apiClient.get(`/sessions/${sessionId}/seats`)
    return response.data
  }
} 