import { Loader } from '../assets/img/library/icons'
import { PlaylistCard } from './PlaylistCard'

export function StationList({ stations }) {
  if (!stations) return <Loader/>

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
