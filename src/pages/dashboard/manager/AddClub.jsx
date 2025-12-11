import { useForm } from "react-hook-form";
import { imageUpload } from "../../../utils/imageUpload";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";

const AddClub = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const createClubMutation = useMutation({
        mutationFn: async (clubData) => {
            return await api.post('/clubs', clubData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myClubs']);
            queryClient.invalidateQueries(['managerStats']);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Club Added Successfully',
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
                text: error.response?.data?.message || 'Failed to create club',
            });
        }
    });

    const onSubmit = async (data) => {
        try {
            // Upload image
            const imageRes = await imageUpload(data.image[0]);
            const imageURL = imageRes.data.display_url;

            const clubData = {
                clubName: data.clubName,
                category: data.category,
                bannerImage: imageURL,
                description: data.description,
                location: data.location,
                membershipFee: parseFloat(data.fee),
            }

            createClubMutation.mutate(clubData);

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Image Upload Failed',
                text: 'Could not upload image.',
            });
        }
    };

    return (
        <div className="w-full px-10">
            <h1 className="text-3xl font-bold mb-8">Add a New Club</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-base-100 p-8 rounded-xl shadow-lg">

                {/* Club Name & Category */}
                <div className="flex gap-6 mb-4 flex-col md:flex-row">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Club Name*</span>
                        </label>
                        <input type="text" placeholder="e.g. Tech Innovators" {...register("clubName", { required: true })} className="input input-bordered w-full" />
                        {errors.clubName && <span className="text-error text-sm mt-1">Required</span>}
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Category*</span>
                        </label>
                        <select defaultValue="" {...register("category", { required: true })} className="select select-bordered w-full">
                            <option disabled value="">Select a category</option>
                            <option>Technology</option>
                            <option>Arts</option>
                            <option>Sports</option>
                            <option>Literature</option>
                            <option>Music</option>
                            <option>Social</option>
                            <option>Outdoors</option>
                        </select>
                        {errors.category && <span className="text-error text-sm mt-1">Required</span>}
                    </div>
                </div>

                {/* Location */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text font-semibold">Location*</span>
                    </label>
                    <input type="text" placeholder="e.g. New York, NY" {...register("location", { required: true })} className="input input-bordered w-full" />
                    {errors.location && <span className="text-error text-sm mt-1">Required</span>}
                </div>

                {/* Image & Fee */}
                <div className="flex gap-6 mb-4 flex-col md:flex-row">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Club Image*</span>
                        </label>
                        <input type="file" {...register("image", { required: true })} className="file-input file-input-bordered w-full" />
                        {errors.image && <span className="text-error text-sm mt-1">Required</span>}
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text font-semibold">Membership Fee ($)</span>
                        </label>
                        <input type="number" placeholder="0" {...register("fee", { required: true, min: 0 })} className="input input-bordered w-full" />
                        {errors.fee && <span className="text-error text-sm mt-1">Required (min 0)</span>}
                    </div>
                </div>

                {/* Description */}
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text font-semibold">Description*</span>
                    </label>
                    <textarea {...register("description", { required: true })} className="textarea textarea-bordered h-24" placeholder="Tell us about your club..."></textarea>
                    {errors.description && <span className="text-error text-sm mt-1">Required</span>}
                </div>

                <div className="text-center">
                    <button className="btn btn-primary w-full max-w-xs" disabled={createClubMutation.isPending}>
                        {createClubMutation.isPending ? <span className="loading loading-spinner"></span> : 'Create Club'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddClub;
