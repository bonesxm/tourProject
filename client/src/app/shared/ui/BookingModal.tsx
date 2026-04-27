import { useMemo, useState } from 'react'
import { X } from 'lucide-react'

export function BookingModal() {
  const [open, setOpen] = useState(false)
  const [destination, setDestination] = useState('Bali')
  const [dates, setDates] = useState('2026-06-10 to 2026-06-17')
  const [guests, setGuests] = useState(2)
  const [budget, setBudget] = useState(1800)
  const [done, setDone] = useState(false)
  const [step, setStep] = useState(1)

  const total = useMemo(() => budget + guests * 120, [budget, guests])

  return (
    <>
      <button
        onClick={() => {
          setDone(false)
          setStep(1)
          setOpen(true)
        }}
        className="fixed bottom-24 right-5 z-40 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02] md:bottom-6"
      >
        Quick Booking
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-950/95">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Plan Your Luxury Escape</h3>
              <button onClick={() => setOpen(false)} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="size-4" />
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`rounded-full px-2 py-1 ${step >= s ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200' : 'bg-slate-100 dark:bg-slate-800'}`}
                >
                  Step {s}
                </div>
              ))}
            </div>

            {done ? (
              <div className="rounded-2xl bg-emerald-50 p-6 text-center dark:bg-emerald-950/40">
                <div className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                  Booking Confirmed!
                </div>
                <p className="mt-2 text-sm text-emerald-700/80 dark:text-emerald-300/80">
                  Your journey to {destination} is in progress. E-ticket and invoice will be sent to
                  your email.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {step === 1 ? (
                  <>
                    <label className="grid gap-1 text-sm">
                      Destination
                      <input value={destination} onChange={(e) => setDestination(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
                    </label>
                    <label className="grid gap-1 text-sm">
                      Dates
                      <input value={dates} onChange={(e) => setDates(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
                    </label>
                    <button onClick={() => setStep(2)} className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white dark:bg-white dark:text-slate-900">Continue</button>
                  </>
                ) : null}

                {step === 2 ? (
                  <>
                    <label className="grid gap-1 text-sm">
                      Guests
                      <input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
                    </label>
                    <label className="grid gap-1 text-sm">
                      Budget (USD)
                      <input type="number" min={100} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" />
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => setStep(1)} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">Back</button>
                      <button onClick={() => setStep(3)} className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white dark:bg-white dark:text-slate-900">Review</button>
                    </div>
                  </>
                ) : null}

                {step === 3 ? (
                  <>
                    <div className="rounded-2xl bg-sky-50 p-4 text-sm dark:bg-sky-950/40">
                      <div>Destination: <b>{destination}</b></div>
                      <div>Dates: <b>{dates}</b></div>
                      <div>Guests: <b>{guests}</b></div>
                      <div className="mt-2">Payment summary: <span className="font-semibold">${total}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setStep(2)} className="rounded-xl border border-slate-200 px-4 py-3 font-semibold dark:border-slate-700">Back</button>
                      <button
                        onClick={() => setDone(true)}
                        className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-3 font-semibold text-white"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}

