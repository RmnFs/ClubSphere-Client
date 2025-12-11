import { motion } from "framer-motion";
import { Calendar, MapPin } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const Events = () => {
    const { user } = useContext(AuthContext);

    const { data: events = [], isLoading, isError } = useQuery({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await api.get('/events');
            return res.data;
        }
    });

    // Fetch user's registrations
    const { data: myRegistrations = [] } = useQuery({
        queryKey: ['myEventRegistrations'],
        queryFn: async () => {
            const res = await api.get('/event-registrations/my');
            return res.data;
        },
        enabled: !!user
    });

    // Create a Set of registered event IDs for quick lookup
    const registeredEventIds = new Set(myRegistrations.map(reg => reg.eventId?._id || reg.eventId));

    if (isLoading) return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (isError) return <div className="text-center py-12 text-error">Failed to load events.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.length > 0 ? events.map((event, index) => (
                    <motion.div
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card bg-base-100 shadow-xl image-full"
                    >
                        <figure><img src={event.bannerImage || event.image || "https://placehold.co/600x400"} alt={event.title} /></figure>
                        <div className="card-body">
                            <h2 className="card-title text-white">{event.title}</h2>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <Calendar size={16} /> {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'}
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <MapPin size={16} /> {event.location}
                            </div>
                            <div className="card-actions justify-end mt-4">
                                <Link to={`/events/${event._id}`} className="btn btn-outline btn-sm">View Details</Link>
                                {registeredEventIds.has(event._id) ? (
                                    <div className="badge badge-success gap-2">
                                        ✓ Registered
                                    </div>
                                ) : (
                                    <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">Register ({event.isPaid ? `$${event.eventFee || 0}` : 'Free'})</Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full text-center py-10 text-base-content/50">
                        No upcoming events found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
