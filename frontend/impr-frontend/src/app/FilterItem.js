import {useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/16/solid";

const FilterItem = ({filter, renderFilters}) => {
    const [isOpen, setIsOpen] = useState(false);

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

            {isOpen && <div className="grid grid-cols-2 gap-4">{renderFilters(filter)}</div>}
        </div>
    );
};

export default FilterItem;
