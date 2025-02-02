import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";

const ImageCard = ({ image }) => {
    const [expanded, setExpanded] = useState(false); // Track the expanded state
    const [modalOpen, setModalOpen] = useState(false); // To open/close the modal
    const modalRef = useRef(null); // To reference the modal element

    // Close the modal when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (modalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
                setModalOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [modalOpen]);

    // Handle opening/closing the modal
    const toggleModal = () => setModalOpen(!modalOpen);

    return (
        <div className="bg-red w-full rounded-md shadow-sm">
            <div className="w-full h-[300px]">
                <img
                    className="rounded-md shadow-sm w-full h-full cursor-pointer"
                    src={image.imageUrl}
                    alt={image.title}
                    onClick={toggleModal} // Open modal on image click
                />
            </div>
            <div className="flex flex-row justify-between p-4">
                <p className="text-lg font-semibold">Titlul imaginii</p>
                <button onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </button>
            </div>
            {expanded && (
                <div className="p-4">
                    <div>
                        <span className="font-semibold">Label 1:</span>
                        <p>Label</p>
                    </div>
                    <div>
                        <span className="font-semibold">Label 2:</span>
                        <p>Value</p>
                    </div>
                    <div>
                        <span className="font-semibold">Label 3:</span>
                        <p>More details</p>
                    </div>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div
                        ref={modalRef}
                        className="bg-white p-6 rounded-lg w-1/2 lg:w-1/4"
                    >
                        <div className="relative">
                            <button
                                className="absolute top-2 right-2 text-gray-600"
                                onClick={toggleModal}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>

                            <img
                                className="w-full h-64 object-cover rounded-md mb-4"
                                src={image.imageUrl}
                                alt={image.title}
                            />
                            <div>
                                <p className="text-xl font-semibold">{image.title}</p>
                                <p className="text-sm text-gray-600">General details here...</p>
                                <div className="my-4 border-t border-gray-200"></div>
                                <div>
                                    <div>
                                        <span className="font-semibold">Label 1:</span>
                                        <p>Label</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Label 2:</span>
                                        <p>Value</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold">Label 3:</span>
                                        <p>Additional info</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageCard;
