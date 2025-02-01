import Image from "next/image";

const ImagesGrid = ({images}) => {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {images.map((image) => (
                <div key={image.id}>
                    <div className="relative">
                        <div className="w-full h-full">
                            <img className="rounded-md shadow-sm aspect-[4/5] w-full h-full" src={image.imageUrl} alt={image.title} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ImagesGrid;