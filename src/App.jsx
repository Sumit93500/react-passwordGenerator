import { useState, useCallback, useEffect, useMemo } from 'react'

const strengthInfo = (length, numbers, symbols) => {
  if (length >= 20 && numbers && symbols) return { label: 'Excellent', value: 100, accent: 'bg-emerald-400' }
  if (length >= 16 && (numbers || symbols)) return { label: 'Strong', value: 80, accent: 'bg-sky-400' }
  if (length >= 12) return { label: 'Moderate', value: 60, accent: 'bg-amber-400' }
  return { label: 'Basic', value: 40, accent: 'bg-rose-400' }
}

const createPassword = (length, numbers, symbols, seed) => {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  if (numbers) chars += '0123456789'
  if (symbols) chars += '!@#$%^&*-_+=[]{}~`'

  let value = seed + length * 1315423911 + (numbers ? 2654435761 : 0) + (symbols ? 97531 : 0)
  let result = ''

  for (let i = 0; i < length; i++) {
    value = (value * 1664525 + 1013904223) >>> 0
    result += chars[value % chars.length]
  }

  return result
}

function App() {
  const [length, setLength] = useState(14)
  const [numberAllowed, setNumberAllowed] = useState(true)
  const [charAllowed, setCharAllowed] = useState(true)
  const [seed, setSeed] = useState(0)
  const [copied, setCopied] = useState(false)

  const password = useMemo(
    () => createPassword(length, numberAllowed, charAllowed, seed),
    [length, numberAllowed, charAllowed, seed],
  )

  const copyPasswordToClipboard = useCallback(() => {
    if (!password) return
    window.navigator.clipboard.writeText(password)
    setCopied(true)
  }, [password])

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1300)
    return () => clearTimeout(timer)
  }, [copied])

  const strength = useMemo(
    () => strengthInfo(length, numberAllowed, charAllowed),
    [length, numberAllowed, charAllowed],
  )

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <section className="mb-10 rounded-4xl border border-white/10 bg-slate-900/85 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-10">
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <p className="inline-flex items-center justify-center rounded-full bg-cyan-500/15 px-3 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300 sm:justify-start">
              Smart Password Studio
            </p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Professional Password Generator
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Generate secure, modern passwords backed by instant copy and strength analysis.
              </p>
            </div>
          </div>
        </section>

        <main className="rounded-4xl border border-slate-700/80 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40 ring-1 ring-slate-700/60 sm:p-10">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Generated password</p>
              <div className="mt-3 flex items-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-950 px-4 py-3 shadow-inner shadow-slate-950/30">
                <input
                  type="text"
                  value={password}
                  readOnly
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
                  placeholder="Your next secure password"
                />
                <button
                  type="button"
                  onClick={copyPasswordToClipboard}
                  className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors duration-200 hover:bg-cyan-400"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSeed((prev) => prev + 1)}
              className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Generate again
            </button>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-700/80 bg-slate-950/80 p-6 shadow-sm shadow-slate-950/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Password length</p>
                  <p className="mt-1 text-3xl font-semibold text-white">{length}</p>
                </div>
                <div className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-cyan-300">
                  Strength: {strength.label}
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <input
                  type="range"
                  min={6}
                  max={100}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className={`${strength.accent} h-full rounded-full`} style={{ width: `${strength.value}%` }} />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="group rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5 transition hover:border-cyan-400/80 hover:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Include numbers</p>
                    <p className="mt-1 text-sm text-slate-400">Add digits to strengthen the password.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={numberAllowed}
                    onChange={(e) => setNumberAllowed(e.target.checked)}
                    className="h-5 w-5 rounded-lg border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-300"
                  />
                </div>
              </label>

              <label className="group rounded-3xl border border-slate-700/80 bg-slate-950/80 p-5 transition hover:border-cyan-400/80 hover:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-200">Include symbols</p>
                    <p className="mt-1 text-sm text-slate-400">Enable special characters for extra entropy.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={charAllowed}
                    onChange={(e) => setCharAllowed(e.target.checked)}
                    className="h-5 w-5 rounded-lg border-slate-600 bg-slate-800 text-cyan-400 focus:ring-cyan-300"
                  />
                </div>
              </label>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
