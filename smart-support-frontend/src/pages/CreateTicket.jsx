import { useState } from "react";

import Layout from "../components/Layout";

import ticketAPI from "../services/ticketApi";

function CreateTicket() {

    const [formData, setFormData] = useState({

        title: "",
        description: ""

    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const email =
                localStorage.getItem("userEmail");

            const response = await ticketAPI.post(

                "/tickets/create",

                formData,

                {

                    headers: {

                        "X-User-Email": email

                    }

                }

            );

            alert(response.data);

            setFormData({

                title: "",
                description: ""

            });

        }

        catch (error) {

            console.log(error);

            alert("Failed To Create Ticket");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <Layout>

            <div className="
                w-full
                flex
                justify-center
                px-4
                sm:px-6
                lg:px-8
            ">

                <div className="
                    w-full
                    max-w-4xl

                    bg-white
                    dark:bg-slate-800

                    border
                    border-gray-200
                    dark:border-slate-700

                    rounded-3xl
                    shadow-xl

                    p-6
                    sm:p-8
                    lg:p-10

                    transition-all
                    duration-300
                ">

                    {/* Heading */}

                    <div className="mb-8">

                        <h1 className="
                            text-3xl
                            sm:text-4xl
                            font-bold

                            text-gray-900
                            dark:text-white
                        ">

                            Create Ticket 🎫

                        </h1>

                        <p className="
                            mt-2
                            text-sm
                            sm:text-base

                            text-gray-500
                            dark:text-gray-400
                        ">

                            Submit your issue and our AI
                            system will analyze it automatically.

                        </p>

                    </div>

                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* Title */}

                        <div>

                            <label className="
                                block
                                mb-2
                                font-semibold

                                text-gray-700
                                dark:text-gray-300
                            ">

                                Ticket Title

                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter ticket title"
                                required

                                className="
                                    w-full

                                    px-5
                                    py-4

                                    rounded-2xl

                                    border
                                    border-gray-300
                                    dark:border-slate-600

                                    bg-gray-50
                                    dark:bg-slate-700

                                    text-gray-900
                                    dark:text-white

                                    placeholder-gray-400

                                    outline-none

                                    focus:ring-2
                                    focus:ring-blue-500

                                    transition-all
                                "
                            />

                        </div>

                        {/* Description */}

                        <div>

                            <label className="
                                block
                                mb-2
                                font-semibold

                                text-gray-700
                                dark:text-gray-300
                            ">

                                Description

                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your issue..."
                                rows="8"
                                required

                                className="
                                    w-full

                                    px-5
                                    py-4

                                    rounded-2xl

                                    border
                                    border-gray-300
                                    dark:border-slate-600

                                    bg-gray-50
                                    dark:bg-slate-700

                                    text-gray-900
                                    dark:text-white

                                    placeholder-gray-400

                                    outline-none
                                    resize-none

                                    focus:ring-2
                                    focus:ring-blue-500

                                    transition-all
                                "
                            />

                        </div>

                        {/* Button */}

                        <button
                            type="submit"
                            disabled={loading}

                            className="
                                w-full

                                py-4

                                rounded-2xl

                                bg-blue-600
                                hover:bg-blue-700

                                text-white
                                font-semibold
                                text-lg

                                transition-all
                                duration-300

                                disabled:opacity-50
                            "
                        >

                            {

                                loading
                                ? "Creating Ticket..."
                                : "Create Ticket"

                            }

                        </button>

                    </form>

                </div>

            </div>

        </Layout>

    );

}

export default CreateTicket;