import { useColorExtractor } from '../customHooks/useColorExtractor'

export function GenreCard({ category }) {
  const { backgroundColor, textColor } = useColorExtractor(category.icons[0].url)

  const cardStyle = {
    background: backgroundColor ? `linear-gradient(to bottom right, ${backgroundColor}, rgba(0,0,0,0.8))` : '#282828',
    color: textColor,
  }

  return (
    <div className='genre-card' style={cardStyle}>
      <span className='genre-card__name' style={{ color: textColor }}>
        {category.name}
      </span>
      <img src={category.icons[0].url} alt={category.name} className='genre-card__image' />
    </div>
  )
}
