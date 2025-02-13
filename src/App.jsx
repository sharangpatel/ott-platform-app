import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { createGlobalState, useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite';


const API_BASE_URL = 'https://imdb236.p.rapidapi.com';
const API_KEY = import.meta.env.VITE_IMDB_API_KEY

const API_OPTIONS = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': `${API_KEY}`,
		'x-rapidapi-host': 'imdb236.p.rapidapi.com'
	}
};
const App = () => {
  const [searchTerm,setSearchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies,setTrendingMovies] = useState([])
  const [isLoading,setIsLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState('')

  //Debounce the search to prevent making too many API requests
  //by waiting for the user to stop typing for 1000ms 
  useDebounce(()=>setDebounceSearchTerm(searchTerm),1000,[searchTerm])


  const fetchMovies = async(query='')=>{
    setIsLoading(true);
    setErrorMessage('')
    console.log('API key aagyi kya',API_KEY);
    try {
      const endpoint = query ?
      `${API_BASE_URL}/imdb/autocomplete?query=${query}` :
      `${API_BASE_URL}/imdb/most-popular-movies`
      const response = await fetch(endpoint, API_OPTIONS);
     
      if(!response.ok){
        throw new Error("Failed to fetch movies");
      }

	    const data = await response.json();

      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch moviess')
        setMovieList([]);
        return
      }
      console.log("this is",data);
      
      setMovieList(data || [])
      console.log(data[0]);
      if(query && data.length > 0){
        await updateSearchCount(query , data[0])
      }

    } catch (error) {
      console.log(`Error fetching movies ${error}`);
      setErrorMessage('Error fetching movies, try again later')
    }finally{
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async()=>{
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm])
  
  useEffect(()=>{
    loadTrendingMovies()
  },[])

  return (
    <main>
     <div className='pattern'/>

     <div className='wrapper'>
        <header>
          <img src='./hero-img.png' alt='hero-banner'/>
          <h1>
            Find <span className='text-gradient'>Movies</span> You'll Enjoy Without Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        </header>
        
        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index)=>{
                return (
                  <li key={movie.$id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_URL} alt='movie.primaryTitle'/>
                  </li>  
                )
              })}
            </ul>
          </section>
        )}

        {/* {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.primaryImage} alt={movie.primaryTitle} />
                </li>
              ))}
            </ul>
          </section>
        )} */}

        <section className='all-movies'>
          <h2 >All Movies</h2>
            {isLoading ? (
              <Spinner/>
            ) : errorMessage ? (
                <p className='text-red-500'>{errorMessage}</p>
              ) : (
              <ul>
                {movieList.map((movie)=>(
                  <MovieCard key={movie.id} movie={movie} />              
                 ))}
              </ul>
            )}
          
        </section>
       
     </div>
    </main>
  )
}

export default App