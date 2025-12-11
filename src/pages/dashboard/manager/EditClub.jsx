import { useForm } from "react-hook-form";
import { imageUpload } from "../../../utils/imageUpload";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const EditClub = () => {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    // Fetch club data
    const { data: club, isLoading } = useQuery({
        queryKey: ['club', id],
        queryFn: async () => {
            const res = await api.get(`/clubs/${id}`);
            return res.data;
        }
    });

    // Pre-populate form fields when club data is loaded
    useEffect(() => {
        if (club) {
            setValue('clubName', club.clubName);
            setValue('category', club.category);
            setValue('location', club.location);
            setValue('description', club.description);
            setValue('fee', club.membershipFee);
        }
    }, [club, setValue]);

    const updateClubMutation = useMutation({
        mutationFn: async (clubData) => {
            return await api.put(`/clubs/${id}`, clubData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['myClubs']);
            queryClient.invalidateQueries(['club', id]);
            queryClient.invalidateQueries(['managerStats']);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Club Updated Successfully',
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
                text: error.response?.data?.message || 'Failed to update club',
            });
        }
    });

    const onSubmit = async (data) => {
        try {
            let imageURL = club?.bannerImage; // Keep existing image by default

            // If user uploaded a new image, upload it
            if (imageFile) {
                const imageRes = await imageUpload(imageFile);
                imageURL = imageRes.data.display_url;
            }

            const clubData = {
                clubName: data.clubName,
                category: data.category,
                bannerImage: imageURL,
                description: data.description,
                location: data.location,
                membershipFee: parseFloat(data.fee),
            }

            updateClubMutation.mutate(clubData);

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

    return (
        <div className="w-full px-10">
            <h1 className="text-3xl font-bold mb-8">Edit Club</h1>
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
                        <select {...register("category", { required: true })} className="select select-bordered w-full">
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
                            <span className="label-text font-semibold">Club Image</span>
                        </label>
                        {club?.bannerImage && (
                            <div className="mb-2">
                                <img src={club.bannerImage} alt="Current club" className="w-32 h-32 object-cover rounded" />
                                <p className="text-sm text-gray-500 mt-1">Current image (upload new to replace)</p>
                            </div>
                        )}
                        <input
                            type="file"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="file-input file-input-bordered w-full"
                        />
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

                <div className="text-center flex gap-4 justify-center">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/manager')}
                        className="btn btn-outline w-full max-w-xs"
                    >
                        Cancel
                    </button>
                    <button className="btn btn-primary w-full max-w-xs" disabled={updateClubMutation.isPending}>
                        {updateClubMutation.isPending ? <span className="loading loading-spinner"></span> : 'Update Club'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditClub;
