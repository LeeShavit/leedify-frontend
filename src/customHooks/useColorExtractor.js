import { useState, useEffect } from 'react'
import ColorThief from 'colorthief'

export function useColorExtractor(imageUrl) {
  const [backgroundColor, setBackgroundColor] = useState('')
  const [textColor, setTextColor] = useState('white')

  useEffect(() => {
    if (!imageUrl) return

    const img = new Image()
    img.crossOrigin = 'Anonymous'

    img.onload = () => {
      const colorThief = new ColorThief()
      const color = colorThief.getColor(img)
      const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

      // Calculate brightness to determine text color
      const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000
      const textColor = brightness > 128 ? '#000000' : '#ffffff'

      setBackgroundColor(rgb)
      setTextColor(textColor)
    }

    img.src = imageUrl
  }, [imageUrl])

  return { backgroundColor, textColor }
}
