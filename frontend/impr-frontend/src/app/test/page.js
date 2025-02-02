const TestPage = () => {

    return (
        <div>
            <div id="dropdownSearch" className="z-10 rounded-lg shadow-sm w-60 bg-slate-50">
                <div className="p-3">
                    <label htmlFor="input-group-search" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 " aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" id="input-group-search"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
                               placeholder="Search user"/>
                    </div>
                </div>
                <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 "
                    aria-labelledby="dropdownSearchButton">
                    <li>
                        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 ">
                            <input id="checkbox-item-11" type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 "/>
                            <label htmlFor="checkbox-item-11"
                                   className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm ">Bonnie
                                Green</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 ">
                            <input checked id="checkbox-item-12" type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 "/>
                            <label htmlFor="checkbox-item-12"
                                   className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm ">Jese
                                Leos</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 ">
                            <input id="checkbox-item-13" type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 "/>
                            <label htmlFor="checkbox-item-13"
                                   className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm">Michael
                                Gough</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100">
                            <input id="checkbox-item-14" type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"/>
                            <label htmlFor="checkbox-item-14"
                                   className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm">Robert
                                Wall</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 ">
                            <input id="checkbox-item-15" type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"/>
                            <label htmlFor="checkbox-item-15"
                                   className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm ">Joseph
                                Mcfall</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 ">
                            <input id="checkbox-item-15" type="checkbox" value=""
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"/>
                            <label htmlFor="checkbox-item-15"
                                   className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm ">Joseph
                                Mcfall</label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default TestPage;