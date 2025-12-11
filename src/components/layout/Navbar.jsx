import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    const handleLogOut = () => {
        logOut()
            .then(() => { })
            .catch(error => console.log(error));
    }

    const navOptions = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/clubs">Clubs</NavLink></li>
        <li><NavLink to="/events">Events</NavLink></li>
    </>

    return (
        <div className="navbar bg-base-100/90 backdrop-blur-md sticky top-0 z-50 border-b border-base-200">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {navOptions}
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ClubSphere</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navOptions}
                </ul>
            </div>
            <div className="navbar-end">
                {
                    user ? <>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-primary/20">
                                <div className="w-10 rounded-full">
                                    <img alt="User Profile" src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <Link to="/dashboard" className="justify-between">
                                        Dashboard
                                        <span className="badge">New</span>
                                    </Link>
                                </li>
                                <li><a onClick={handleLogOut}>Logout</a></li>
                            </ul>
                        </div>
                    </> : <>
                        <Link to="/login" className="btn btn-ghost btn-sm mr-2">Login</Link>
                        <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
                    </>
                }
            </div>
        </div>
    );
};

export default Navbar;
