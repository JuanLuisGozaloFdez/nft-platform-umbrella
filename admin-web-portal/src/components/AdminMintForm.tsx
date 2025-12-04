import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { adminMintNFT } from '../services/smartContractService'

type FormVals = { to: string; ticketId: string; metadata?: string }

export default function AdminMintForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormVals>()
  const mint = useMutation({
    mutationFn: async (vals: FormVals) => {
      const md = vals.metadata ? JSON.parse(vals.metadata) : {}
      return await adminMintNFT(vals.to, vals.ticketId, md)
    },
    onSuccess: () => reset()
  })

  const onSubmit = (vals: FormVals) => mint.mutate(vals)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3 bg-white p-4 border rounded">
      <input className="border p-2 col-span-1" placeholder="Wallet destino" {...register('to', { required: true })} />
      <input className="border p-2 col-span-1" placeholder="Ticket ID" {...register('ticketId', { required: true })} />
      <textarea className="border p-2 col-span-2" placeholder="Metadata (JSON opcional)" {...register('metadata')} />
      <div className="col-span-2 flex justify-end gap-2">
        <button type="submit" className="bg-black text-white px-3 py-2" disabled={mint.isLoading}>
          {mint.isLoading ? 'Minteando...' : 'Mintear NFT'}
        </button>
      </div>
      {mint.error && <p className="col-span-2 text-red-600">Error: {(mint.error as any)?.message || String(mint.error)}</p>}
      {mint.data && <p className="col-span-2">Tx: {mint.data.txHash} Status: {String(mint.data.status)}</p>}
      {(errors.to || errors.ticketId) && <p className="col-span-2 text-red-600">Wallet y Ticket ID son obligatorios</p>}
    </form>
  )
}
