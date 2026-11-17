import { useState } from "react"
import { GrassField } from "./components/GrassField"

export function App() {
  const [night, setNight] = useState(true)
  const [windy, setWindy] = useState(true)

  return (
    <main className={night ? "scene scene--night" : "scene scene--day"}>
      <div className="sky" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#field" aria-label="Field Study home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span>Field Study</span>
        </a>

        <div className="controls" aria-label="Field controls">
          <button
            className="control"
            type="button"
            aria-pressed={windy}
            onClick={() => setWindy((value) => !value)}
          >
            {windy ? "Wind on" : "Wind off"}
          </button>
          <button
            className="control"
            type="button"
            aria-pressed={night}
            onClick={() => setNight((value) => !value)}
          >
            {night ? "Night" : "Day"}
          </button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">An interactive canvas meadow</p>
        <h1 id="hero-title">Move through the field.</h1>
        <p className="lede">Brush the grass with your pointer and watch every blade spring back into the wind.</p>
      </section>

      <div id="field" className="field-wrap">
        <GrassField
          bladeCount={3500}
          bladeHeight={190}
          bladeWidth={4.4}
          baseColor={night ? "#37a45e" : "#4b9c3a"}
          tipColor={night ? "#8bd06d" : "#d7d768"}
          dryColor={night ? "#b2a05f" : "#c6a94e"}
          dryChance={0.13}
          heightVariation={0.52}
          windStrength={windy ? 0.035 : 0}
          windSpeed={0.82}
          turbulence={0.4}
          stiffness={0.052}
          pointerRadius={150}
          pointerStrength={0.42}
          growDuration={1.65}
          growStagger={1.1}
          nightMode={night}
          lightColor="#ffd9a2"
          lightRadius={260}
          ambientLight={0.3}
        />
      </div>

      <p className="hint" aria-hidden="true">Move your pointer across the grass</p>
    </main>
  )
}
