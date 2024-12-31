export interface Seat {
  id: string
  row: string
  number: number
  status: 'available' | 'occupied' | 'selected'
  price: number
}

export interface SeatsResponse {
  seats: Seat[]
  rows: string[]
  columns: number
} 