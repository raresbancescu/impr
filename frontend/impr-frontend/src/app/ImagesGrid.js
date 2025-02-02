import ImageCard from './ImageCard';

const ImagesGrid = ({ images }) => {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 ml-8">
            {images.map((image) => (
                <div key={image.id}>
                    <ImageCard image={image} />
                </div>
            ))}
        </div>
    );
};

export default ImagesGrid;
