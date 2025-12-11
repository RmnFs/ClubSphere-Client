import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api";
import { Calendar, MapPin, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import PaymentModal from "../../components/Payment/PaymentModal";

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const res = await api.get(`/events/${id}`);
            return res.data;
        }
    });

    // Check if user is already registered
    const { data: registrationStatus } = useQuery({
        queryKey: ['eventRegistration', id, user?.email],
        queryFn: async () => {
            try {
                const res = await api.get(`/event-registrations/check/${id}`);
                return res.data;
            } catch (error) {
                return { isRegistered: false };
            }
        },
        enabled: !!user && !!id
    });

    const registerMutation = useMutation({
        mutationFn: async () => {
            return await api.post('/event-registrations/register', { eventId: id });
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Registered!',
                text: 'You have successfully registered for this event.',
            });
            queryClient.invalidateQueries(['event', id]);
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.response?.data?.message || 'Could not register for event.',
            });
        }
    });

    if (isLoading) return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (isError) return <div className="text-center py-12 text-error">Failed to load event details.</div>;

    const handleRegister = () => {
        if (event.isPaid && event.eventFee > 0) {
            setIsPaymentModalOpen(true);
        } else {
            registerMutation.mutate();
        }
    }

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        queryClient.invalidateQueries(['event', id]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="card lg:card-side bg-base-100 shadow-xl overflow-hidden">
                <figure className="lg:w-1/2 h-96">
                    <img src={event.bannerImage || event.image || "https://placehold.co/800x600"} alt={event.title} className="w-full h-full object-cover" />
                </figure>
                <div className="card-body lg:w-1/2">
                    <h2 className="card-title text-4xl mb-4">{event.title}</h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-primary" />
                            <span className="text-lg">{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'TBD'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-primary" />
                            <span className="text-lg">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <DollarSign className="text-primary" />
                            <span className="text-lg font-bold">{event.isPaid ? `$${event.eventFee}` : 'Free'}</span>
                        </div>
                    </div>

                    <p className="text-base-content/80 text-lg mb-6">{event.description}</p>

                    <div className="card-actions justify-end mt-auto">
                        {registrationStatus?.isRegistered ? (
                            <div className="alert alert-success">
                                <span>✓ You are registered for this event</span>
                            </div>
                        ) : (
                            <button
                                className="btn btn-primary btn-lg w-full md:w-auto"
                                onClick={handleRegister}
                                disabled={registerMutation.isPending}
                            >
                                {registerMutation.isPending ? <span className="loading loading-spinner"></span> : (event.isPaid ? 'Pay & Register' : 'Register Now')}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={handlePaymentSuccess}
                paymentInfo={{
                    amount: event.eventFee,
                    type: 'event',
                    eventId: event._id,
                    clubId: event.clubId,
                    userEmail: user?.email,
                    userName: user?.displayName
                }}
            />
        </div>
    );
};

export default EventDetails;
