const Navbar = () => {
    return (
      <header className="flex flex-col md:flex-row justify-around items-center gap-8 py-5 mb-5">
          <div className="w-full md:w-[20%]">
            <h1 className="text-5-xl font-semibold text-slate-500">Smart image processor</h1>
          </div>
          <div className="w-full md:w-[80%]">
              <p className="text-lg text-slate-500">Welcome to the smart image processor. Upload an image and we will process it for you.</p>

          </div>
      </header>
    );
}

export default Navbar;