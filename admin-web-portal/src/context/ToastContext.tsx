import { createContext, useContext, useState } from 'react'

type ToastMessage = { id: number; text: string; type?: 'info'|'success'|'error' }

const ToastContext = createContext<{ show: (text: string, type?: ToastMessage['type']) => void }>({ show: () => {} })

let nextId = 1

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  const show = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = nextId++
    setMessages((prev) => [...prev, { id, text, type }])
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id))
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {messages.map((m) => (
          <div key={m.id} className={`px-3 py-2 rounded shadow border bg-white ${m.type==='error' ? 'border-red-300 text-red-700' : m.type==='success' ? 'border-green-300 text-green-700' : 'border-gray-300 text-gray-700'}`}>
            {m.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

// Simple singleton bridge for non-React modules (e.g., axios interceptors)
export const toastBridge: { handler?: (text: string, type?: ToastMessage['type']) => void } = {}
