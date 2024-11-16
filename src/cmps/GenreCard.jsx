export function GenreCard({ genre, onSelect }) {
  const cardStyle = {
    backgroundColor: genre.backgroundColor || '#282828',
  }

  return (
    <div className='genre-card' style={cardStyle} onClick={onSelect}>
      <span className='genre-card__name'>{genre.name}</span>
      <img src={genre.icons[0].url} alt={genre.name} className='genre-card__image' />
    </div>
  )
}
