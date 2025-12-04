import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { adminGetOwner } from '../services/smartContractService'

type FormVals = { tokenId: string }

export default function OwnerLookupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormVals>()
  const lookup = useMutation({
    mutationFn: async (vals: FormVals) => adminGetOwner(vals.tokenId)
  })

  const onSubmit = (vals: FormVals) => lookup.mutate(vals)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3 bg-white p-4 border rounded">
      <input className="border p-2 col-span-1" placeholder="Token ID" {...register('tokenId', { required: true })} />
      <div className="col-span-1 flex justify-end">
        <button type="submit" className="bg-black text-white px-3 py-2" disabled={lookup.isLoading}>
          {lookup.isLoading ? 'Consultando...' : 'Consultar propietario'}
        </button>
      </div>
      {errors.tokenId && <p className="col-span-2 text-red-600">Token ID es obligatorio</p>}
      {lookup.error && <p className="col-span-2 text-red-600">Error: {(lookup.error as any)?.message || String(lookup.error)}</p>}
      {lookup.data && <p className="col-span-2">Propietario: {lookup.data.owner}</p>}
    </form>
  )
}
