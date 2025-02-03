import MovieCard from './MovieCard';
import {useEffect, useState} from "react";

const MoviesGrid = ({movies, perPage, totalNumberOfMovies, handlePageLoading}) => {
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        handlePageLoading(pageNumber)
    }, [pageNumber]);
    return (
        <div className="flex flex-col">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 ml-8">
                {Object.entries(movies).map(([key, movie_props]) => (
                    <div key={key}>
                        <MovieCard movie={{poster_url: key, ...movie_props}}/>
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center mt-12">
                <span className="text-sm text-gray-700">
                    Showing
                    <span className="font-semibold text-gray-900"> {perPage * (pageNumber-1) != 0 ? perPage * (pageNumber-1) : 1}</span> to <span
                    className="font-semibold text-gray-900">{perPage * pageNumber < totalNumberOfMovies ? perPage * pageNumber : totalNumberOfMovies}</span> of <span
                    className="font-semibold text-gray-900">{totalNumberOfMovies}</span> Entries
  </span>
                <div className="inline-flex mt-2 gap-4 mb-4">
                    <button
                        onClick={() => {
                            setPageNumber((prev) => prev > 1 ? prev - 1 : 1)
                        }}
                        className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-slate-500 rounded-md hover:bg-gray-900">
                        <svg className="w-3.5 h-3.5 me-2 rtl:rotate-180" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M13 5H1m0 0 4 4M1 5l4-4"/>
                        </svg>
                        Prev
                    </button>
                    <button
                        onClick={() => {
                            setPageNumber((prev) => prev < totalNumberOfMovies / perPage ? prev + 1 : prev)
                        }}
                        className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-slate-500 rounded-md hover:bg-gray-900">
                        Next
                        <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoviesGrid;
