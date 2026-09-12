'use client'

import { useEffect, useRef } from 'react'
import { COLOR_KEYS, getColorHex, type ColorKey } from '@/lib/colors'

const CELL_SIZE = 16
// Changed cells are repainted over a few frames so incoming votes read as
// pixels flipping one by one rather than the whole mural snapping at once.
const FLIP_DURATION_MS = 700

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Largest-remainder method so rounded per-color pixel counts sum exactly to the grid total.
function allocateCounts(percentages: Record<ColorKey, number>, total: number): Record<ColorKey, number> {
  const raw = COLOR_KEYS.map((key) => ({ key, exact: (percentages[key] / 100) * total }))
  const floors = raw.map(({ key, exact }) => ({ key, floor: Math.floor(exact), rem: exact - Math.floor(exact) }))
  let allocated = floors.reduce((sum, f) => sum + f.floor, 0)
  const counts: Record<ColorKey, number> = Object.fromEntries(floors.map((f) => [f.key, f.floor])) as Record<
    ColorKey,
    number
  >
  const byRemainder = [...floors].sort((a, b) => b.rem - a.rem)
  let i = 0
  while (allocated < total && byRemainder.length > 0) {
    counts[byRemainder[i % byRemainder.length].key] += 1
    allocated += 1
    i += 1
  }
  return counts
}

function countGrid(grid: ColorKey[]): Record<ColorKey, number> {
  const counts: Record<ColorKey, number> = Object.fromEntries(COLOR_KEYS.map((k) => [k, 0])) as Record<
    ColorKey,
    number
  >
  for (const key of grid) counts[key] += 1
  return counts
}

/**
 * Mutates `grid` toward `target` by recolouring the fewest cells possible, and
 * returns the indices that changed. Keeping every untouched cell where it is
 * means the mural stays recognisable as it updates.
 */
function reconcile(grid: ColorKey[], target: Record<ColorKey, number>): number[] {
  const current = countGrid(grid)

  const deficits: ColorKey[] = []
  for (const key of COLOR_KEYS) {
    for (let n = current[key]; n < target[key]; n++) deficits.push(key)
  }
  if (deficits.length === 0) return []

  const surplusIndices: number[] = []
  const remaining = { ...current }
  for (let i = 0; i < grid.length; i++) {
    const key = grid[i]
    if (remaining[key] > target[key]) {
      remaining[key] -= 1
      surplusIndices.push(i)
    }
  }

  const picks = shuffle(surplusIndices).slice(0, deficits.length)
  const incoming = shuffle(deficits)
  picks.forEach((idx, n) => {
    grid[idx] = incoming[n]
  })
  return picks
}

export default function PixelCanvas({ percentages }: { percentages: Record<ColorKey, number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const gridRef = useRef<ColorKey[]>([])
  const colsRef = useRef(0)
  const percentagesRef = useRef(percentages)
  percentagesRef.current = percentages

  // Full (re)build: on mount and whenever the viewport changes the grid size.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    function rebuild() {
      const dpr = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      const cols = Math.ceil(width / CELL_SIZE)
      const rows = Math.ceil(height / CELL_SIZE)
      colsRef.current = cols

      const counts = allocateCounts(percentagesRef.current, cols * rows)
      const flat: ColorKey[] = []
      for (const key of COLOR_KEYS) {
        for (let n = 0; n < counts[key]; n++) flat.push(key)
      }
      gridRef.current = shuffle(flat)

      for (let idx = 0; idx < gridRef.current.length; idx++) {
        ctx!.fillStyle = getColorHex(gridRef.current[idx])
        ctx!.fillRect((idx % cols) * CELL_SIZE, Math.floor(idx / cols) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      }
    }

    rebuild()

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(rebuild, 200)
    }
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Live updates: recolour only the cells the new numbers actually move.
  useEffect(() => {
    const ctx = ctxRef.current
    const grid = gridRef.current
    const cols = colsRef.current
    if (!ctx || grid.length === 0 || cols === 0) return

    const changed = reconcile(grid, allocateCounts(percentages, grid.length))
    if (changed.length === 0) return

    const order = shuffle(changed)
    const start = performance.now()
    let painted = 0
    let frame = 0

    function step(now: number) {
      const progress = Math.min((now - start) / FLIP_DURATION_MS, 1)
      const upTo = Math.ceil(order.length * progress)
      for (; painted < upTo; painted++) {
        const idx = order[painted]
        ctx!.fillStyle = getColorHex(grid[idx])
        ctx!.fillRect((idx % cols) * CELL_SIZE, Math.floor(idx / cols) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      }
      if (progress < 1) frame = requestAnimationFrame(step)
    }

    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [percentages])

  return <canvas ref={canvasRef} className="fixed inset-0 w-screen h-screen" />
}
