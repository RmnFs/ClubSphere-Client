import { Plus } from 'lucide-react';
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from 'sweetalert2';

const ManagerDashboard = () => {
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['managerStats'],
        queryFn: async () => {
            const res = await api.get('/dashboard/manager/stats');
            return res.data;
        }
    });

    // Fetch all clubs but filter by current user's email


    const { data: allClubs = [], isLoading: clubsLoading } = useQuery({
        queryKey: ['myClubs'],
        queryFn: async () => {
            const res = await api.get('/clubs/admin/all');
            return res.data;
        }
    });

    // Filter clubs where I am the manager
    const clubs = allClubs.filter(club => club.managerEmail === user?.email);

    const { data: allEvents = [], isLoading: eventsLoading } = useQuery({
        queryKey: ['myEventsManager'],
        queryFn: async () => {
            const res = await api.get('/events');
            return res.data;
        },
        enabled: !!user?.email // Only fetch if user is logged in
    });

    // Filter events that belong to my clubs
    const myClubIds = clubs.map(c => c._id);
    const managedEvents = allEvents.filter(e => myClubIds.includes(e.clubId));

    // Delete event mutation
    const deleteEventMutation = useMutation({
        mutationFn: async (eventId) => {
            return await api.delete(`/events/${eventId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myEventsManager']);
            queryClient.invalidateQueries(['events']);
            queryClient.invalidateQueries(['managerStats']);
            Swal.fire('Deleted!', 'Event has been deleted.', 'success');
        },
        onError: (error) => {
            Swal.fire('Error', error.response?.data?.message || 'Failed to delete event', 'error');
        }
    });

    const handleDeleteEvent = (eventId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEventMutation.mutate(eventId);
            }
        });
    };


    if (statsLoading || clubsLoading) return <div><span className="loading loading-spinner text-primary"></span></div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manager Dashboard</h1>
                <div className="flex gap-2">
                    <Link to="/dashboard/manager/add-club" className="btn btn-primary btn-sm"><Plus size={16} /> Add Club</Link>
                    <Link to="/dashboard/manager/add-event" className="btn btn-secondary btn-sm"><Plus size={16} /> Create Event</Link>
                </div>
            </div>

            <div className="stats shadow w-full mb-8">
                <div className="stat">
                    <div className="stat-title">Managed Clubs</div>
                    <div className="stat-value">{stats.totalClubs || 0}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Total Members</div>
                    <div className="stat-value">{stats.totalMembers || 0}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Events Created</div>
                    <div className="stat-value">{stats.totalEvents || 0}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Clubs */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title mb-4">My Clubs</h2>
                        {clubs.length === 0 && (
                            <div className="alert alert-info mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span>You haven't created any clubs yet. Click <strong>"Add Club"</strong> button above to get started!</span>
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Club Name</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clubs.length > 0 ? clubs.map((club) => (
                                        <tr key={club._id}>
                                            <td>{club.clubName}</td>
                                            <td><span className={`badge ${club.status === 'approved' ? 'badge-success' : club.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>{club.status}</span></td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <Link to={`/dashboard/manager/club/${club._id}/members`} className="btn btn-xs btn-outline btn-info">View Members</Link>
                                                    <Link to={`/dashboard/manager/edit-club/${club._id}`} className="btn btn-xs btn-outline">Edit</Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">No clubs found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* My Events */}
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <h2 className="card-title mb-4">My Events</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {managedEvents.length > 0 ? managedEvents.map((event) => (
                                        <tr key={event._id}>
                                            <td>{event.title}</td>
                                            <td>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'}</td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <Link to={`/dashboard/manager/event/${event._id}/registrations`} className="btn btn-xs btn-outline btn-info">View Registrations</Link>
                                                    <Link to={`/dashboard/manager/edit-event/${event._id}`} className="btn btn-xs btn-outline">Edit</Link>
                                                    <button onClick={() => handleDeleteEvent(event._id)} className="btn btn-xs btn-error btn-outline">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">No events found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
