import React from 'react'

const MovieCard = ({movie: 
        {primaryTitle, primaryImage, releaseDate, spokenLanguages , averageRating}
     }) => {
  return (
    <div className='movie-card'>
       <img
        src={primaryImage ? `${primaryImage}` : '/no-movie.png'}
        alt='{primaryTitle}'
       />
       <div className='mt-4'>
          <h3>{primaryTitle}</h3>
       </div>

        <div className='content'>
            <div className='rating'>
                <img src='./Rating.svg' alt='starIcon'/>
                <p>{averageRating ? averageRating : 'N/A'}</p>
            </div>
           <span>•</span>
            <p className='lang'>{spokenLanguages}</p>
            <span>•</span>
            <p className='year'>{releaseDate?releaseDate.split('-')[0]:"N/A"}</p>
        </div>

    </div>
    
  )
}

export default MovieCard