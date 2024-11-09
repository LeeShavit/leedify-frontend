// import { PlaylistCard } from './PlaylistCard'

export function StationList({ stations }) {
  if (!stations) return <div>Loading...</div>

  return (
    <div className='station-list home-page__grid'>
      {stations.map((station) => (
        <PlaylistCard
          key={station._id}
          title={station.name}
          description={station.description}
          imageUrl={station.imgUrl}
          songCount={station.songs.length}
        />
      ))}
    </div>
  )
}
