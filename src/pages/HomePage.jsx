import QuickAccess from '../cmps/AccessItems'
import PlaylistCard from '../cmps/PlaylistCard'
import SectionHeader from '../cmps/SectionHeader'

export function HomePage() {
  //add dynamic user name to title later
  return (
    <div className='home-page'>
      <div className='filter-buttons'>
        <button className='filter-buttons__button filter-buttons__button--active'>All</button>
        <button className='filter-buttons__button'>Music</button>
        <button className='filter-buttons__button'>Podcasts</button>
      </div>

      <div>
        <QuickAccess />
      </div>
      <section className='home-page__section'>
        <SectionHeader title='Made For' />
        <div className='home-page__grid'>
          <PlaylistCard title='Release Radar' description='Catch all the latest music from artists you follow' />
        </div>
      </section>
    </div>
  )
}
