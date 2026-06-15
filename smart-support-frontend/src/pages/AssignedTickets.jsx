
import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import ticketAPI from "../services/ticketApi";

import { useNavigate } from "react-router-dom";

function AssignedTickets() {

    const [tickets, setTickets] = useState([]);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        fetchAssignedTickets();

    }, []);

    const fetchAssignedTickets = async () => {

        try {

            const email =
                localStorage.getItem("userEmail");

            const response =
                await ticketAPI.get(

                    `/tickets/assigned?agentEmail=${email}`

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

                        Assigned Tickets 👨‍💻

                    </h1>

                    <p className="
                        mt-2

                        text-gray-500
                        dark:text-gray-400
                    ">

                        Tickets assigned to you

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

                    !loading &&
                    tickets.length === 0 && (

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

                                No Assigned Tickets

                            </h2>

                            <p className="
                                mt-3

                                text-gray-500
                                dark:text-gray-400
                            ">

                                No tickets are assigned to you yet.

                            </p>

                        </div>

                    )

                }

                {/* Tickets */}

                {

                    !loading &&
                    tickets.length > 0 && (

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

                                        <div className="
                                            flex
                                            justify-between
                                            items-start
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
                                                text-gray-400
                                            ">

                                                #{ticket.id}

                                            </span>

                                        </div>

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
                                                    text-gray-500
                                                    dark:text-gray-300
                                                ">

                                                    Status :

                                                </span>

                                                <span className="
                                                    ml-2
                                                    font-bold
                                                    text-blue-500
                                                ">

                                                    {ticket.status}

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

export default AssignedTickets;
