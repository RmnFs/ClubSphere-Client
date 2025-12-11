import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <div className="hero min-h-[70vh] rounded-xl overflow-hidden relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 mix-blend-multiply z-10"></div>
            <div className="hero-overlay bg-opacity-60 bg-[url('https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="hero-content text-center text-neutral-content z-20 relative">
                <div className="max-w-xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-5 text-5xl font-bold font-sans tracking-tight text-white drop-shadow-lg"
                    >
                        Connect. Engage.
                        <span className="text-accent block mt-2">Belong.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-8 text-lg font-medium text-white/90 drop-shadow-md"
                    >
                        Discover local clubs, join exciting events, and build your community with ClubSphere. Your next passion starts here.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Link to="/clubs" className="btn btn-accent btn-lg border-none hover:scale-105 transition-transform shadow-xl">Find a Club</Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
