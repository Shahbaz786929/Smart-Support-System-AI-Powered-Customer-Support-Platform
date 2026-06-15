import { useEffect, useState } from "react";

import Layout from "../components/Layout";
import TicketCard from "../components/TicketCard";

import ticketAPI from "../services/ticketApi";

function Dashboard() {

    const [stats, setStats] = useState({

        totalTickets: 0,
        openTickets: 0,
        closedTickets: 0

    });

    const [latestTickets, setLatestTickets] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchDashboardData();

    }, []);

    const fetchDashboardData = async () => {

        try {

            const statsResponse =
                await ticketAPI.get("/tickets/stats");

            const latestResponse =
                await ticketAPI.get("/tickets/latest");

            setStats(statsResponse.data);

            setLatestTickets(
                latestResponse.data.slice(0, 5)
            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const assignTicket = async (ticketId) => {

        try {

            const email =
                localStorage.getItem("userEmail");

            await ticketAPI.put(

                `/tickets/assign/${ticketId}?agentEmail=${email}`

            );

            alert(
                "Ticket Assigned Successfully 🚀"
            );

            fetchDashboardData();

        }

        catch (error) {

            console.log(error);

            alert(
                "Failed To Assign Ticket"
            );

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

            {/* Heading */}

            <div className="mb-8">

                <h1 className="
                    text-3xl
                    sm:text-4xl
                    font-bold

                    text-gray-900
                    dark:text-white
                ">

                    Dashboard 🚀

                </h1>

                <p className="
                    mt-2

                    text-gray-500
                    dark:text-gray-400
                ">

                    Monitor your ticket system activity

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

                        Loading Dashboard...

                    </div>

                )

            }

            {/* Dashboard Content */}

            {

                !loading && (

                    <>

                        {/* Cards */}

                        <div className="
                            grid
                            grid-cols-1
                            sm:grid-cols-2
                            xl:grid-cols-4
                            gap-6
                        ">

                            <TicketCard
                                title="Total Tickets"
                                count={stats.totalTickets}
                                color="text-black dark:text-white"
                            />

                            <TicketCard
                                title="Open Tickets"
                                count={stats.openTickets}
                                color="text-blue-600"
                            />

                            <TicketCard
                                title="Closed Tickets"
                                count={stats.closedTickets}
                                color="text-green-600"
                            />

                            <TicketCard
                                title="High Priority"
                                count={
                                    latestTickets.filter(
                                        (ticket) =>
                                            ticket.priority === "HIGH"
                                    ).length
                                }
                                color="text-red-500"
                            />

                        </div>

                        {/* Recent Tickets */}

                        <div className="
                            mt-8

                            bg-white
                            dark:bg-slate-800

                            border
                            border-gray-200
                            dark:border-slate-700

                            rounded-3xl
                            shadow-lg

                            p-6

                            overflow-x-auto
                        ">

                            <div className="
                                flex
                                items-center
                                justify-between
                                mb-6
                            ">

                                <h2 className="
                                    text-2xl
                                    font-bold

                                    text-gray-900
                                    dark:text-white
                                ">

                                    Recent Tickets

                                </h2>

                            </div>

                            <table className="w-full min-w-[850px]">

                                <thead>

                                    <tr className="
                                        border-b
                                        border-gray-200
                                        dark:border-slate-700
                                    ">

                                        <th className="
                                            text-left
                                            p-4

                                            text-gray-600
                                            dark:text-gray-300
                                        ">

                                            Ticket ID

                                        </th>

                                        <th className="
                                            text-left
                                            p-4

                                            text-gray-600
                                            dark:text-gray-300
                                        ">

                                            Title

                                        </th>

                                        <th className="
                                            text-left
                                            p-4

                                            text-gray-600
                                            dark:text-gray-300
                                        ">

                                            Status

                                        </th>

                                        <th className="
                                            text-left
                                            p-4

                                            text-gray-600
                                            dark:text-gray-300
                                        ">

                                            Priority

                                        </th>

                                        <th className="
                                            text-left
                                            p-4

                                            text-gray-600
                                            dark:text-gray-300
                                        ">

                                            Action

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        latestTickets.map((ticket) => (

                                            <tr
                                                key={ticket.id}

                                                className="
                                                    border-b
                                                    border-gray-100
                                                    dark:border-slate-700

                                                    hover:bg-gray-50
                                                    dark:hover:bg-slate-700

                                                    transition-all
                                                "
                                            >

                                                <td className="
                                                    p-4

                                                    font-medium

                                                    text-gray-800
                                                    dark:text-white
                                                ">

                                                    #{ticket.id}

                                                </td>

                                                <td className="
                                                    p-4

                                                    text-gray-700
                                                    dark:text-gray-300
                                                ">

                                                    {ticket.title}

                                                </td>

                                                <td className={`
                                                    p-4
                                                    font-semibold

                                                    ${getStatusColor(ticket.status)}
                                                `}>

                                                    {ticket.status}

                                                </td>

                                                <td className={`
                                                    p-4
                                                    font-semibold

                                                    ${getPriorityColor(ticket.priority)}
                                                `}>

                                                    {ticket.priority}

                                                </td>

                                                <td className="p-4">

                                                    <button

                                                        onClick={() =>
                                                            assignTicket(ticket.id)
                                                        }

                                                        className="
                                                            px-4
                                                            py-2

                                                            rounded-xl

                                                            bg-blue-600
                                                            hover:bg-blue-700

                                                            text-white
                                                            text-sm
                                                            font-semibold

                                                            transition-all
                                                        "
                                                    >

                                                        Assign To Me

                                                    </button>

                                                </td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                        </div>

                    </>

                )

            }

        </Layout>

    );

}

export default Dashboard;