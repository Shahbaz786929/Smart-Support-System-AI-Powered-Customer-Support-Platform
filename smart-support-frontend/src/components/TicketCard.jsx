function TicketCard({

    title,
    count,
    color

}) {

    return (

        <div className="
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
        ">

            {/* Title */}

            <h2 className="
                text-sm
                sm:text-base
                font-medium

                text-gray-500
                dark:text-gray-400
            ">

                {title}

            </h2>

            {/* Count */}

            <h1
                className={`
                    text-3xl
                    sm:text-4xl
                    font-bold
                    mt-4

                    ${color}
                `}
            >

                {count}

            </h1>

        </div>

    );

}

export default TicketCard;