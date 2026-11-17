# Animated Grass Field

An original canvas implementation inspired by the interaction and visual behavior of the Framer Animated Grass Field reference.

## Included

- 3,500 independently simulated blades
- layered wind and turbulence
- pointer repulsion with spring-back
- staggered grow-on-load entrance
- day and night lighting
- retina canvas rendering
- automatic offscreen pausing
- reduced-motion fallback
- touch-friendly scrolling
- reusable React component
- optional Framer code component wrapper

## Run the demo

```bash
npm install
npm run dev
```

## Reuse the React component

Copy `src/components/GrassField.jsx` into a React project, then render it inside a sized container:

```jsx
<div style={{ height: 420 }}>
  <GrassField bladeCount={3500} nightMode />
</div>
```

## Use in Framer

Create a Framer code component from `framer/GrassField.tsx`. The wrapper exposes the main density, color, wind, pointer, growth, and night controls in Framer's property panel.

The Framer wrapper imports the React component from this repository. If you paste it into Framer directly, paste the `GrassField.jsx` implementation into the same code file or update the import to your hosted component package.

## Design note

The reference is powered by a 2D canvas simulation. Rive is excellent for authored vector animation, but canvas is the better fit for thousands of independent blades responding continuously to wind and pointer physics.
