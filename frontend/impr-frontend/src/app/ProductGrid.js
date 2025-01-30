import {products} from "@/app/imageList";
import Image from "next/image";

const ProductGrid = () => {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 bg-red-200">
            {products.map((product) => (
                <div key={product.id}>
                    <div className="relative">
                        <div className="w-full h-full">
                            <img className="rounded-md shadow-sm aspect-[4/5] w-full h-full" src={product.imageUrl} alt={product.title} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductGrid;