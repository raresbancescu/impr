'use client'

import Navbar from "@/app/Navbar";
import Filters from "@/app/Filters";
import ImagesGrid from "@/app/ImagesGrid";
import {useEffect, useState} from "react";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import axios from "axios";

export default function Home() {

    const [filters, setFilters] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const initialFetchFiltersAndImages = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/initial`);
            setFilters(response.data.filters);
            setImages(response.data.images);
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false);
        }
    }

    const applyFilters = async (queryParams) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/filter?${queryParams}`);
            setImages(response.data.images);
            setFilters(response.data.filters);
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false);
        }
    }

    const generalSearchFetch = async (searchValue) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/general-search?search=${searchValue}`);
            setImages(response.data.images);
            setFilters(response.data.filters);
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        initialFetchFiltersAndImages();
    }, []);

    return (
        <main className="max-w-7xl mx-auto mt-10 px-4">
            <Navbar generalSearchFetch={generalSearchFetch}/>
            <div className="w-full flex flex-col md:flex-row">
                <div className="w-full md:w-[25%] p-2">
                    {loading ? (
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
                    {loading ? (
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
                        <ImagesGrid images={images}/>
                    )}
                </div>
            </div>
        </main>
    );
}
