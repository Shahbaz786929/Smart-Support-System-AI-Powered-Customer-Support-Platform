import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import Layout from "../components/Layout";

import ticketAPI from "../services/ticketApi";

function TicketDetails() {

    const { id } = useParams();

    const [ticket, setTicket] = useState(null);

    const [loading, setLoading] = useState(true);

    // Comments

    const [comments, setComments] = useState([]);

    const [message, setMessage] = useState("");

    const [commentLoading, setCommentLoading] = useState(false);

    // Attachments

    const [attachments, setAttachments] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {

        fetchTicket();

        fetchComments();

        fetchAttachments();

    }, []);

    // Fetch Ticket

    const fetchTicket = async () => {

        try {

            const response =
                await ticketAPI.get(`/tickets/${id}`);

            console.log(response.data);

            setTicket(response.data);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    // Fetch Comments

    const fetchComments = async () => {

        try {

            const response =
                await ticketAPI.get(`/comments/${id}`);

            setComments(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    // Add Comment

    const addComment = async () => {

        if (!message.trim()) {

            return;

        }

        try {

            setCommentLoading(true);

            const userEmail =
                localStorage.getItem("userEmail");

            await ticketAPI.post(

                `/comments/${id}`,

                {

                    message,
                    userEmail

                }

            );

            setMessage("");

            fetchComments();

        }

        catch (error) {

            console.log(error);

            alert("Failed To Add Comment");

        }

        finally {

            setCommentLoading(false);

        }

    };

    // Fetch Attachments

    const fetchAttachments = async () => {

        try {

            const response =
                await ticketAPI.get(
                    `/attachments/${id}`
                );

            setAttachments(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    // Upload Attachment

    const uploadAttachment = async () => {

        if (!selectedFile) {

            return;

        }

        try {

            setUploadLoading(true);

            const formData = new FormData();

            formData.append(
                "file",
                selectedFile
            );

            await ticketAPI.post(

                `/attachments/${id}`,

                formData,

                {

                    headers: {

                        "Content-Type":
                            "multipart/form-data"

                    }

                }

            );

            setSelectedFile(null);

            fetchAttachments();

            alert("File Uploaded Successfully");

        }

        catch (error) {

            console.log(error);

            alert("Failed To Upload File");

        }

        finally {

            setUploadLoading(false);

        }

    };

    if (loading) {

        return (

            <Layout>

                <div className="text-white">

                    Loading...

                </div>

            </Layout>

        );

    }

    return (

        <Layout>

            <div className="
                max-w-5xl
                mx-auto
                p-6
            ">

                <div className="
                    bg-slate-800
                    rounded-3xl
                    p-8
                    shadow-xl
                    border
                    border-slate-700
                ">

                    {/* Title */}

                    <h1 className="
                        text-3xl
                        font-bold
                        text-white
                    ">

                        {ticket?.title}

                    </h1>

                    {/* Status Section */}

                    <div className="
                        flex
                        gap-4
                        mt-6
                        flex-wrap
                    ">

                        <span className="
                            px-4
                            py-2
                            rounded-xl
                            bg-blue-500/20
                            text-blue-400
                            font-semibold
                        ">

                            {ticket?.status}

                        </span>

                        <span className="
                            px-4
                            py-2
                            rounded-xl
                            bg-red-500/20
                            text-red-400
                            font-semibold
                        ">

                            {ticket?.priority}

                        </span>

                        <span className="
                            px-4
                            py-2
                            rounded-xl
                            bg-green-500/20
                            text-green-400
                            font-semibold
                        ">

                            {ticket?.category}

                        </span>

                    </div>

                    {/* Description */}

                    <div className="mt-8">

                        <h2 className="
                            text-xl
                            font-semibold
                            text-white
                            mb-3
                        ">

                            Description

                        </h2>

                        <p className="
                            text-gray-300
                            leading-relaxed
                        ">

                            {ticket?.description}

                        </p>

                    </div>

                    {/* AI Summary */}

                    <div className="
                        mt-8
                        bg-slate-900
                        border
                        border-slate-700
                        rounded-2xl
                        p-6
                    ">

                        <h2 className="
                            text-xl
                            font-semibold
                            text-white
                            mb-3
                        ">

                            🤖 AI Summary

                        </h2>

                        <p className="
                            text-gray-300
                            leading-relaxed
                        ">

                            {ticket?.summary}

                        </p>

                    </div>

                    {/* Extra Details */}

                    <div className="
                        mt-8
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-6
                    ">

                        <div>

                            <h3 className="
                                text-gray-400
                                mb-2
                            ">

                                Assigned To

                            </h3>

                            <p className="text-white">

                                {

                                    ticket?.assignedTo
                                        ? ticket.assignedTo
                                        : "Not Assigned"

                                }

                            </p>

                        </div>

                        <div>

                            <h3 className="
                                text-gray-400
                                mb-2
                            ">

                                Created At

                            </h3>

                            <p className="text-white">

                                {ticket?.createdAt}

                            </p>

                        </div>

                    </div>

                    {/* ATTACHMENTS */}

                    <div className="mt-12">

                        <h2 className="
                            text-2xl
                            font-bold
                            text-white
                            mb-6
                        ">

                            📎 Attachments

                        </h2>

                        {/* Upload Box */}

                        <div className="
                            bg-slate-900
                            border
                            border-slate-700
                            rounded-2xl
                            p-5
                        ">

                            <input

                                type="file"

                                onChange={(e) =>
                                    setSelectedFile(
                                        e.target.files[0]
                                    )
                                }

                                className="
                                    text-white
                                    mb-4
                                "
                            />

                            <br />

                            <button

                                onClick={uploadAttachment}

                                disabled={uploadLoading}

                                className="
                                    bg-green-600
                                    hover:bg-green-700

                                    px-6
                                    py-3

                                    rounded-xl

                                    text-white
                                    font-semibold
                                "
                            >

                                {

                                    uploadLoading
                                        ? "Uploading..."
                                        : "Upload File"

                                }

                            </button>

                        </div>

                        {/* Attachment List */}

                        <div className="
                            mt-8
                            space-y-4
                        ">

                            {

                                attachments.length === 0 ? (

                                    <div className="
                                        text-gray-400
                                    ">

                                        No Attachments Yet

                                    </div>

                                ) : (

                                    attachments.map((file) => (

                                        <div

                                            key={file.id}

                                            className="
                                                bg-slate-900
                                                border
                                                border-slate-700

                                                rounded-2xl

                                                p-5

                                                flex
                                                justify-between
                                                items-center
                                            "
                                        >

                                            <div>

                                                <h3 className="
                                                    text-white
                                                    font-semibold
                                                ">

                                                    {file.fileName}

                                                </h3>

                                            </div>

                                            <a

                                                href={`http://localhost:8082${file.filePath}`}

                                                target="_blank"

                                                rel="noreferrer"

                                                className="
                                               bg-blue-600
                                               hover:bg-blue-700

                                                px-5
                                                py-2

                                                 rounded-xl

                                                   text-white
                                                  "
                                            >

                                                View

                                            </a>

                                        </div>

                                    ))

                                )

                            }

                        </div>

                    </div>

                    {/* COMMENTS SECTION */}

                    <div className="mt-12">

                        <h2 className="
                            text-2xl
                            font-bold
                            text-white
                            mb-6
                        ">

                            💬 Comments

                        </h2>

                        {/* Add Comment */}

                        <div className="
                            bg-slate-900
                            border
                            border-slate-700
                            rounded-2xl
                            p-5
                        ">

                            <textarea

                                value={message}

                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }

                                placeholder="Write your comment..."

                                rows="4"

                                className="
                                    w-full

                                    bg-slate-800
                                    border
                                    border-slate-700

                                    rounded-2xl

                                    p-4

                                    text-white

                                    outline-none

                                    resize-none
                                "
                            />

                            <button

                                onClick={addComment}

                                disabled={commentLoading}

                                className="
                                    mt-4

                                    bg-blue-600
                                    hover:bg-blue-700

                                    px-6
                                    py-3

                                    rounded-xl

                                    text-white
                                    font-semibold

                                    transition-all
                                "
                            >

                                {

                                    commentLoading
                                        ? "Adding..."
                                        : "Add Comment"

                                }

                            </button>

                        </div>

                        {/* Comment List */}

                        <div className="
                            mt-8
                            space-y-4
                        ">

                            {

                                comments.length === 0 ? (

                                    <div className="
                                        text-gray-400
                                    ">

                                        No Comments Yet

                                    </div>

                                ) : (

                                    comments.map((comment) => (

                                        <div

                                            key={comment.id}

                                            className="
                                                bg-slate-900
                                                border
                                                border-slate-700

                                                rounded-2xl

                                                p-5
                                            "
                                        >

                                            <div className="
                                                flex
                                                justify-between
                                                items-center
                                                mb-3
                                            ">

                                                <h3 className="
                                                    text-blue-400
                                                    font-semibold
                                                ">

                                                    {comment.userEmail}

                                                </h3>

                                            </div>

                                            <p className="
                                                text-gray-300
                                                leading-relaxed
                                            ">

                                                {comment.message}

                                            </p>

                                        </div>

                                    ))

                                )

                            }

                        </div>

                    </div>

                </div>

            </div>

        </Layout>

    );

}

export default TicketDetails;