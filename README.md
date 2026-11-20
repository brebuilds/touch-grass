# Touch Grass

An original canvas implementation

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


## Design note

This is powered by a 2D canvas simulation. Rive is excellent for authored vector animation, but canvas is the better fit for thousands of independent blades responding continuously to wind and pointer physics.
