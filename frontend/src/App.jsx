import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-primary-500 mb-4">
        TypeMaster 🚀
      </h1>
      <p className="text-slate-400 text-lg max-w-md text-center">
        Welcome to the project foundation. Backend and Frontend are now successfully initialized.
      </p>
      <div className="mt-8 flex gap-4">
        <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-primary-500 font-mono">Backend:</span> Connected
        </div>
        <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-primary-500 font-mono">Frontend:</span> React + Vite + Tailwind 4
        </div>
      </div>
    </div>
  )
}

export default App
