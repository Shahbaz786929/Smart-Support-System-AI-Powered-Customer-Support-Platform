
import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import ticketAPI from "../services/ticketApi";
import { useNavigate } from "react-router-dom";

function MyTickets() {

    const [tickets, setTickets] = useState([]);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        fetchTickets();

    }, []);

    const fetchTickets = async () => {

        try {

            const email =
                localStorage.getItem("userEmail");

            const response = await ticketAPI.get(

                "/tickets/my",

                {

                    headers: {

                        "X-User-Email": email

                    }

                }

            );

            setTickets(response.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const getPriorityColor = (priority) => {

        switch (priority) {

            case "HIGH":
                return "text-red-500";

            case "MEDIUM":
                return "text-yellow-500";

            case "LOW":
                return "text-green-500";

            default:
                return "text-gray-500";

        }

    };

    const getStatusColor = (status) => {

        switch (status) {

            case "OPEN":
                return "text-blue-500";

            case "CLOSED":
                return "text-green-500";

            default:
                return "text-gray-500";

        }

    };

    return (

        <Layout>

            <div className="px-4 sm:px-6 lg:px-8">

                {/* Heading */}

                <div className="mb-8">

                    <h1 className="
                        text-3xl
                        sm:text-4xl
                        font-bold

                        text-gray-900
                        dark:text-white
                    ">

                        My Tickets 🎫

                    </h1>

                    <p className="
                        mt-2

                        text-gray-500
                        dark:text-gray-400
                    ">

                        View all your submitted tickets

                    </p>

                </div>

                {/* Loading */}

                {

                    loading && (

                        <div className="
                            text-center
                            py-20

                            text-lg
                            font-semibold

                            text-gray-600
                            dark:text-gray-300
                        ">

                            Loading Tickets...

                        </div>

                    )

                }

                {/* Empty State */}

                {

                    !loading && tickets.length === 0 && (

                        <div className="
                            bg-white
                            dark:bg-slate-800

                            border
                            border-gray-200
                            dark:border-slate-700

                            rounded-3xl
                            shadow-lg

                            p-10

                            text-center
                        ">

                            <h2 className="
                                text-2xl
                                font-bold

                                text-gray-800
                                dark:text-white
                            ">

                                No Tickets Found

                            </h2>

                            <p className="
                                mt-3

                                text-gray-500
                                dark:text-gray-400
                            ">

                                You haven't created any tickets yet.

                            </p>

                        </div>

                    )

                }

                {/* Tickets */}

                {

                    !loading && tickets.length > 0 && (

                        <div className="
                            grid
                            grid-cols-1
                            lg:grid-cols-2
                            gap-6
                        ">

                            {

                                tickets.map((ticket) => (

                                    <div
                                        key={ticket.id}

                                        onClick={() =>
                                            navigate(`/ticket/${ticket.id}`)
                                        }

                                        className="
                                            bg-white
                                            dark:bg-slate-800

                                            border
                                            border-gray-200
                                            dark:border-slate-700

                                            rounded-3xl
                                            shadow-lg

                                            p-6

                                            transition-all
                                            duration-300

                                            hover:scale-[1.02]
                                            hover:shadow-2xl

                                            cursor-pointer
                                        "
                                    >

                                        {/* Top */}

                                        <div className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-4
                                        ">

                                            <div>

                                                <h2 className="
                                                    text-xl
                                                    font-bold

                                                    text-gray-900
                                                    dark:text-white
                                                ">

                                                    {ticket.title}

                                                </h2>

                                                <p className="
                                                    mt-2

                                                    text-gray-600
                                                    dark:text-gray-400
                                                ">

                                                    {ticket.description}

                                                </p>

                                            </div>

                                            <span className="
                                                text-sm
                                                font-semibold

                                                text-gray-400
                                            ">

                                                #{ticket.id}

                                            </span>

                                        </div>

                                        {/* Bottom */}

                                        <div className="
                                            mt-6

                                            flex
                                            flex-wrap
                                            gap-4
                                        ">

                                            <div className="
                                                px-4
                                                py-2
                                                rounded-xl

                                                bg-gray-100
                                                dark:bg-slate-700
                                            ">

                                                <span className="
                                                    text-sm
                                                    font-medium

                                                    text-gray-500
                                                    dark:text-gray-300
                                                ">

                                                    Status :

                                                </span>

                                                <span className={`
                                                    ml-2
                                                    font-bold
                                                    ${getStatusColor(ticket.status)}
                                                `}>

                                                    {ticket.status}

                                                </span>

                                            </div>

                                            <div className="
                                                px-4
                                                py-2
                                                rounded-xl

                                                bg-gray-100
                                                dark:bg-slate-700
                                            ">

                                                <span className="
                                                    text-sm
                                                    font-medium

                                                    text-gray-500
                                                    dark:text-gray-300
                                                ">

                                                    Priority :

                                                </span>

                                                <span className={`
                                                    ml-2
                                                    font-bold
                                                    ${getPriorityColor(ticket.priority)}
                                                `}>

                                                    {ticket.priority}

                                                </span>

                                            </div>

                                            <div className="
                                                px-4
                                                py-2
                                                rounded-xl

                                                bg-gray-100
                                                dark:bg-slate-700
                                            ">

                                                <span className="
                                                    text-sm
                                                    font-medium

                                                    text-gray-500
                                                    dark:text-gray-300
                                                ">

                                                    Category :

                                                </span>

                                                <span className="
                                                    ml-2
                                                    font-bold

                                                    text-purple-500
                                                ">

                                                    {ticket.category}

                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

            </div>

        </Layout>

    );

}

export default MyTickets;
