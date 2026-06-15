import { Link, useLocation } from "react-router-dom";

function Sidebar({ darkMode }) {

  const location = useLocation();

  const menu = [

    {
      name: "Dashboard",
      icon: "📊",
      path: "/dashboard"
    },

    {
      name: "Create Ticket",
      icon: "🎫",
      path: "/create-ticket"
    },

    {
      name: "My Tickets",
      icon: "📁",
      path: "/my-tickets"
    },

    {
      name: "Assigned Tickets",
      icon: "👨‍💻",
      path: "/assigned-tickets"
    },

    {
      name: "Analytics",
      icon: "📈",
      path: "/analytics"
    },

    {
      name: "Settings",
      icon: "⚙️",
      path: "/settings"
    }

  ];

  return (

    <div
      className={`
      fixed left-0 top-0
      w-64 h-screen
      border-r flex flex-col
      ${
        darkMode
        ? "bg-slate-800 border-slate-700 text-white"
        : "bg-white border-gray-200"
      }
    `}
    >

      {/* Logo Section */}

      <div
        className={`
        h-24
        px-6
        flex items-center gap-4
        border-b
        ${
          darkMode
          ? "border-slate-700"
          : "border-gray-200"
        }
      `}
      >

        <div
          className="
          w-12 h-12
          rounded-xl
          bg-blue-600
          text-white
          flex items-center justify-center
          text-xl
          shadow-lg
        "
        >

          🚀

        </div>

        <div>

          <h1 className="text-xl font-bold">

            Smart Support

          </h1>

          <p className="text-xs text-gray-400">

            AI Ticket Management

          </p>

        </div>

      </div>


      {/* Menu */}

      <div className="flex-1 p-5 space-y-3 overflow-y-auto">

        {

          menu.map((item) => (

            <Link
              key={item.name}
              to={item.path}

              className={`
              flex items-center
              gap-4
              px-5 py-4
              rounded-2xl
              transition-all duration-300

              ${
                location.pathname === item.path
                ? "bg-blue-600 text-white shadow-lg"
                : darkMode
                ? "hover:bg-slate-700"
                : "hover:bg-gray-100"
              }
            `}
            >

              <span className="text-lg">

                {item.icon}

              </span>

              <span className="font-medium">

                {item.name}

              </span>

            </Link>

          ))

        }

      </div>

    </div>

  );

}

export default Sidebar;