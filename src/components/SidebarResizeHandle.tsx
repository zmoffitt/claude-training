'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSidebarStore, MIN_WIDTH, MAX_WIDTH } from '@/lib/useSidebarStore'

const KEY_STEP = 16
const KEY_STEP_LARGE = 64

export function SidebarResizeHandle() {
  const width = useSidebarStore((s) => s.width)
  const setWidth = useSidebarStore((s) => s.setWidth)
  const [isDragging, setIsDragging] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      startX.current = e.clientX
      startWidth.current = useSidebarStore.getState().width
      setIsDragging(true)
    },
    [],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = e.shiftKey ? KEY_STEP_LARGE : KEY_STEP
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setWidth(useSidebarStore.getState().width - step)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setWidth(useSidebarStore.getState().width + step)
      } else if (e.key === 'Home') {
        e.preventDefault()
        setWidth(MIN_WIDTH)
      } else if (e.key === 'End') {
        e.preventDefault()
        setWidth(MAX_WIDTH)
      }
    },
    [setWidth],
  )

  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX.current
      setWidth(startWidth.current + delta)
    }

    const onMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, setWidth])

  const background = isDragging || isFocused
    ? 'var(--color-violet-400)'
    : 'transparent'

  return (
    <div
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="separator"
      tabIndex={0}
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      aria-valuenow={width}
      style={{
        position: 'absolute',
        top: 0,
        right: -2,
        bottom: 0,
        width: '5px',
        cursor: 'col-resize',
        zIndex: 50,
        background,
        transition: isDragging ? 'none' : 'background 0.15s',
        outline: 'none',
      }}
      onMouseEnter={(e) => {
        if (!isDragging && !isFocused) {
          e.currentTarget.style.background = 'var(--color-violet-300)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging && !isFocused) {
          e.currentTarget.style.background = 'transparent'
        }
      }}
    />
  )
}
