import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

function LinkButton({ children, to, ex }) {
    const navigate = useNavigate();

    return (
        <Link
            to={to}
            className={twMerge(
                "text-xl font-extrabold relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:bg-black after:h-1 after:transition-all after:duration-500 after:ease-in-out hover:after:w-full after:rounded-lg cursor-pointer",
                ex
            )}
            onClick={() => navigate(-1)}
        >
            {children}
        </Link>
    );
}

export default LinkButton;
