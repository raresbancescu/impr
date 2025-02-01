import {useEffect, useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/16/solid";

const CheckBoxesAndRadioItem = ({id, label, ...props}) => {
    return (
        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100">
            <input
                id={id}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                {...props}
            />
            <label htmlFor={id} className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm ">
                {label}
            </label>
        </div>
    );
};

const renderFilters = (filter, handleCheckboxAndRadioFilterChange, handleRangeFilterChange, searchValue) => {
    if (filter.type === 'checkbox' || filter.type === 'radio') {
        let options = filter.options;

        if (filter["searchable"] === true) {
            options = options.filter((option) => option.selected === false);
        }
        if (searchValue !== "") {
            options = options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
        }
        return options.map((option) => (
            <CheckBoxesAndRadioItem
                key={option.value}
                type={filter.type}
                name={filter.name}
                label={option.label}
                id={option.value.toLowerCase().trim()}
                value={option.value}
                onChange={() => handleCheckboxAndRadioFilterChange(filter.name, option.value, filter.type)}
                checked={option.selected}
                className="col-span-1"
            />
        ));
    }

    if (filter.type === "range") {
        return (
            <div className="col-span-2 grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor={`${filter.name}_min`} className="block mb-2 text-sm font-medium text-gray-900">
                        {filter['min_label']}
                    </label>
                    <input
                        placeholder={filter['min_recommended_value']}
                        onChange={(e) => handleRangeFilterChange(filter.name, e.target.value, 0)}
                        type="number"
                        id={`${filter.name}_min`}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
                <div>
                    <label htmlFor={`${filter.name}_max`} className="block mb-2 text-sm font-medium text-gray-900">
                        {filter['max_label']}
                    </label>
                    <input
                        placeholder={filter['max_recommended_value']}
                        onChange={(e) => handleRangeFilterChange(filter.name, e.target.value, 1)}
                        type="number"
                        id={`${filter.name}_max`}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
                </div>
            </div>
        );
    }
};

const FilterItem = ({filter, handleCheckboxAndRadioFilterChange, handleRangeFilterChange}) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchValue, setSearchValue] = useState("");

        useEffect(() => {
            renderFilters(filter, handleCheckboxAndRadioFilterChange, handleRangeFilterChange, searchValue);
            console.log("here");
        }, [searchValue]);

        return (
            <div key={filter.name} className="border-b pb-4">
                <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center mb-4">
                    <p className="font-medium capitalize">{filter.label}</p>
                    <button
                        className="text-gray-600 hover:text-black transition"
                    >
                        {isOpen ? (
                            <ChevronUpIcon className="w-5 h-5"/>
                        ) : (
                            <ChevronDownIcon className="w-5 h-5"/>
                        )}
                    </button>
                </div>

                {isOpen ?
                    filter["searchable"] ?
                        <div className="flex flex-col">
                            <div className="flex flex-wrap gap-2 mb-2">

                                {
                                    filter.options.filter((option) => option.selected === true).map((option) => (
                                        <div key={option.value}
                                             className="flex items-center bg-gray-100 text-gray-900 px-3 py-1 rounded-lg">
                                            <p key={option.value} className="mr-2">{option.label}</p>
                                            <button
                                                onClick={() => handleCheckboxAndRadioFilterChange(filter.name, option.value, filter.type)}
                                                className="text-red-500">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M6 18L18 6M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="flex flex-col bg-slate-50">
                                <div className="self-start">
                                    <div className="flex items-center p-3">
                                        <div className="relative w-full">
                                            <div
                                                className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true"
                                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                          strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                </svg>
                                            </div>
                                            <input type="text" id="input-group-search"
                                                   onChange={(e) => setSearchValue(e.target.value)}
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                                                   placeholder={`Search ${filter.label}...`}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-3">
                                    <div className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700">
                                        {renderFilters(filter, handleCheckboxAndRadioFilterChange, handleRangeFilterChange, searchValue)}
                                    </div>
                                </div>
                            </div>
                        </div> : renderFilters(filter, handleCheckboxAndRadioFilterChange, handleRangeFilterChange, searchValue)

                    :
                    <> </>
                }
            </div>
        )
            ;
    }
;

export default FilterItem;
