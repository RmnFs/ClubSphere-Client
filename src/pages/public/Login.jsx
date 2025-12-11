import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { LogIn } from 'lucide-react';

const Login = () => {
    const { signIn, googleSignIn } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [socialLoading, setSocialLoading] = useState(false);

    const onSubmit = data => {
        signIn(data.email, data.password)
            .then(result => {
                const user = result.user;
                console.log(user);
                Swal.fire({
                    title: 'User Login Successful.',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                });
                navigate(from, { replace: true });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message,
                });
            })
    };

    const handleGoogleSignIn = () => {
        setSocialLoading(true);
        googleSignIn()
            .then(result => {
                const loggedInUser = result.user;
                console.log(loggedInUser);
                const saveUser = { name: loggedInUser.displayName, email: loggedInUser.email, role: 'member' }
                // Here you would typically POST to your backend to save the user if they don't exist
                // fetch('http://localhost:5000/users', { ... })

                navigate(from, { replace: true });
                setSocialLoading(false);
            })
            .catch(error => {
                setSocialLoading(false);
                console.error(error);
            })
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-5xl gap-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center lg:text-left lg:w-1/2"
                >
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">Access your dashboard, manage your memberships, and stay updated with the latest events.</p>
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
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="email"
                                className="input input-bordered"
                                {...register("email", { required: true })}
                            />
                            {errors.email && <span className="text-red-600">Email is required</span>}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                className="input input-bordered"
                                {...register("password", { required: true })}
                            />
                            {errors.password && <span className="text-red-600">Password is required</span>}
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary"><LogIn size={18} className="mr-2" /> Login</button>
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
                            New here? <Link to="/register" className="text-primary font-bold">Create an account</Link>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
