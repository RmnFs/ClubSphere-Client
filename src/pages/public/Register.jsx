import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { imageUpload } from "../../utils/imageUpload";

const Register = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { createUser, updateUserProfile, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [socialLoading, setSocialLoading] = useState(false);

    const onSubmit = async (data) => {
        try {
            // 1. Upload image to ImgBB
            const imageFile = { image: data.image[0] };
            
            const res = await imageUpload(data.image[0]);
            const photoURL = res.data.display_url;

            // 2. Create User
            createUser(data.email, data.password)
                .then(result => {
                    const loggedUser = result.user;
                    console.log(loggedUser);
                    updateUserProfile(data.name, photoURL)
                        .then(() => {
                            
                            reset();
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'User created successfully.',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            navigate('/');
                        })
                        .catch(error => console.log(error))
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Registration Failed',
                        text: error.message,
                    });
                })

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Image Upload Failed',
                text: 'Please check your internet or API key configuration.',
            });
            console.error(error);
        }
    };

    const handleGoogleSignIn = () => {
        setSocialLoading(true);
        googleSignIn()
            .then(result => {
                const loggedInUser = result.user;
                console.log(loggedInUser);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Signed up successfully with Google!',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/');
                setSocialLoading(false);
            })
            .catch(error => {
                setSocialLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Google Sign In Failed',
                    text: error.message,
                });
                console.error(error);
            });
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-5xl gap-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center lg:text-left lg:w-1/2"
                >
                    <h1 className="text-5xl font-bold">Sign up now!</h1>
                    <p className="py-6">Join ClubSphere to discover exclusive clubs and events tailored to your interests.</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100"
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" {...register("name", { required: true })} name="name" placeholder="Name" className="input input-bordered" />
                            {errors.name && <span className="text-red-600">Name is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Picture</span>
                            </label>
                            {/* File Input */}
                            <input type="file" {...register("image", { required: true })} className="file-input file-input-bordered w-full" />
                            {errors.image && <span className="text-red-600">Image is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" {...register("email", { required: true })} name="email" placeholder="email" className="input input-bordered" />
                            {errors.email && <span className="text-red-600">Email is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" {...register("password", {
                                required: true,
                                minLength: 6,
                                maxLength: 20,
                                pattern: /(?=.*[A-Z])(?=.*[a-z])/
                            })} placeholder="password" className="input input-bordered" />
                            {errors.password?.type === 'required' && <p className="text-red-600">Password is required</p>}
                            {errors.password?.type === 'minLength' && <p className="text-red-600">Password must be 6 characters</p>}
                            {errors.password?.type === 'maxLength' && <p className="text-red-600">Password must be less than 20 characters</p>}
                            {errors.password?.type === 'pattern' && <p className="text-red-600">Password must have one Upper and lower case</p>}
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Sign Up</button>
                        </div>
                        <div className="divider">OR</div>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="btn btn-outline btn-accent"
                            disabled={socialLoading}
                        >
                            {socialLoading ? <span className="loading loading-spinner"></span> : "Continue with Google"}
                        </button>
                        <p className="text-center mt-4">
                            Already have an account? <Link to="/login" className="text-primary font-bold">Login</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
