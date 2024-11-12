export function GenreCard({ category, onSelect }) {
  const cardStyle = {
    backgroundColor: category.backgroundColor || '#282828',
  }

  return (
    <div className='genre-card' style={cardStyle} onClick={onSelect}>
      <span className='genre-card__name'>{category.name}</span>
      <img src={category.icons[0].url} alt={category.name} className='genre-card__image' />
    </div>
  )
}
