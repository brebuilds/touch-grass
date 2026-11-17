import { useEffect, useRef } from "react"

const TAU = Math.PI * 2

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function mix(a, b, amount) {
  return a + (b - a) * amount
}

function easeOutQuart(value) {
  return 1 - (1 - value) ** 4
}

function parseColor(input) {
  const value = input.trim()
  const hex = value.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)
  if (hex) {
    return {
      r: Number.parseInt(hex[1], 16),
      g: Number.parseInt(hex[2], 16),
      b: Number.parseInt(hex[3], 16),
    }
  }

  const shortHex = value.match(/^#([\da-f])([\da-f])([\da-f])$/i)
  if (shortHex) {
    return {
      r: Number.parseInt(shortHex[1] + shortHex[1], 16),
      g: Number.parseInt(shortHex[2] + shortHex[2], 16),
      b: Number.parseInt(shortHex[3] + shortHex[3], 16),
    }
  }

  return { r: 55, g: 146, b: 78 }
}

function rgb(color) {
  return `rgb(${Math.round(color.r)} ${Math.round(color.g)} ${Math.round(color.b)})`
}

function seededRandom(seed) {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function createBlades(options) {
  const {
    width,
    height,
    count,
    bladeHeight,
    bladeWidth,
    heightVariation,
    widthVariation,
    baseColor,
    tipColor,
    dryColor,
    dryChance,
    stagger,
  } = options

  const random = seededRandom(104729 + Math.round(width * 3 + height))
  const blades = []
  const rows = 6
  const base = parseColor(baseColor)
  const tip = parseColor(tipColor)
  const dry = parseColor(dryColor)

  for (let row = 0; row < rows; row += 1) {
    const rowCount = Math.floor(count / rows)
    const depth = 0.48 + (row / (rows - 1)) * 0.52
    const groundY = height - 2 + row * 3.6

    for (let index = 0; index < rowCount; index += 1) {
      const blend = random()
      const noise = (random() - 0.5) * 24
      const isDry = random() < dryChance
      const color = isDry
        ? {
            r: mix(base.r, dry.r, 0.65 + random() * 0.35),
            g: mix(base.g, dry.g, 0.65 + random() * 0.35),
            b: mix(base.b, dry.b, 0.65 + random() * 0.35),
          }
        : {
            r: clamp(mix(base.r, tip.r, blend) + noise, 0, 255),
            g: clamp(mix(base.g, tip.g, blend) + noise, 0, 255),
            b: clamp(mix(base.b, tip.b, blend) + noise, 0, 255),
          }

      const heightScale = 1 + (random() - 0.5) * heightVariation * 2
      const widthScale = 1 + (random() - 0.5) * widthVariation * 2
      const cellWidth = width / rowCount

      blades.push({
        x: index * cellWidth + random() * cellWidth,
        y: groundY + random() * 8,
        height: Math.max(10, (bladeHeight * depth + (random() - 0.5) * 28) * heightScale),
        width: Math.max(0.45, (bladeWidth + random() * 1.1) * depth * widthScale),
        angle: 0,
        velocity: 0,
        phase: random() * TAU,
        frequency: 0.78 + random() * 0.48,
        depth,
        delay: random() * stagger,
        color,
        jitter: (random() - 0.5) * 0.8,
      })
    }
  }

  return blades.sort((a, b) => a.y - b.y)
}

export function GrassField({
  bladeCount = 2800,
  bladeHeight = 155,
  bladeWidth = 3.5,
  baseColor = "#3a973f",
  tipColor = "#a7cf6f",
  dryColor = "#c4a55a",
  dryChance = 0.1,
  heightVariation = 0.44,
  widthVariation = 0.3,
  windStrength = 0.04,
  windSpeed = 0.9,
  turbulence = 0.38,
  stiffness = 0.055,
  pointerRadius = 140,
  pointerStrength = 0.5,
  growDuration = 1.7,
  growStagger = 1.1,
  nightMode = false,
  lightColor = "#ffd39b",
  lightRadius = 250,
  ambientLight = 0.28,
  className = "",
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const frameRef = useRef(0)
  const bladesRef = useRef([])
  const pointerRef = useRef({ x: -10000, y: -10000, active: false })
  const visibleRef = useRef(true)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return undefined

    const context = canvas.getContext("2d", { alpha: true })
    if (!context) return undefined

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches
    }
    updateMotionPreference()
    mediaQuery.addEventListener("change", updateMotionPreference)

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { rootMargin: "120px" },
    )
    visibilityObserver.observe(container)

    let logicalWidth = 0
    let logicalHeight = 0
    let startTime = performance.now()
    let previousTime = startTime

    const resize = () => {
      const rect = container.getBoundingClientRect()
      logicalWidth = Math.max(1, Math.floor(rect.width))
      logicalHeight = Math.max(1, Math.floor(rect.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.floor(logicalWidth * dpr)
      canvas.height = Math.floor(logicalHeight * dpr)
      canvas.style.width = `${logicalWidth}px`
      canvas.style.height = `${logicalHeight}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      bladesRef.current = createBlades({
        width: logicalWidth,
        height: logicalHeight,
        count: bladeCount,
        bladeHeight,
        bladeWidth,
        heightVariation,
        widthVariation,
        baseColor,
        tipColor,
        dryColor,
        dryChance,
        stagger: growStagger,
      })
      startTime = performance.now()
      previousTime = startTime
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const setPointer = (event) => {
      if (event.pointerType === "touch") return
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * logicalWidth,
        y: ((event.clientY - rect.top) / rect.height) * logicalHeight,
        active: true,
      }
    }
    const clearPointer = () => {
      pointerRef.current.active = false
    }

    canvas.addEventListener("pointermove", setPointer, { passive: true })
    canvas.addEventListener("pointerleave", clearPointer, { passive: true })
    canvas.addEventListener("pointercancel", clearPointer, { passive: true })

    const light = parseColor(lightColor)

    const draw = (now) => {
      frameRef.current = requestAnimationFrame(draw)
      if (!visibleRef.current) {
        previousTime = now
        return
      }

      const reduced = reducedMotionRef.current
      const delta = clamp((now - previousTime) / 16.667, 0.25, 2)
      const time = (now - startTime) / 1000
      previousTime = now
      context.clearRect(0, 0, logicalWidth, logicalHeight)

      const gust = reduced
        ? 0
        : (Math.sin(time * windSpeed) + Math.sin(time * windSpeed * 0.63 + 2.4) * turbulence + Math.sin(time * windSpeed * 2.1 + 0.7) * 0.16) * windStrength

      const pointer = pointerRef.current
      const pointerRadiusSq = pointerRadius * pointerRadius
      const lightFadeRadius = lightRadius * 3.6

      for (const blade of bladesRef.current) {
        const growth = reduced ? 1 : easeOutQuart(clamp((time - blade.delay) / growDuration, 0, 1))
        if (growth < 0.004) continue

        let force = gust * blade.frequency
        if (!reduced) {
          force += Math.sin(time * 2.05 + blade.phase) * 0.008 * blade.depth
        }

        if (pointer.active && !reduced) {
          const dx = pointer.x - blade.x
          const dy = pointer.y - blade.y
          const distanceSq = dx * dx + dy * dy
          if (distanceSq < pointerRadiusSq && distanceSq > 0.001) {
            const falloff = 1 - Math.sqrt(distanceSq) / pointerRadius
            force += (dx > 0 ? -1 : 1) * falloff * falloff * pointerStrength
          }
        }

        blade.velocity += (-stiffness * blade.angle + force) * delta
        blade.velocity *= 0.86 ** delta
        blade.angle = clamp(blade.angle + blade.velocity * delta, -1.25, 1.25)

        const currentHeight = blade.height * growth
        const currentWidth = blade.width * growth
        const sine = Math.sin(blade.angle)
        const cosine = Math.cos(blade.angle)
        const tipX = blade.x + sine * currentHeight
        const tipY = blade.y - cosine * currentHeight
        const controlX = blade.x + sine * currentHeight * 0.56
        const controlY = blade.y - currentHeight * 0.56
        const halfWidth = currentWidth / 2

        context.beginPath()
        context.moveTo(blade.x - halfWidth, blade.y)
        context.quadraticCurveTo(controlX - halfWidth * 0.56 + blade.jitter, controlY, tipX, tipY)
        context.quadraticCurveTo(controlX + halfWidth * 0.56, controlY, blade.x + halfWidth, blade.y)
        context.closePath()

        if (nightMode) {
          const dx = pointer.active ? blade.x - pointer.x : logicalWidth * 0.5 - blade.x
          const dy = pointer.active ? blade.y - pointer.y : logicalHeight * 0.55 - blade.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const illumination = clamp(1 - (distance - lightRadius * 0.25) / lightFadeRadius, 0, 1)
          const factor = ambientLight + illumination * (1 - ambientLight)
          const color = {
            r: blade.color.r * factor + light.r * illumination * 0.12,
            g: blade.color.g * factor + light.g * illumination * 0.08,
            b: blade.color.b * factor + light.b * illumination * 0.04,
          }
          context.fillStyle = rgb(color)
        } else {
          context.fillStyle = rgb(blade.color)
        }

        context.fill()
      }
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      mediaQuery.removeEventListener("change", updateMotionPreference)
      canvas.removeEventListener("pointermove", setPointer)
      canvas.removeEventListener("pointerleave", clearPointer)
      canvas.removeEventListener("pointercancel", clearPointer)
    }
  }, [
    ambientLight,
    baseColor,
    bladeCount,
    bladeHeight,
    bladeWidth,
    dryChance,
    dryColor,
    growDuration,
    growStagger,
    heightVariation,
    lightColor,
    lightRadius,
    nightMode,
    pointerRadius,
    pointerStrength,
    stiffness,
    tipColor,
    turbulence,
    widthVariation,
    windSpeed,
    windStrength,
  ])

  return (
    <div ref={containerRef} className={`grass-field ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="grass-field__canvas" />
    </div>
  )
}
