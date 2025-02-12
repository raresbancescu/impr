import {useState, useEffect, useRef} from 'react';
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/16/solid";

const MovieCard = ({movie}) => {
    const [expanded, setExpanded] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalGeneralDataExpanded, setModalGeneralDataExpanded] = useState(true);
    const [modalPosterDataExpanded, setModalPosterDataExpanded] = useState(true);
    const [modalMetadataExpanded, setModalMetadataExpanded] = useState(true);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
                setModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [modalOpen]);

    const toggleModal = () => setModalOpen(!modalOpen);
    console.log(movie);
    return (
        <div className="bg-red w-full rounded-md shadow-sm">
            <div className="w-full h-[300px]">
                <img
                    className="rounded-md shadow-sm w-full h-full cursor-pointer"
                    src={movie['poster_url']}
                    alt={movie['movie_data']['title']}
                    onClick={toggleModal}
                />
            </div>
            <div className="flex flex-row justify-between p-4 w-full">
                <div className="flex flex-row w-full">
                <p className="text-lg break-words font-semibold w-full">{movie['movie_data']['title']}</p>
                </div>
                <button onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>}
                </button>
            </div>
            {expanded && (
                <div className="p-4">
                    {Object.entries(movie['movie_data']).map(([key, value]) => {
                        const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

                        return (
                            <div key={key} className="flex flex-col justify-between mb-2">
                                <span className="text-lg text-slate-800 font-semibold">{formattedKey}:</span>
                                <p className="text-slate-600 font-semibold">
                                    {Array.isArray(value) ? value.join(", ") : key === "imdb_link" ? (
                                        <a href={value} target="_blank" rel="noopener noreferrer"
                                           className="text-blue-500 underline">
                                            {value}
                                        </a>
                                    ) : (
                                        value
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="relative bg-white rounded-lg lg:w-1/4 overflow-y-auto max-h-[90vh] min-w-[33vw]"
                    >
                        <div className="sticky top-0 flex flex-row justify-between px-4 py-8 bg-white shadow-md">
                            <p className="text-xl text-slate-900 font-semibold">{movie['movie_data']['title']}</p>
                            <button
                                className="text-gray-600"
                                onClick={toggleModal}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-4 flex flex-row items-center justify-center">
                            <img
                                className="w-80 h-80 object-fit rounded-md"
                                src={movie['poster_url']}
                                alt={movie.title}
                            />
                        </div>
                        <div className="flex flex-row justify-between py-4 px-6">
                            <p className="text-lg font-semibold">Movie details</p>
                            <button onClick={() => setModalGeneralDataExpanded(!modalGeneralDataExpanded)}>
                                {modalGeneralDataExpanded ? <ChevronUpIcon className="w-5 h-5"/> :
                                    <ChevronDownIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                        {modalGeneralDataExpanded && <div className="px-6 pb-4">
                            {Object.entries(movie['movie_data']).map(([key, value]) => {
                                const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

                                return (
                                    <div key={key} className="flex flex-col justify-between mb-2">
                                                <span
                                                    className="text-lg text-slate-800 font-semibold">{formattedKey}:</span>
                                        <p className="text-slate-600 font-semibold">
                                            {Array.isArray(value) ? value.join(", ") : key === "imdb_link" ? (
                                                <a href={value} target="_blank" rel="noopener noreferrer"
                                                   className="text-blue-500 underline">
                                                    {value}
                                                </a>
                                            ) : (
                                                value
                                            )}
                                        </p>
                                    </div>
                                );
                            })}
                            <hr className="border-gray-300 my-4"/>
                        </div>}
                        <div className="flex flex-row justify-between pb-4 px-6">
                            <p className="text-lg font-semibold">Data about poster</p>
                            <button onClick={() => setModalPosterDataExpanded(!modalPosterDataExpanded)}>
                                {modalPosterDataExpanded ? <ChevronUpIcon className="w-5 h-5"/> :
                                    <ChevronDownIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                        {modalPosterDataExpanded && <div className="px-6 pb-4">
                            {Object.entries(movie).map(([key, value]) => {
                                if (key === "metadata" || key === "movie_data") return null;

                                const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

                                return (
                                    <div key={key} className="flex flex-col justify-between mb-4 max-w-full overflow-hidden">
                                        <span className="text-lg text-slate-800 break-words font-semibold">{formattedKey}:</span>
                                        {key === "poster_url" ?
                                            (<a href={value} target="_blank" rel="noopener noreferrer"
                                               className="text-blue-500 underline break-words">
                                                {value}
                                            </a>)
                                        :(
                                            <p className="text-slate-600 w-full break-words font-semibold">
                                                {Array.isArray(value) ? value.join(", ") : value}
                                            </p>
                                    )}
                                    </div>
                                );
                            })}

                            <hr className="border-gray-300 my-4"/>
                        </div>}
                        <div className="flex flex-row justify-between pb-4 px-6">
                            <p className="text-lg font-semibold">Metadata</p>
                            <button onClick={() => setModalMetadataExpanded(!modalMetadataExpanded)}>
                                {modalMetadataExpanded ? <ChevronUpIcon className="w-5 h-5"/> :
                                    <ChevronDownIcon className="w-5 h-5"/>}
                            </button>
                        </div>
                        {modalMetadataExpanded && <div className="px-6 pb-4">
                            {Object.entries(movie.metadata).map(([key, value]) => {
                                const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
                                return (
                                    <div key={key} className="flex flex-col mb-2">
                                        <span className="text-lg text-slate-800 font-semibold">{formattedKey}:</span>
                                        <p className="text-slate-600 font-semibold">{value}</p>
                                    </div>
                                );
                            })}
                        </div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieCard;
