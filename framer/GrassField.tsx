import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { GrassField as CanvasGrassField } from "../src/components/GrassField"

export default function GrassField(props) {
  return <CanvasGrassField {...props} />
}

GrassField.defaultProps = {
  width: 1200,
  height: 480,
  bladeCount: 3000,
  bladeHeight: 165,
  bladeWidth: 4,
  baseColor: "#3a973f",
  tipColor: "#a7cf6f",
  dryColor: "#c4a55a",
  dryChance: 0.1,
  windStrength: 0.04,
  windSpeed: 0.9,
  turbulence: 0.38,
  pointerRadius: 140,
  pointerStrength: 0.5,
  growDuration: 1.7,
  growStagger: 1.1,
  nightMode: false,
}

addPropertyControls(GrassField, {
  bladeCount: { type: ControlType.Number, title: "Density", min: 300, max: 5000, step: 100 },
  bladeHeight: { type: ControlType.Number, title: "Height", min: 30, max: 240, step: 5 },
  bladeWidth: { type: ControlType.Number, title: "Width", min: 0.5, max: 8, step: 0.25 },
  baseColor: { type: ControlType.Color, title: "Base" },
  tipColor: { type: ControlType.Color, title: "Tip" },
  dryColor: { type: ControlType.Color, title: "Dry" },
  dryChance: { type: ControlType.Number, title: "Dry mix", min: 0, max: 0.5, step: 0.01 },
  windStrength: { type: ControlType.Number, title: "Wind", min: 0, max: 0.2, step: 0.005 },
  windSpeed: { type: ControlType.Number, title: "Speed", min: 0.1, max: 4, step: 0.1 },
  turbulence: { type: ControlType.Number, title: "Gusts", min: 0, max: 1, step: 0.05 },
  pointerRadius: { type: ControlType.Number, title: "Pointer area", min: 30, max: 360, step: 10 },
  pointerStrength: { type: ControlType.Number, title: "Pointer push", min: 0, max: 1.5, step: 0.05 },
  growDuration: { type: ControlType.Number, title: "Grow time", min: 0, max: 5, step: 0.1 },
  growStagger: { type: ControlType.Number, title: "Grow spread", min: 0, max: 3, step: 0.1 },
  nightMode: { type: ControlType.Boolean, title: "Night mode" },
})
