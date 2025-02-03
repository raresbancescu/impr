'use client'

import {useEffect, useState} from "react";
import FilterItem from "./FilterItem";

const Filters = ({filters, onFilterSubmit, updateQueryParams}) => {
    const [filtersState, setFiltersState] = useState(filters);

    useEffect(() => {
        console.log(filters);
        setFiltersState(filters);
    }, [filters]);


    const handleCheckboxAndRadioFilterChange = (name, value, filterType) => {
        setFiltersState((prevState) => {
            let updatedFilters = {...prevState};
            if (filterType === 'checkbox') {
                const indexToUpdate = updatedFilters[name].options.findIndex((option) => option.value === value);
                updatedFilters[name].options[indexToUpdate].selected = !updatedFilters[name].options[indexToUpdate].selected;
            }

            if(filterType === 'radio') {
               const indexToUpdate = updatedFilters[name].options.findIndex((option) => option.value === value);
                updatedFilters[name].options.forEach((option) => {
                     option.selected = false;
                });
                updatedFilters[name].options[indexToUpdate].selected = true;
            }

            return updatedFilters;
        });

        updateQueryParams(filtersState, "");
    };

    const handleRangeFilterChange = (name, value, index) => {
        setFiltersState((prevState) => {
            const updatedFilters = {...prevState};
            if(index === 0 && value !== "") {
                updatedFilters[name].min_value = value;
            }
            if(index === 1 && value !== "") {
                updatedFilters[name].max_value = value;
            }

            return updatedFilters;
        });
        updateQueryParams(filtersState, "");
    }

    const clearFilters = () => {
        setFiltersState((prevState) => {
            let updatedFilters = {...prevState};
            for (const [key, filter] of Object.entries(updatedFilters)) {
                if (filter.type === 'checkbox' || filter.type === 'radio') {
                    filter.options.forEach((option) => {
                        option.selected = false;
                    });
                }
                if (filter.type === 'range') {
                    filter.min_value = "";
                    filter.max_value = "";
                }
            }
            console.log(updatedFilters);
            return updatedFilters;
        })
        updateQueryParams(filtersState , "");
    }

    return (
        <div className="col-span-2 space-y-6 top-12 h-fit sticky">
            {Object.entries(filters).map(([key,filter_props]) => (
                <FilterItem key={key} filter={{name:key, ...filter_props}} handleCheckboxAndRadioFilterChange={handleCheckboxAndRadioFilterChange} handleRangeFilterChange={handleRangeFilterChange} />
            ))}
            <div className="py-2 mb-8">
                <button
                    className="text-red-500 cursor-pointer font-semibold"
                    onClick={() => clearFilters()}
                >
                    Clear Filters
                </button>
            </div>
            <div className="flex justify-center">
                <button onClick={() => onFilterSubmit()} className="bg-slate-500 w-full text-white hover:bg-gray-900 px-4 py-2 rounded-md mt-12">Filter</button>
            </div>
        </div>
    );
};

export default Filters;
