import { useForm } from "react-hook-form";
import { imageUpload } from "../../../utils/imageUpload";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const AddEvent = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch manager's clubs to select from
    const { data: myClubs = [] } = useQuery({
        queryKey: ['myClubs'],
        queryFn: async () => {
            const res = await api.get('/clubs/admin/all');
            return res.data;
        }
    });

    const createEventMutation = useMutation({
        mutationFn: async (eventData) => {
            return await api.post('/events', eventData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['events']);
            queryClient.invalidateQueries(['managerStats']);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Event Created Successfully',
                showConfirmButton: false,
                timer: 1500
            });
            reset();
            navigate('/dashboard/manager');
        },
        onError: (error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to create event',
            });
        }
    });

    const onSubmit = async (data) => {
        try {
            let imageURL = "";
            if (data.image && data.image.length > 0) {
                const imageRes = await imageUpload(data.image[0]);
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

            createEventMutation.mutate(eventData);

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Image Upload Failed',
                text: 'Could not upload image.',
            });
        }
    };

    if (myClubs.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-4">You need to have a club to create an event.</h2>
                <button onClick={() => navigate('/dashboard/manager/add-club')} className="btn btn-primary">Create a Club First</button>
            </div>
        )
    }

    return (
        <div className="w-full px-10">
            <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
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
                        <select defaultValue="" {...register("clubId", { required: true })} className="select select-bordered w-full">
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
                    <input type="file" {...register("image")} className="file-input file-input-bordered w-full" />
                </div>

                {/* Free/Paid & Fee */}
                <div className="flex gap-6 mb-4 flex-col md:flex-row">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Event Type*</span>
                        </label>
                        <select defaultValue="false" {...register("isPaid", { required: true })} className="select select-bordered w-full">
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

                <div className="text-center">
                    <button className="btn btn-primary w-full max-w-xs" disabled={createEventMutation.isPending}>
                        {createEventMutation.isPending ? <span className="loading loading-spinner"></span> : 'Create Event'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEvent;
