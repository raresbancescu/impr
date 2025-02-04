'use client'

import Navbar from "@/app/Navbar";
import Filters from "@/app/Filters";
import MoviesGrid from "@/app/MoviesGrid";
import {useEffect, useState} from "react";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";

export default function Home() {

    const [queryParams, setQueryParams] = useState(new URLSearchParams());
    const [filters, setFilters] = useState([]);
    const [movies, setMovies] = useState([]);
    const [moviesLoading, setMoviesLoading] = useState(true);
    const [filtersLoading, setFiltersLoading] = useState(true);

    const initialFetchFiltersAndMovies = async () => {
        setFiltersLoading(true);
        setMoviesLoading(true);
        try {
            const response = await axios.get(`https://danutok.pythonanywhere.com/api/initial`);
            setFilters(response.data.filters);
            setMovies(response.data.movies);
            console.log(response.data.movies);
        } catch (e) {
            console.error(e)
        } finally {
            setFiltersLoading(false);
            setMoviesLoading(false);
        }
    }

    const applyFilters = async () => {
        setFiltersLoading(true);
        setMoviesLoading(true);
        try {
            const response = await axios.get(`https://danutok.pythonanywhere.com/api/filter?${queryParams}`);
            setMovies(response.data.movies);
            setFilters(response.data.filters);
        } catch (e) {
            console.error(e)
        } finally {
            setFiltersLoading(false);
            setMoviesLoading(false);
        }
    }

    const handleChangePageNumber = async (pageNumber) => {
        // setMoviesLoading(true);
        // try{
        //     const response = await axios.get(`http://localhost:5000/api/filter?${queryParams}&page=${pageNumber}`);
        //     setMovies(response.data.movies);
        // }
        // catch (e) {
        //     console.error(e);
        // }
        // setMoviesLoading(false);
    }

    const updateQueryParams = (updatedFilters, searchQuery) => {
        setQueryParams((prevState) => {
            const currentQueryParams = new URLSearchParams(prevState);
            if (updatedFilters !== {}) {
                for (const [key, values] of Object.entries(updatedFilters)) {
                    if (values.type === 'checkbox') {
                        currentQueryParams.set(`${key}[checkbox]`, values.options.filter((option) => option.selected).map((option) => option.value).join(','));
                    }
                    if (values.type === 'radio') {
                        currentQueryParams.set(`${key}[radio]`, values.options.filter((option) => option.selected).map((option) => option.value));
                    }
                    if (values.type === "range") {
                        currentQueryParams.set(`${key}[range]`, `${values.min_value}-${values.max_value}`);
                    }
                }
            }
            if (searchQuery !== "") {
                currentQueryParams.set('search', searchQuery);
            }
            console.log(currentQueryParams.toString());
            return currentQueryParams;
        });
    };

    useEffect(() => {
        initialFetchFiltersAndMovies();
    }, []);

    return (
        <main className="max-w-7xl mx-auto mt-10 px-4">
            <div className="sticky top-0 z-50 bg-white">
                <Navbar updateQueryParams={updateQueryParams} onFilterSubmit={applyFilters} />
            </div>
            <div className="w-full flex flex-col md:flex-row">
                <div className="w-full md:w-[25%] p-2">
                    {filtersLoading ? (
                        <div>
                            <Skeleton variant="text" width="100%" height={40}/>
                            <Skeleton variant="text" width="100%" height={250}/>
                            <Skeleton variant="text" width="100%" height={250}/>
                        </div>
                    ) : (
                        <Filters filters={filters} onFilterSubmit={applyFilters} updateQueryParams={updateQueryParams}/>
                    )}
                </div>
                <div className="w-full md:w-[75%] p-2">
                    {moviesLoading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {Array.from({length: 6}).map((_, index) => (
                                <div key={index}>
                                    <div className="relative">
                                        <Skeleton variant="rectangular" width="100%" height={300}
                                                  className="rounded-md"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : movies.length !==0 ? (
                        <MoviesGrid movies={movies} perPage={10} totalNumberOfMovies={movies.length}
                                    handleChangePageNumber={handleChangePageNumber}/>
                    ) : (<div>No movies found</div>)}
                </div>
            </div>
        </main>
    );
}
