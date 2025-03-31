export type GuestbookMessage = {
  id: string
  username: string
  message: string
  timestamp: number
  status: 'pending' | 'approved' | 'rejected'
}
