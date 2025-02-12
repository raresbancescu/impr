import {useEffect, useState} from "react";

const Navbar = ({updateQueryParams, onFilterSubmit}) => {
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        updateQueryParams({}, searchValue)
    }, [searchValue]);

    return (
        <header className="flex flex-col md:flex-row justify-around items-center gap-8 py-5 mb-5">
            <div className="flex flex-col w-full md:w-[20%] items-center justify-center">
                <h1 className="text-xl font-semibold text-slate-900">Smart image processor</h1>
                <img src="https://cdn-icons-png.flaticon.com/512/9539/9539868.png" alt="logo" className="w-20 h-20 rounded-full mt-4"/>
            </div>
            <div className="w-full md:w-[80%]">
                <div className="max-w-lg mx-auto">
                    <label htmlFor="default-search"
                           className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>

                        </div>
                        <input type="search" id="default-search"
                               onChange={(e) => setSearchValue(e.target.value)}
                               className="block w-full ps-10 p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                               placeholder="Search..."/>
                        <button
                            onClick={() => {
                                if(searchValue.trim() === '') {
                                    return
                                }
                                onFilterSubmit()
                            }}
                            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;