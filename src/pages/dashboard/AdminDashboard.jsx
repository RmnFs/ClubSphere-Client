import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api";
import Swal from 'sweetalert2';
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const AdminDashboard = () => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);

    // Determine current view based on path
    const isUsersView = location.pathname.includes('/users');
    const isClubsView = location.pathname.includes('/clubs');
    const isPaymentsView = location.pathname.includes('/payments');
    const isEventsView = location.pathname.includes('/events');
    const isOverview = !isUsersView && !isClubsView && !isPaymentsView && !isEventsView;

    // --- Queries ---

    const { data: stats = {}, isLoading: statsLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await api.get('/dashboard/admin/stats');
            return res.data;
        },
        enabled: isOverview
    });

    const { data: clubs = [], isLoading: clubsLoading } = useQuery({
        queryKey: ['allClubsAdmin'],
        queryFn: async () => {
            const res = await api.get('/clubs/admin/all');
            return res.data;
        }
    });

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const res = await api.get('/users');
            return res.data;
        },
        enabled: isUsersView || isOverview // Fetch if on Users tab or Overview (for stats/debugging)
    });

    const { data: payments = [], isLoading: paymentsLoading } = useQuery({
        queryKey: ['allPayments'],
        queryFn: async () => {
            const res = await api.get('/payments/all');
            return res.data;
        },
        enabled: isPaymentsView
    });

    const { data: events = [], isLoading: eventsLoading } = useQuery({
        queryKey: ['allEvents'],
        queryFn: async () => {
            const res = await api.get('/events');
            return res.data;
        },
        enabled: isEventsView
    });


    // --- Mutations ---

    const deleteEventMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/events/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allEvents']);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Event has been deleted.',
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: error.response?.data?.message || 'Failed to delete event',
            });
        }
    });

    const updateClubStatusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return await api.put(`/clubs/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allClubsAdmin']);
            queryClient.invalidateQueries(['adminStats']);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Club status updated successfully',
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update status'
            });
        }
    });

    const updateUserRoleMutation = useMutation({
        mutationFn: async ({ id, role }) => {
            return await api.put(`/users/${id}/role`, { role });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allUsers']);
            Swal.fire({
                icon: 'success',
                title: 'Role Updated',
                text: 'User role has been updated.',
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.response?.data?.message || 'Failed to update role'
            });
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/users/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allUsers']);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'User has been deleted.',
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: error.response?.data?.message || 'Failed to delete user',
            });
        }
    });


    const deleteClubMutation = useMutation({
        mutationFn: async (id) => {
            return await api.delete(`/clubs/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['allClubsAdmin']);
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Club has been deleted.',
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: error.response?.data?.message || 'Failed to delete club',
            });
        }
    });


    // --- Handlers ---

    const handleApproveClub = (id) => updateClubStatusMutation.mutate({ id, status: 'approved' });
    const handleRejectClub = (id) => updateClubStatusMutation.mutate({ id, status: 'rejected' });
    const handleDeleteClub = (id) => {
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
                deleteClubMutation.mutate(id);
            }
        })
    };

    const handleRoleChange = (userId, newRole) => {
        Swal.fire({
            title: 'Change Role?',
            text: `Are you sure you want to make this user a ${newRole}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateUserRoleMutation.mutate({ id: userId, role: newRole });
            }
        });
    };

    const handleDeleteEvent = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the event!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteEventMutation.mutate(id);
            }
        });
    };

    const handleDeleteUser = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the user!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUserMutation.mutate(id);
            }
        });
    };

    if (statsLoading || clubsLoading || (isUsersView && usersLoading) || (isPaymentsView && paymentsLoading) || (isEventsView && eventsLoading)) return <div><span className="loading loading-spinner text-primary"></span></div>;

    const pendingClubs = clubs.filter(c => c.status === 'pending');

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                {isUsersView ? 'All Users' : isClubsView ? 'All Clubs' : isPaymentsView ? 'All Payments' : isEventsView ? 'All Events' : 'Admin Overview'}
            </h1>

            {/* OVERVIEW SECTION */}
            {isOverview && (
                <>
                    <div className="stats shadow w-full mb-8">
                        <div className="stat">
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value">{stats.totalUsers || 0}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Pending Clubs</div>
                            <div className="stat-value text-warning">{pendingClubs.length}</div>
                        </div>
                        <div className="stat">
                            <div className="stat-title">Total Revenue</div>
                            <div className="stat-value text-success">${stats.totalRevenue || 0}</div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow mb-8">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Pending Club Approvals</h2>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Club Name</th>
                                            <th>Manager</th>
                                            <th>Category</th>
                                            <th>Submission Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingClubs.length > 0 ? pendingClubs.map((club) => (
                                            <tr key={club._id}>
                                                <td>{club.clubName}</td>
                                                <td>{club.managerEmail || 'N/A'}</td>
                                                <td>{club.category}</td>
                                                <td>{new Date(club.createdAt).toLocaleDateString()}</td>
                                                <td className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApproveClub(club._id)}
                                                        className="btn btn-xs btn-success"
                                                        disabled={updateClubStatusMutation.isPending}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClub(club._id)}
                                                        className="btn btn-xs btn-error"
                                                        disabled={updateClubStatusMutation.isPending}
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="text-center text-base-content/50">No pending clubs to review.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* USERS SECTION */}
            {isUsersView && (
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Current Role</th>
                                        <th>Change Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-10 h-10">
                                                            <img src={user.photoURL || "https://placehold.co/100"} alt="User" />
                                                        </div>
                                                    </div>
                                                    <div className="font-bold">{user.name}</div>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td><span className="badge badge-ghost border-primary">{user.role}</span></td>
                                            <td>
                                                <select
                                                    className="select select-bordered select-xs"
                                                    defaultValue={user.role}
                                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                    disabled={updateUserRoleMutation.isPending || user.email === currentUser?.email}
                                                >
                                                    <option value="member">Member</option>
                                                    <option value="clubManager">Manager</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                {user.email === currentUser?.email && (
                                                    <p className="text-xs text-warning mt-1">You cannot change your own role</p>
                                                )}
                                            </td>
                                            <td>
                                                {user.email !== currentUser?.email && (
                                                    <button onClick={() => handleDeleteUser(user._id)} className="btn btn-xs btn-error btn-outline">Delete</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* CLUBS SECTION */}
            {isClubsView && (
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="card-title">All Clubs</h2>
                            <button onClick={() => navigate('/dashboard/manager/add-club')} className="btn btn-primary btn-sm">
                                + Create New Club
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Club Name</th>
                                        <th>Manager</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clubs.map((club) => (
                                        <tr key={club._id}>
                                            <td>{club.clubName}</td>
                                            <td>{club.managerEmail}</td>
                                            <td>
                                                <span className={`badge ${club.status === 'approved' ? 'badge-success' :
                                                    club.status === 'rejected' ? 'badge-error' : 'badge-warning'
                                                    }`}>
                                                    {club.status}
                                                </span>
                                            </td>
                                            <td>
                                                {club.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleApproveClub(club._id)} className="btn btn-xs btn-success">Approve</button>
                                                        <button onClick={() => handleRejectClub(club._id)} className="btn btn-xs btn-error">Reject</button>
                                                        <button onClick={() => handleDeleteClub(club._id)} className="btn btn-xs btn-error btn-outline">Delete</button>
                                                    </div>
                                                )}
                                                {club.status !== 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Link to={`/dashboard/admin/club/${club._id}/members`} className="btn btn-xs btn-outline">
                                                            View Members
                                                        </Link>
                                                        <button onClick={() => handleDeleteClub(club._id)} className="btn btn-xs btn-error btn-outline">Delete</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* PAYMENTS SECTION */}
            {isPaymentsView && (
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>User</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length > 0 ? payments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                            <td>{payment.userEmail}</td>
                                            <td>
                                                <span className="badge badge-ghost">
                                                    {payment.type === 'membership' ? 'Club Membership' : 'Event Registration'}
                                                </span>
                                            </td>
                                            <td className="font-bold">${payment.amount}</td>
                                            <td>
                                                <span className={`badge ${payment.status === 'succeeded' ? 'badge-success' : 'badge-warning'}`}>
                                                    {payment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center text-base-content/50">No payments found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* EVENTS SECTION */}
            {isEventsView && (
                <div className="card bg-base-100 shadow">
                    <div className="card-body">
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Event Title</th>
                                        <th>Club</th>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.length > 0 ? events.map((event) => (
                                        <tr key={event._id}>
                                            <td>{event.title}</td>
                                            <td>{event.clubId?.clubName || 'N/A'}</td>
                                            <td>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'}</td>
                                            <td>
                                                <span className={`badge ${event.isPaid ? 'badge-warning' : 'badge-success'}`}>
                                                    {event.isPaid ? `Paid ($${event.eventFee})` : 'Free'}
                                                </span>
                                            </td>
                                            <td>
                                                <button onClick={() => handleDeleteEvent(event._id)} className="btn btn-xs btn-error btn-outline">Delete</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No events found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
