'use client'

import {useEffect, useState} from "react";
import FilterItem from "./FilterItem";

const Filters = ({filters, onFilterSubmit}) => {
    const [filtersState, setFiltersState] = useState(filters);
    const [queryParams, setQueryParams] = useState('');

    useEffect(() => {
        console.log(filters);
        setFiltersState(filters);
    }, [filters]);

    const handleFilterChange = (updatedFilters) => {
        const queryParams = updateQueryParams(updatedFilters);
        setQueryParams(queryParams);
    }

    const updateQueryParams = (updatedFilters) => {
        const queryParams = new URLSearchParams();
        for (const [key, values] of Object.entries(updatedFilters)) {
            if (values.type === 'checkbox') {
                queryParams.set(`${key}[checkbox]`, values.options.filter((option) => option.selected).map((option) => option.value).join(','));
            }
            if (values.type === 'radio') {
                queryParams.set(`${key}[radio]`, values.options.filter((option) => option.selected).map((option) => option.value));
            }
            if (values.type=== "range") {
                queryParams.set(`${key}[range]`, `${values.min_value}-${values.max_value}`);
            }
        }
        console.log(queryParams.toString());
        return queryParams.toString();
    };

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

        handleFilterChange(filtersState);
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
        handleFilterChange(filtersState);
    }

    return (
        <div className="col-span-2 space-y-6 top-12 h-fit sticky">
            <div className="py-2 mb-8">
                <button
                    className="text-red-500 cursor-pointer font-semibold"
                    onClick={() => setFiltersState({})}
                >
                    Clear Filters
                </button>
            </div>

            {Object.entries(filters).map(([key,filter_props]) => (
                <FilterItem key={key} filter={{name:key, ...filter_props}} handleCheckboxAndRadioFilterChange={handleCheckboxAndRadioFilterChange} handleRangeFilterChange={handleRangeFilterChange} />
            ))}

            <div className="flex justify-center">
                <button onClick={() => onFilterSubmit(queryParams)} className="bg-slate-500 w-full text-white px-4 py-2 rounded-md mt-12">Filter</button>
            </div>
        </div>
    );
};

export default Filters;
