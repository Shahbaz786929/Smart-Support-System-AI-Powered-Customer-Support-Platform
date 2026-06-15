import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout({ children }) {

const [darkMode,setDarkMode]=
useState(false);

return(

<div className={`
    min-h-screen
    ${darkMode
        ? "bg-slate-900 text-white"
        : "bg-gray-100 text-black"
    }
`}>

<Sidebar
darkMode={darkMode}
/>

<Navbar
darkMode={darkMode}
setDarkMode={setDarkMode}
/>

<div className="ml-64 p-8">

{children}

</div>

</div>

)

}

export default Layout;