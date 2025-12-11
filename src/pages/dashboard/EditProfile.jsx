import { useForm } from "react-hook-form";
import { imageUpload } from "../../utils/imageUpload";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import auth from "../../firebase.config";

const EditProfile = () => {
    const { user } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.name || ''
        }
    });
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.photoURL || null);

    const updateProfileMutation = useMutation({
        mutationFn: async (profileData) => {
            return await api.put('/users/profile', profileData);
        },
        onSuccess: () => {
            // Refresh user data from backend
            queryClient.invalidateQueries(['allUsers']);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Profile Updated Successfully',
                text: 'Please refresh the page to see changes',
                showConfirmButton: false,
                timer: 2000
            });

            // Reload page after a delay to refresh user context
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },
        onError: (error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.response?.data?.message || 'Failed to update profile',
            });
        }
    });

    const onSubmit = async (data) => {
        try {
            let photoURL = user?.photoURL; // Keep existing photo by default

            // If user uploaded a new image, upload it
            if (imageFile) {
                const imageRes = await imageUpload(imageFile);
                photoURL = imageRes.data.display_url;
            }

            // Update Firebase Auth profile first
            await updateProfile(auth.currentUser, {
                displayName: data.name,
                photoURL: photoURL
            });

            const profileData = {
                name: data.name,
                photoURL: photoURL
            }

            // Update backend database
            await updateProfileMutation.mutateAsync(profileData);

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: error.message || 'Could not update profile.',
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full px-10">
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="bg-base-100 p-8 rounded-xl shadow-lg max-w-2xl">

                {/* Profile Image */}
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text font-semibold">Profile Image</span>
                    </label>
                    <div className="flex items-center gap-6">
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img src={imagePreview || "https://placehold.co/100"} alt="Profile" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="file-input file-input-bordered w-full"
                            />
                            <p className="text-sm text-gray-500 mt-1">Upload a new profile picture</p>
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text font-semibold">Name*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Your name"
                        {...register("name", { required: true })}
                        className="input input-bordered w-full"
                    />
                    {errors.name && <span className="text-error text-sm mt-1">Name is required</span>}
                </div>

                {/* Email (Read-only) */}
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text font-semibold">Email</span>
                    </label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="input input-bordered w-full bg-base-200"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="text-center flex gap-4 justify-center">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-outline w-full max-w-xs"
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary w-full max-w-xs"
                        disabled={updateProfileMutation.isPending}
                    >
                        {updateProfileMutation.isPending ? <span className="loading loading-spinner"></span> : 'Update Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
