import api from '../lib/api'

export async function adminMintNFT(to: string, ticketId: string, metadata: Record<string, any> = {}) {
  const res = await api.post('/nft/admin/mint', { to, ticketId, metadata })
  return res.data as { txHash: string, status: boolean }
}

export async function adminGetOwner(tokenId: string) {
  const res = await api.get(`/nft/admin/owner/${encodeURIComponent(tokenId)}`)
  return res.data as { tokenId: string, owner: string }
}
