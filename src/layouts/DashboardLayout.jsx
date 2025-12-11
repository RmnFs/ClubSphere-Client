import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Settings, LogOut, PlusCircle, CreditCard, Shield, Home } from 'lucide-react';
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const DashboardLayout = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogOut = () => {
        logOut()
            .then(() => {
                navigate('/'); // Redirect to homepage after logout
            })
            .catch(error => console.log(error));
    }

    const sidebarLinks = <>
        {/* Common Links (Member) */}
        <li><Link to="/dashboard"><LayoutDashboard size={18} /> Overview</Link></li>
        <li><Link to="/dashboard/my-clubs"><Users size={18} /> My Clubs</Link></li>
        <li><Link to="/dashboard/my-events"><Calendar size={18} /> My Events</Link></li>
        <li><Link to="/dashboard/profile"><Settings size={18} /> Edit Profile</Link></li>

        {/* Manager Links - Visible to Manager AND Admin */}
        {(user?.role === 'clubManager' || user?.role === 'admin') && (
            <>
                <div className="divider">Manager</div>
                <li><Link to="/dashboard/manager/clubs"><Settings size={18} /> Manage Clubs</Link></li>
                <li><Link to="/dashboard/manager/add-club"><PlusCircle size={18} /> Add Club</Link></li>
            </>
        )}

        {/* Admin Links - Visible ONLY to Admin */}
        {user?.role === 'admin' && (
            <>
                <div className="divider">Admin</div>
                <li><Link to="/dashboard/admin/users"><Users size={18} /> All Users</Link></li>
                <li><Link to="/dashboard/admin/clubs"><Shield size={18} /> All Clubs</Link></li>
                <li><Link to="/dashboard/admin/events"><Calendar size={18} /> All Events</Link></li>
                <li><Link to="/dashboard/admin/payments"><CreditCard size={18} /> All Payments</Link></li>
            </>
        )}
    </>

    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center bg-base-200 min-h-screen">
                {/* Page content here */}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden absolute top-4 left-4">Open Menu</label>
                <div className="w-full h-full p-8 pt-16 lg:pt-8 flex-grow overflow-y-auto">
                    <Outlet />
                </div>
            </div>
            <div className="drawer-side z-20">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-100 text-base-content flex flex-col justify-between">
                    {/* Sidebar content here */}
                    <div>
                        <div className="mb-8 px-4">
                            <Link to="/" className="text-2xl font-bold text-primary">ClubSphere</Link>
                            <p className="text-sm opacity-60">Dashboard</p>
                        </div>
                        {sidebarLinks}
                    </div>

                    <div className="mt-auto">
                        <div className="divider"></div>
                        <div className="flex items-center gap-3 mt-4 px-4 bg-base-200 p-2 rounded-lg">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                    <img src={user?.photoURL || "https://placehold.co/100"} alt="User" />
                                </div>
                            </div>
                            <div>
                                <div className="font-bold">{user?.displayName || user?.email}</div>
                                <div className="text-sm opacity-50">{user?.role}</div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 px-4">
                            <Link to="/" className="btn btn-outline btn-sm flex-1">
                                <Home size={16} /> Exit
                            </Link>
                            <button onClick={handleLogOut} className="btn btn-error btn-sm flex-1">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;
