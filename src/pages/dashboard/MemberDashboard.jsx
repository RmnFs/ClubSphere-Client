import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useLocation, Link } from "react-router-dom";

const MemberDashboard = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Determine view based on URL
    const isMyClubs = location.pathname.includes('my-clubs');
    const isMyEvents = location.pathname.includes('my-events');
    const isOverview = !isMyClubs && !isMyEvents;

    const { data: memberships = [] } = useQuery({
        queryKey: ['myMemberships'],
        queryFn: async () => {
            const res = await api.get('/memberships/my');
            return res.data;
        }
    });

    const { data: registrations = [] } = useQuery({
        queryKey: ['myRegistrations'],
        queryFn: async () => {
            const res = await api.get('/event-registrations/my');
            return res.data;
        }
    });

    const { data: payments = [] } = useQuery({
        queryKey: ['myPayments'],
        queryFn: async () => {
            const res = await api.get('/payments/my-payments');
            return res.data;
        },
        enabled: isOverview // Only fetch payments for overview stats for now
    });

    const totalSpent = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                {isOverview ? `Welcome back, ${user?.displayName || 'Member'}!` :
                    isMyClubs ? 'My Clubs' : 'My Events'}
            </h1>

            {/* OVERVIEW SECTION */}
            {isOverview && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="stat bg-base-100 shadow rounded-box"
                        >
                            <div className="stat-title">Clubs Joined</div>
                            <div className="stat-value text-primary">{memberships.length}</div>
                            <div className="stat-desc">{memberships.filter(m => m.status === 'active').length} active memberships</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="stat bg-base-100 shadow rounded-box"
                        >
                            <div className="stat-title">Upcoming Events</div>
                            <div className="stat-value text-secondary">{registrations.filter(r => r.status === 'registered').length}</div>
                            <div className="stat-desc">Registered events</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="stat bg-base-100 shadow rounded-box"
                        >
                            <div className="stat-title">Total Spent</div>
                            <div className="stat-value">${totalSpent}</div>
                            <div className="stat-desc">Lifetime spending</div>
                        </motion.div>
                    </div>

                    <div className="bg-base-100 p-6 rounded-box shadow">
                        <h2 className="text-xl font-bold mb-4">My Schedule</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Event</th>
                                        <th>Date</th>
                                        <th>Location</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registrations.slice(0, 5).map((reg, index) => (
                                        <tr key={reg._id}>
                                            <th>{index + 1}</th>
                                            <td>{reg.eventId?.title || 'Event'}</td>
                                            <td>{reg.eventId?.eventDate ? new Date(reg.eventId.eventDate).toLocaleDateString() : 'TBD'}</td>
                                            <td>{reg.eventId?.location || 'Online'}</td>
                                            <td><span className={`badge ${reg.status === 'registered' ? 'badge-success' : 'badge-warning'}`}>{reg.status}</span></td>
                                        </tr>
                                    ))}
                                    {registrations.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center">No upcoming events found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* MY CLUBS SECTION */}
            {isMyClubs && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memberships.length > 0 ? memberships.map((membership) => (
                        <div key={membership._id} className="card bg-base-100 shadow-xl">
                            <figure className="h-40"><img src={membership.clubId?.bannerImage || membership.clubId?.image || "https://placehold.co/600x400"} alt="Club" className="w-full h-full object-cover" /></figure>
                            <div className="card-body">
                                <h2 className="card-title">{membership.clubId?.clubName}</h2>
                                <p className="text-sm">Status: <span className={`badge badge-sm ${membership.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>{membership.status}</span></p>
                                <div className="card-actions justify-end mt-4">
                                    <Link to={`/clubs/${membership.clubId?._id}`} className="btn btn-primary btn-sm btn-outline">View Club</Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-10">
                            <h3 className="text-lg font-bold opacity-60">You haven't joined any clubs yet.</h3>
                            <Link to="/clubs" className="btn btn-primary btn-sm mt-4">Explore Clubs</Link>
                        </div>
                    )}
                </div>
            )}

            {/* MY EVENTS SECTION */}
            {isMyEvents && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registrations.length > 0 ? registrations.map((reg) => (
                        <div key={reg._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">{reg.eventId?.title}</h2>
                                <p className="text-sm"><span className="font-bold">Date:</span> {reg.eventId?.eventDate ? new Date(reg.eventId.eventDate).toLocaleDateString() : 'TBD'}</p>
                                <p className="text-sm"><span className="font-bold">Location:</span> {reg.eventId?.location}</p>
                                <div className="card-actions justify-end mt-4">
                                    <Link to={`/events/${reg.eventId?._id}`} className="btn btn-primary btn-sm btn-outline">Event Details</Link>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-10">
                            <h3 className="text-lg font-bold opacity-60">You haven't registered for any events yet.</h3>
                            <Link to="/events" className="btn btn-primary btn-sm mt-4">Browse Events</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MemberDashboard;
