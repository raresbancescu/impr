import Navbar from "@/app/Navbar";
import Filters from "@/app/Filters";
import ProductGrid from "@/app/ProductGrid";

export default function Home() {
  return (
   <main className="max-w-7xl mx-auto mt-10 px-4">
       <Navbar />
       <div className="w-full flex flex-col md:flex-row">
           <div className="w-full md:w-[25%] p-2">
               <Filters />
           </div>
           <div className="w-full md:w-[75%] p-2">
                <ProductGrid />
           </div>
       </div>
   </main>
  );
}
