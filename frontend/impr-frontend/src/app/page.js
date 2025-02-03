'use client'

import Navbar from "@/app/Navbar";
import Filters from "@/app/Filters";
import MoviesGrid from "@/app/MoviesGrid";
import {useEffect, useState} from "react";
import Skeleton from '@mui/material/Skeleton';
import axios from "axios";

export default function Home() {

    const [filters, setFilters] = useState([]);
    const [movies, setMovies] = useState([]);
    const [moviesLoading, setMoviesLoading] = useState(true);
    const [filtersLoading, setFiltersLoading] = useState(true);

    const initialFetchFiltersAndMovies = async () => {
        setFiltersLoading(true);
        setMoviesLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/initial`);
            setFilters(response.data.filters);
            setMovies(response.data.movies);
            console.log(movies);
        } catch (e) {
            console.error(e)
        } finally {
            setFiltersLoading(false);
            setMoviesLoading(false);
        }
    }

    const applyFilters = async (queryParams) => {
        setFiltersLoading(true);
        setMoviesLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/filter?${queryParams}`);
            setMovies(response.data.movies);
            setFilters(response.data.filters);
        } catch (e) {
            console.error(e)
        } finally {
            setFiltersLoading(false);
            setMoviesLoading(false);
        }
    }

    const generalSearchFetch = async (searchValue) => {
        setMoviesLoading(true);
        setFiltersLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/general-search?search=${searchValue}`);
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
        setMoviesLoading(true);
        console.log(pageNumber);
        setMoviesLoading(false);
    }

    useEffect(() => {
        initialFetchFiltersAndMovies();
    }, []);

    return (
        <main className="max-w-7xl mx-auto mt-10 px-4">
            <Navbar generalSearchFetch={generalSearchFetch}/>
            <div className="w-full flex flex-col md:flex-row">
                <div className="w-full md:w-[25%] p-2">
                    {filtersLoading ? (
                        <div>
                            <Skeleton variant="text" width="100%" height={40}/>
                            <Skeleton variant="text" width="100%" height={250}/>
                            <Skeleton variant="text" width="100%" height={250}/>
                        </div>
                    ) : (
                        <Filters filters={filters} onFilterSubmit={applyFilters}/>
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
                    ) : (
                        <MoviesGrid movies={movies} perPage={10} totalNumberOfMovies={36} handlePageLoading={handleChangePageNumber}/>
                    )}
                </div>
            </div>
        </main>
    );
}
