function Navbar({ darkMode, setDarkMode }) {

    return (

        <div className={`
        h-24
        ml-64
        px-8
        flex items-center justify-between
        border-b
        sticky top-0 z-40
        ${
            darkMode
            ? "bg-slate-800 text-white border-slate-700"
            : "bg-white border-gray-200"
        }`}>

            {/* Search */}

            <div className="flex-1 flex justify-center">

                <input
                    placeholder="Search tickets..."
                    className={`
                    w-[400px]
                    px-5 py-3
                    rounded-2xl
                    outline-none
                    ${
                        darkMode
                        ? "bg-slate-700"
                        : "bg-gray-100"
                    }`}
                />

            </div>


            {/* Right */}

<div className="flex items-center gap-5">

    {/* Notifications */}

    <button className={`
    flex items-center gap-2
    px-4 py-2 rounded-xl
    transition
    ${
        darkMode
        ? "hover:bg-slate-700"
        : "hover:bg-gray-100"
    }`}>

        <span>🔔</span>

        <span className="font-medium">

            Notifications

        </span>

    </button>


    {/* Theme */}

    <button
        onClick={() =>
            setDarkMode(!darkMode)
        }

        className={`
        flex items-center gap-2
        px-4 py-2 rounded-xl
        transition
        ${
            darkMode
            ? "hover:bg-slate-700"
            : "hover:bg-gray-100"
        }`}
    >

        <span>

            {darkMode ? "☀️" : "🌙"}

        </span>

        <span className="font-medium">

            {darkMode
                ? "Light Mode"
                : "Dark Mode"
            }

        </span>

    </button>


    {/* Profile */}

    <div className="flex items-center gap-3">

        <div className="
        w-12 h-12
        rounded-full
        bg-blue-600
        text-white
        flex justify-center items-center">

            MS

        </div>

        <div>

            <p className="font-semibold">

                Mohammad Shahbaz

            </p>

            <p className="text-xs text-gray-400">

                Admin

            </p>

        </div>

    </div>


    {/* Logout */}

    <button
        className="
        bg-red-500
        text-white
        px-5 py-2
        rounded-xl
        hover:bg-red-600">

        Logout

    </button>

</div>

        </div>

    );

}

export default Navbar;