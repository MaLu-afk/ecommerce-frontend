import * as Slider from '@radix-ui/react-slider'

type RangeSliderProps = {
  min?: number
  max?: number
  step?: number
  value: [number, number]
  onChange: (v: [number, number]) => void
  onCommit?: (v: [number, number]) => void // se dispara al soltar
}

export default function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  onCommit,
}: RangeSliderProps) {
  return (
    <Slider.Root
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
      onValueCommit={(v) => onCommit?.([v[0], v[1]] as [number, number])}
      className="relative flex h-8 w-full touch-none select-none items-center"
    >
      <Slider.Track className="relative h-1.5 w-full grow rounded bg-slate-300">
        <Slider.Range className="absolute h-1.5 rounded bg-purple-600" />
      </Slider.Track>

      <Slider.Thumb
        aria-label="Mínimo"
        className="block h-5 w-5 rounded-full border border-slate-400 bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      />
      <Slider.Thumb
        aria-label="Máximo"
        className="block h-5 w-5 rounded-full border border-slate-400 bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      />
    </Slider.Root>
  )
}
