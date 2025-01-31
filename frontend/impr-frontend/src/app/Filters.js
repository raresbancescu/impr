'use client'

import {useState} from "react";
import FilterItem from "./FilterItem";

const CheckBoxesAndRadioItem = ({id, label, ...props}) => {
    return (
        <div className="flex items-center space-x-4 col-span-2">
            <input
                id={id}
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                {...props}
            />
            <label htmlFor={id} className="text-lg font-semibold text-gray-900">
                {label}
            </label>
        </div>
    );
};

const updateQueryParams = (updatedFilters, filterType) => {
    const queryParams = new URLSearchParams();
    for (const [key, values] of Object.entries(updatedFilters)) {
        if (filterType === 'checkbox') {
            queryParams.set(`${key}[checkbox]`, values.join(','));
        }
        if (filterType === 'radio') {
            queryParams.set(`${key}[radio]`, values.join(','));
        }
        if (filterType === "range") {
            queryParams.set(`${key}[range]`, values.join('-'));
        }
    }
    console.log(queryParams.toString());
    return queryParams.toString();
};



const Filters = ({filters, onFilterSubmit}) => {
    const [filtersState, setFiltersState] = useState({});
    const [queryParams, setQueryParams] = useState('');

    const handleFilterChange = (updatedFilters, filterType) => {
        const queryParams = updateQueryParams(updatedFilters, filterType);
        setQueryParams(queryParams);
    }

    const handleCheckboxAndRadioFilterChange = (name, value, filterType) => {
        setFiltersState((prevState) => {
            const updatedFilters = {...prevState};

            if (filterType === 'checkbox') {
                if (updatedFilters[name]?.includes(value)) {
                    updatedFilters[name] = updatedFilters[name].filter((v) => v !== value);
                } else {
                    updatedFilters[name] = [...(updatedFilters[name] || []), value];
                }
                handleFilterChange(updatedFilters, filterType);
            }

            if (filterType === 'radio') {
                updatedFilters[name] = [value];
                handleFilterChange(updatedFilters, filterType);
            }

            return updatedFilters;
        });
    };

    const handleRangeFilterChange = (name, value, index) => {
        setFiltersState((prevState) => {
            const updatedFilters = {...prevState};
            if (updatedFilters[name] == null) {
                updatedFilters[name] = [];
            }
            updatedFilters[name][index] = value;
            if (updatedFilters[name].length === 2 && updatedFilters[name][0] !== "" && updatedFilters[name][1] !== "") {
                handleFilterChange(updatedFilters, "range");
            }
            return updatedFilters;
        });
    }

    const renderFilters = (filter) => {
        if (filter.type === 'checkbox' || filter.type === 'radio') {
            return filter.options.map((option) => (
                <CheckBoxesAndRadioItem
                    key={option.value}
                    type={filter.type}
                    name={filter.name}
                    label={option.label}
                    id={option.value.toLowerCase().trim()}
                    value={option.value}
                    onChange={() => handleCheckboxAndRadioFilterChange(filter.name, option.value, filter.type)}
                    checked={filtersState[filter.name]?.includes(option.value) || false}
                    className="col-span-1"
                />
            ));
        }

        if (filter.type === "range") {
            return (
                <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor={`${filter.name}_min`} className="block mb-2 text-sm font-medium text-gray-900">
                            {filter.min_label}
                        </label>
                        <input
                            onBlur={(e) => handleRangeFilterChange(filter.name, e.target.value, 0)}
                            type="number"
                            id={`${filter.name}_min`}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                    <div>
                        <label htmlFor={`${filter.name}_max`} className="block mb-2 text-sm font-medium text-gray-900">
                            {filter.max_label}
                        </label>
                        <input
                            onBlur={(e) => handleRangeFilterChange(filter.name, e.target.value, 1)}
                            type="number"
                            id={`${filter.name}_max`}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        />
                    </div>
                </div>
            );
        }
    };

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

            {filters.map((filter) => (
                <FilterItem key={filter.name} filter={filter} renderFilters={renderFilters}/>
            ))}

            <div className="flex justify-center">
                <button onClick={() => onFilterSubmit(queryParams)} className="bg-slate-500 w-full text-white px-4 py-2 rounded-md mt-12">Filter</button>
            </div>
        </div>
    );
};

export default Filters;
