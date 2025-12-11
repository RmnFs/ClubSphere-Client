import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api";
import { Users, DollarSign, Calendar, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import PaymentModal from "../../components/Payment/PaymentModal";

const ClubDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const { data: club, isLoading, isError } = useQuery({
        queryKey: ['club', id],
        queryFn: async () => {
            const res = await api.get(`/clubs/${id}`);
            return res.data;
        }
    });

    // Fetch events for this club
    const { data: clubEvents = [] } = useQuery({
        queryKey: ['clubEvents', id],
        queryFn: async () => {
            const res = await api.get('/events');
            // Filter events for this club (handle both ObjectId and string comparison)
            return res.data.filter(event => {
                const eventClubId = typeof event.clubId === 'object' ? event.clubId._id : event.clubId;
                return eventClubId === id || event.clubId === id;
            });
        },
        enabled: !!id
    });

    // Check if user is already a member
    const { data: membershipStatus } = useQuery({
        queryKey: ['membership', id, user?.email],
        queryFn: async () => {
            try {
                const res = await api.get(`/memberships/check/${id}`);
                return res.data;
            } catch (error) {
                return { isMember: false };
            }
        },
        enabled: !!user && !!id
    });

    const joinMutation = useMutation({
        mutationFn: async () => {
            return await api.post('/memberships/join', { clubId: id });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['club', id]);
            queryClient.invalidateQueries(['membership', id]);
            Swal.fire({
                icon: 'success',
                title: 'Joined!',
                text: 'You have successfully joined the club.',
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Join Failed',
                text: error.response?.data?.message || 'Could not join club.',
            });
        }
    });

    if (isLoading) return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (isError) return <div className="text-center py-12 text-error">Failed to load club details.</div>;

    const handleJoin = () => {
        if (club.membershipFee > 0) {
            setIsPaymentModalOpen(true);
        } else {
            joinMutation.mutate();
        }
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        queryClient.invalidateQueries(['club', id]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="hero bg-base-200 rounded-xl overflow-hidden mb-8" style={{ backgroundImage: `url(${club.image || club.bannerImage || "https://placehold.co/1200x400"})` }}>
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content py-20">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">{club.clubName}</h1>
                        <p className="mb-5">{club.category}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4">About the Club</h2>
                            <p className="text-lg leading-relaxed">{club.description}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title mb-4">Club Info</h2>
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="text-primary" />
                                <span>{club.membersCount || 0} Members</span>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <DollarSign className="text-primary" />
                                <span>Membership Fee: {club.membershipFee > 0 ? `$${club.membershipFee}` : 'Free'}</span>
                            </div>

                            <div className="card-actions">
                                {membershipStatus?.isMember ? (
                                    <div className="alert alert-success w-full">
                                        <span>✓ Already a Member</span>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary w-full"
                                        onClick={handleJoin}
                                        disabled={joinMutation.isPending}
                                    >
                                        {joinMutation.isPending ? <span className="loading loading-spinner"></span> : 'Join Club'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="font-bold text-lg mb-2">Club Manager</h3>
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        <img src={club.manager?.photo || "https://placehold.co/100"} alt="Manager" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold">{club.manager?.name || club.managerEmail}</p>
                                    <p className="text-xs text-base-content/70">Manager</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Club Events Section */}
            {clubEvents.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clubEvents.map(event => (
                            <div key={event._id} className="card bg-base-100 shadow-xl">
                                <figure className="h-48">
                                    <img
                                        src={event.bannerImage || event.image || "https://placehold.co/600x400"}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </figure>
                                <div className="card-body">
                                    <h3 className="card-title">{event.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                                        <Calendar size={16} />
                                        {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                                        <MapPin size={16} />
                                        {event.location}
                                    </div>
                                    <div className="card-actions justify-end mt-4">
                                        <Link to={`/events/${event._id}`} className="btn btn-primary btn-sm">
                                            Register ({event.isPaid ? `$${event.eventFee || 0}` : 'Free'})
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={handlePaymentSuccess}
                paymentInfo={{
                    amount: club.membershipFee,
                    type: 'membership',
                    clubId: club._id,
                    userEmail: user?.email,
                    userName: user?.displayName
                }}
            />
        </div>
    );
};

export default ClubDetails;
