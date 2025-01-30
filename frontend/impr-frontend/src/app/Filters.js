'use client'

import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";


const CheckBoxesAndRadioButtons = ({children}) => {
    return (
        <div className="flex items-center hover:opacity-75">
            {children}
        </div>
    );
};

const CheckBoxesAndRadioItem = ({id, label, ...props}) => {
    return (
        <div className="flex items-center">
            <input id={id} className="w-5 h-5 shrink-0 mr-3" {...props} />
            <label htmlFor={id} className="text-md">{label}</label>
        </div>
    );
};

function checkValidQuery(queries) {
    return queries.filter((query) => query !== '').length > 0;
}


function convertValidStringQueries(queries) {
    let query = '';

    for (let [key, value] of Object.entries(query)) {
        query = query + `${query === '' ? '' : '&'}${key}=${value}`;
    }

    return query;
}

export function saveAllUserOptions(searchParams) {
    let selectedQueries = {};
    searchParams.forEach((values, key) => {
        const queries = values.split(',');
        if (selectedQueries[key]) {
            selectedQueries[key].push(...queries);
        } else {
            selectedQueries[key] = queries;
        }
    });

    return selectedQueries;
}

const Filters = ({filters}) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedFilterQueries, setSelectedFilterQueries] = useState({})

    const selectedFilterOptions = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const filterType = event.target.type;

        let selectedQueries = selectedFilterQueries;

        if (selectedQueries[name]) {
            if (filterType === 'radio') {
                selectedQueries[name] = [value];
            } else if (selectedQueries[name].includes(value)) {
                selectedQueries[name] = selectedQueries[name].filter((query) => query !== value);

                if (!checkValidQuery(selectedQueries[name])) {
                    delete selectedQueries[name];
                }
            } else {
                selectedQueries[name].push(value);
            }
        } else if (selectedQueries) {
            selectedQueries[name] = [value];
        }

        router.push(`/?${convertValidStringQueries(selectedQueries)}`, {scroll: false});
    }

    const isOptionChecked = (id, option) => {
        return (
            Boolean(selectedFilterQueries[id]) && selectedFilterQueries[id].includes(option.toLowerCase())
        );
    }

    useEffect(() => {
        const paramsObj = saveAllUserOptions(searchParams)
        setSelectedFilterQueries(paramsObj);
    }, [searchParams]);

    return (
        <div className="col-span-2 space-y-6 top-12 h-fit sticky">
            <div className="py-2 mb-8">
                <button className="text-red-500 cursor-pointer font-semibold">
                    Clear Filters
                </button>
            </div>
            {filters.map(({label, name, type, options}) => {
                return (
                    <div key={name} className="border-b pb-4">
                        <p className="font-medium mb-4 capitalize">{label}</p>
                        <div className="space-y-2">
                            {options.map((value) => {
                                return (
                                    <CheckBoxesAndRadioButtons key={value}>
                                        <CheckBoxesAndRadioItem
                                            type={type}
                                            name={name}
                                            label={value}
                                            id={value.toLowerCase().trim()}
                                            // value={value.toLowerCase().trim()}
                                            onChange={selectedFilterOptions}
                                            // checked={isOptionChecked(id, value.toLowerCase())}
                                        />
                                    </CheckBoxesAndRadioButtons>
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

