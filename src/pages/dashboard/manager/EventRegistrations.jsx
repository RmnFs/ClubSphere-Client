import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { ArrowLeft, Calendar } from "lucide-react";

const EventRegistrations = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const { data: event, isLoading: eventLoading } = useQuery({
        queryKey: ['event', eventId],
        queryFn: async () => {
            const res = await api.get(`/events/${eventId}`);
            return res.data;
        }
    });

    const { data: registrations = [], isLoading: registrationsLoading } = useQuery({
        queryKey: ['eventRegistrations', eventId],
        queryFn: async () => {
            const res = await api.get(`/event-registrations/event/${eventId}`);
            return res.data;
        }
    });

    if (eventLoading || registrationsLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => navigate('/dashboard/manager')} className="btn btn-ghost mb-4">
                <ArrowLeft size={18} /> Back to Dashboard
            </button>

            <div className="flex items-center gap-3 mb-6">
                <Calendar size={32} className="text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">{event?.title} - Registrations</h1>
                    <p className="text-base-content/60">Total Registrations: {registrations.length}</p>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User Email</th>
                                    <th>Registration Date</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.length > 0 ? registrations.map((reg, index) => (
                                    <tr key={reg._id}>
                                        <th>{index + 1}</th>
                                        <td>{reg.userEmail}</td>
                                        <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${reg.status === 'registered' ? 'badge-success' : 'badge-warning'}`}>
                                                {reg.status}
                                            </span>
                                        </td>
                                        <td>
                                            {reg.paymentId ? (
                                                <span className="badge badge-success">Paid</span>
                                            ) : (
                                                <span className="badge badge-ghost">Free</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-base-content/50">
                                            No registrations yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventRegistrations;
