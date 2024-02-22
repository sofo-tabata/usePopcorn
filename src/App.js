import { useState } from "react";
import Navbar from "./Navbar";
import Main from "./Main";
import SearchResults from "./SearchResults";
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import ListBox from "./ListBox";
import MovieList from "./MovieList";
import WatchedSummery from "./WatchedSummery";
import WatchedList from "./WatchedList";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import MovieDetails from "./MovieDetails";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const KEY = "8ac9b7b0";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId(selectedId === id ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <SearchResults movies={movies} />
      </Navbar>

      <Main>
        <ListBox>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </ListBox>

        <ListBox>
          {selectedId ? (
            <MovieDetails
              KEY={KEY}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </ListBox>
      </Main>
    </>
  );
}
