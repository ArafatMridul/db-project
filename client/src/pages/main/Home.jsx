import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useUser } from "../../context/userContex";

const Home = () => {
    const { currentUser } = useUser();
    return (
        <div className="h-screen bg-bl">
            <Navbar transparent={true} />
            <div className="fixed inset-0 z-10 grid grid-cols-[70%_30%] h-full">
                <div className="relative col-start-1 row-span-2"></div>
                <div className="relative bg-yellow-400 col-start-2 row-span-2">
                    <div className="flex items-center justify-center bg-bl -left-70 top-1/2 -translate-y-1/2 absolute w-[510px] h-[510px] rounded-full">
                        <img
                            src="/assets/hero.png"
                            alt=""
                            className="w-[500px] absolute -top-2"
                        />
                    </div>
                </div>
            </div>
            <div className="container pt-60 relative z-30">
                <h1 className="text-[8rem] font-cb text-white">
                    Pizza Ristorante
                </h1>
                <p className="text-4xl text-white w-[25ch] leading-snug mb-10">
                    Get the best{" "}
                    <span className="text-yellow-400 font-bold relative after:absolute after:left-0 after:-bottom-0 after:w-full after:bg-yellow-400 after:h-1 after:rounded-lg cursor-pointer hover:after:-bottom-1 after:transition-all after:duration-300 after:ease-in-out">
                        Pizza
                    </span>{" "}
                    available in da town now.
                </p>

                <Link
                    className="font-bold text-xl bg-yellow-400 px-6 py-3 rounded-md cursor-pointer hover:bg-yellow-300 transition-colors duration-300 ease-in-out w-fit text-slate-900"
                    to={currentUser ? "/menu" : "/login"}
                >
                    Explore our menu
                </Link>
            </div>
        </div>
    );
};

export default Home;
