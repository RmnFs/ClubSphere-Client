import { useForm } from "react-hook-form";
import { imageUpload } from "../../../utils/imageUpload";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const EditEvent = () => {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    // Fetch manager's clubs for dropdown
    const { data: myClubs = [] } = useQuery({
        queryKey: ['myClubs'],
        queryFn: async () => {
            const res = await api.get('/clubs/admin/all');
            return res.data;
        }
    });

    // Fetch event data
    const { data: event, isLoading } = useQuery({
        queryKey: ['event', id],
        queryFn: async () => {
            const res = await api.get(`/events/${id}`);
            return res.data;
        }
    });

    // Pre-populate form fields when event data is loaded
    useEffect(() => {
        if (event) {
            setValue('title', event.title);
            setValue('clubId', event.clubId);
            setValue('description', event.description);
            setValue('location', event.location);
            setValue('isPaid', event.isPaid.toString());
            setValue('eventFee', event.eventFee || 0);
            setValue('maxAttendees', event.maxAttendees || '');

            // Format date for datetime-local input
            if (event.eventDate) {
                const date = new Date(event.eventDate);
                const formattedDate = date.toISOString().slice(0, 16);
                setValue('date', formattedDate);
            }
        }
    }, [event, setValue]);

    const updateEventMutation = useMutation({
        mutationFn: async (eventData) => {
            return await api.put(`/events/${id}`, eventData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['events']);
            queryClient.invalidateQueries(['myEventsManager']);
            queryClient.invalidateQueries(['event', id]);
            queryClient.invalidateQueries(['managerStats']);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Event Updated Successfully',
                showConfirmButton: false,
                timer: 1500
            });
            navigate('/dashboard/manager');
        },
        onError: (error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to update event',
            });
        }
    });

    const onSubmit = async (data) => {
        try {
            let imageURL = event?.bannerImage || ""; // Keep existing image by default

            // If user uploaded a new image, upload it
            if (imageFile) {
                const imageRes = await imageUpload(imageFile);
                imageURL = imageRes.data.display_url;
            }

            const eventData = {
                title: data.title,
                clubId: data.clubId,
                description: data.description,
                eventDate: data.date,
                location: data.location,
                isPaid: data.isPaid === 'true',
                eventFee: data.isPaid === 'true' ? parseFloat(data.eventFee) : 0,
                maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : undefined,
                bannerImage: imageURL
            }

            updateEventMutation.mutate(eventData);

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Image Upload Failed',
                text: 'Could not upload image.',
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    if (myClubs.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-4">You need to have a club to edit events.</h2>
                <button onClick={() => navigate('/dashboard/manager/add-club')} className="btn btn-primary">Create a Club First</button>
            </div>
        )
    }

    return (
        <div className="w-full px-10">
            <h1 className="text-3xl font-bold mb-8">Edit Event</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-base-100 p-8 rounded-xl shadow-lg">

                {/* Event Name & Club */}
                <div className="flex gap-6 mb-4 flex-col md:flex-row">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Event Title*</span>
                        </label>
                        <input type="text" placeholder="e.g. Annual Gala" {...register("title", { required: true })} className="input input-bordered w-full" />
                        {errors.title && <span className="text-error text-sm mt-1">Required</span>}
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Club*</span>
                        </label>
                        <select {...register("clubId", { required: true })} className="select select-bordered w-full">
                            <option disabled value="">Select your club</option>
                            {myClubs.map(club => (
                                <option key={club._id} value={club._id}>{club.clubName}</option>
                            ))}
                        </select>
                        {errors.clubId && <span className="text-error text-sm mt-1">Required</span>}
                    </div>
                </div>

                {/* Date & Location */}
                <div className="flex gap-6 mb-4 flex-col md:flex-row">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Date*</span>
                        </label>
                        <input type="datetime-local" {...register("date", { required: true })} className="input input-bordered w-full" />
                        {errors.date && <span className="text-error text-sm mt-1">Required</span>}
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Location*</span>
                        </label>
                        <input type="text" placeholder="e.g. Community Hall" {...register("location", { required: true })} className="input input-bordered w-full" />
                        {errors.location && <span className="text-error text-sm mt-1">Required</span>}
                    </div>
                </div>

                {/* Image */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text font-semibold">Event Image</span>
                    </label>
                    {event?.bannerImage && (
                        <div className="mb-2">
                            <img src={event.bannerImage} alt="Current event" className="w-32 h-32 object-cover rounded" />
                            <p className="text-sm text-gray-500 mt-1">Current image (upload new to replace)</p>
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                {/* Free/Paid & Fee */}
                <div className="flex gap-6 mb-4 flex-col md:flex-row">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Event Type*</span>
                        </label>
                        <select {...register("isPaid", { required: true })} className="select select-bordered w-full">
                            <option value="false">Free</option>
                            <option value="true">Paid</option>
                        </select>
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Event Fee ($)</span>
                        </label>
                        <input type="number" placeholder="0" {...register("eventFee")} className="input input-bordered w-full" />
                    </div>
                </div>

                {/* Description */}
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text font-semibold">Description*</span>
                    </label>
                    <textarea {...register("description", { required: true })} className="textarea textarea-bordered h-24" placeholder="Event details..."></textarea>
                    {errors.description && <span className="text-error text-sm mt-1">Required</span>}
                </div>

                <div className="text-center flex gap-4 justify-center">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/manager')}
                        className="btn btn-outline w-full max-w-xs"
                    >
                        Cancel
                    </button>
                    <button className="btn btn-primary w-full max-w-xs" disabled={updateEventMutation.isPending}>
                        {updateEventMutation.isPending ? <span className="loading loading-spinner"></span> : 'Update Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEvent;
