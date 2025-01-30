'use client'

import {useEffect, useState} from "react";

const CheckBoxesAndRadioItem = ({id, label, ...props}) => {
    return (
        <div className="flex items-center">
            <input id={id} className="w-5 h-5 shrink-0 mr-3" {...props} />
            <label htmlFor={id} className="text-md">{label}</label>
        </div>
    );
};

const Filters = ({filters, onFilterChange}) => {
    const [filtersState, setFiltersState] = useState([]);
    const handleFilterChange = (name, value, filterType) => {
        setFiltersState((prevState) => {
            const updatedFilters = {...prevState};
            if (filterType === 'checkbox') {
                if (updatedFilters[name]) {
                    if (updatedFilters[name].includes(value)) {
                        updatedFilters[name] = updatedFilters[name].filter((v) => v !== value);
                    } else {
                        updatedFilters[name].push(value);
                    }
                } else {
                    updatedFilters[name] = [value];
                }
            }

            if (filterType === 'radio') {
                if (updatedFilters[name] === value) {
                    updatedFilters[name] = [];
                } else {
                    updatedFilters[name] = [value];
                }
            }

            onFilterChange(updatedFilters, filterType);
            console.log(updatedFilters);
            return updatedFilters;
        });
    };

    return (
        <div className="col-span-2 space-y-6 top-12 h-fit sticky">
            <div className="py-2 mb-8">
                <button
                    className="text-red-500 cursor-pointer font-semibold"
                    onClick={() => {
                        setFiltersState([]);
                    }}>
                    Clear Filters
                </button>
            </div>
            {filters.map(({label, name, type, options}) => {
                return (
                    <div key={name} className="border-b pb-4">
                        <p className="font-medium mb-4 capitalize">{label}</p>
                        <div className="space-y-2">
                            {options.map((value, index) => {
                                return (
                                    <div key={index} className="flex items-center hover:opacity-75">
                                        {(type === "radio" || type === 'checkbox' ?
                                            <CheckBoxesAndRadioItem
                                                key={name}
                                                type={type}
                                                name={label}
                                                label={value}
                                                id={value.toLowerCase().trim()}
                                                value={value}
                                                onChange={() => handleFilterChange(name, value, type)}
                                                checked={filtersState[name]?.includes(value) || false}
                                            /> : null)}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Filters;
