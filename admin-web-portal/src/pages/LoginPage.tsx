export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto p-6 bg-white border rounded">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>
      <form className="flex flex-col gap-3">
        <input className="border p-2" placeholder="Email" />
        <input type="password" className="border p-2" placeholder="Password" />
        <button className="bg-black text-white py-2">Login</button>
      </form>
    </div>
  )
}
