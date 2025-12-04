import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

type AdminUser = { id: string; email: string; username: string; role: string }

export default function RoleManagementPage() {
  const qc = useQueryClient()
  const { show } = useToast()
  const auth = useAuth()
  const [currentUserId, setCurrentUserId] = useState<string>('')
  
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/api/auth/me')
      setCurrentUserId(res.data.id)
      return res.data
    },
  })

  const { data } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/api/admin/users')).data as AdminUser[],
  })
  
  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      if (id === currentUserId && role !== 'admin') {
        if (!window.confirm('¿Estás seguro de querer cambiar tu propio rol de administrador? Perderás acceso a esta función.')) {
          throw new Error('Operación cancelada')
        }
      }
      return (await api.put(`/api/admin/users/${id}/role`, { role })).data
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); show('Rol actualizado', 'success') },
    onError: (err: any) => { 
      if (err?.message === 'Operación cancelada') return
      show(err?.response?.data?.message || 'Error actualizando rol', 'error') 
    },
  })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Gestión de roles</h1>
      <table className="w-full border bg-white">
        <thead>
          <tr>
            <th className="p-2 text-left">Usuario</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">
                {u.username}
                {u.id === currentUserId && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">(tú)</span>}
              </td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                <select className="border p-1" defaultValue={u.role} onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })} disabled={updateRole.isPending}>
                  <option value="user">user</option>
                  <option value="staff">staff</option>
                  <option value="organizer">organizer</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="p-2 text-center">
                <button className="border px-2 py-1" onClick={() => updateRole.mutate({ id: u.id, role: u.role })} disabled={updateRole.isPending}>
                  {updateRole.isPending ? 'Guardando…' : 'Guardar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
