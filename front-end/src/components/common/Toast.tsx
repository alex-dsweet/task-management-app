
import { useCallback, useEffect, useRef, useState } from 'react'

export type ToastType = 'success' | 'error'

type ToastProps = {
  message: string
  type: ToastType
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  const autoCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  const closeToast = useCallback(() => {
    if (autoCloseTimer.current) {
      clearTimeout(autoCloseTimer.current)
    }

    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
    }

    setIsVisible(false)

    closeTimer.current = setTimeout(() => {
      onCloseRef.current()
    }, 300)
  }, [])

  useEffect(() => {
    setIsVisible(true)

    autoCloseTimer.current = setTimeout(() => {
      closeToast()
    }, 3000)

    return () => {
      if (autoCloseTimer.current) {
        clearTimeout(autoCloseTimer.current)
      }

      if (closeTimer.current) {
        clearTimeout(closeTimer.current)
      }
    }
  }, [message, closeToast])

  const isSuccess = type === 'success'

  return (
    <div
      role="alert"
      className={`fixed right-6 top-6 z-[9999] flex items-center gap-3 rounded-xl px-5 py-4 text-white shadow-lg transition-all duration-300 ease-in-out ${
        isSuccess ? 'bg-green-600' : 'bg-red-600'
      } ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-3 opacity-0'
      }`}
    >
      <span className="text-lg font-bold">
        {isSuccess ? '✓' : '✕'}
      </span>

      <p className="text-sm font-medium">{message}</p>

      <button
        type="button"
        onClick={closeToast}
        className="ml-2 text-white/80 transition hover:text-white"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  )
}