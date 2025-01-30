'use client'

import Navbar from "@/app/Navbar";
import Filters from "@/app/Filters";
import ImagesGrid from "@/app/ImagesGrid";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Home() {

    const [filters, setFilters] = useState([]);
    const [images, setImages] = useState([]);

    const initialFetchFiltersAndImages = async () => {

        try {
            const response = await axios.get(`http://localhost:5000/api/initial`);
            setFilters(response.data.filters);
            setImages(response.data.images);
        } catch (e) {
            console.error(e)
        }
    }

    const updateQueryParamsAndFetch = async (updatedFilters, filterType) => {
        const queryParams = new URLSearchParams();
        if(filterType == "checkbox"){}
        for (const [key, values] of Object.entries(updatedFilters)) {
            if (filterType === 'checkbox') {
                queryParams.set(`${key}[checkbox]`, values.join(','));
            }
            if (filterType === 'radio') {
                queryParams.set(`${key}[radio]`, values.join(','));
            }
        }

        console.log(queryParams.toString());
    };

    const handleFilterChange = async (updatedFilters, filterType) => {
        await updateQueryParamsAndFetch(updatedFilters, filterType);
    }

    useEffect(() => {
        initialFetchFiltersAndImages();
    }, []);


    return (
        <main className="max-w-7xl mx-auto mt-10 px-4">
            <Navbar/>
            <div className="w-full flex flex-col md:flex-row">
                <div className="w-full md:w-[25%] p-2">
                    <Filters filters={filters} onFilterChange={handleFilterChange}/>
                </div>
                <div className="w-full md:w-[75%] p-2">
                    <ImagesGrid images={images}/>
                </div>
            </div>
        </main>
    );
}
