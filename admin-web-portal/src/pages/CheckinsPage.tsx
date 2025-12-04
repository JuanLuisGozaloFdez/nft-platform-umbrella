import OwnerLookupForm from '../components/OwnerLookupForm'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { validateCheckin } from '../services/checkinService'

type FormVals = { tokenId: string; expectedOwner?: string }

export default function CheckinsPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormVals>()
  const validate = useMutation({
    mutationFn: async (vals: FormVals) => validateCheckin(vals.tokenId, vals.expectedOwner)
  })

  const onSubmit = (vals: FormVals) => validate.mutate(vals)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Check-ins</h1>
      <p>Valida propiedad del NFT del ticket antes de permitir acceso.</p>
      <OwnerLookupForm />
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3 bg-white p-4 border rounded">
        <input className="border p-2 col-span-1" placeholder="Token ID" {...register('tokenId', { required: true })} />
        <input className="border p-2 col-span-1" placeholder="Wallet esperado (opcional)" {...register('expectedOwner')} />
        <div className="col-span-2 flex justify-end">
          <button type="submit" className="bg-black text-white px-3 py-2" disabled={validate.isLoading}>
            {validate.isLoading ? 'Validando...' : 'Permitir entrada'}
          </button>
        </div>
        {errors.tokenId && <p className="col-span-2 text-red-600">Token ID es obligatorio</p>}
        {validate.error && <p className="col-span-2 text-red-600">Error: {(validate.error as any)?.message || String(validate.error)}</p>}
        {validate.data && (
          <p className={`col-span-2 ${validate.data.ok ? 'text-green-700' : 'text-red-700'}`}>
            {validate.data.ok ? 'Acceso permitido' : `Acceso denegado (${validate.data.reason || 'motivo desconocido'})`} — Owner: {validate.data.owner}
          </p>
        )}
      </form>
    </div>
  )
}
