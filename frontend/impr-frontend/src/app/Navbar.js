import {useState} from "react";

const Navbar = ({generalSearchFetch}) => {
    const [searchValue, setSearchValue] = useState('');

    return (
        <header className="flex flex-col md:flex-row justify-around items-center gap-8 py-5 mb-5">
            <div className="w-full md:w-[20%]">
                <h1 className="text-5-xl font-semibold text-slate-500">Smart image processor</h1>
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
                                generalSearchFetch(searchValue)
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