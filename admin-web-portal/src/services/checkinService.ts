import api from '../lib/api'

export async function validateCheckin(tokenId: string, expectedOwner?: string) {
  const res = await api.post('/checkins/validate', { tokenId, expectedOwner })
  return res.data as { ok: boolean, owner: string, reason?: string }
}
