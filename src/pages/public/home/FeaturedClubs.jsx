import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Users } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";

const FeaturedClubs = () => {
    const { data: clubs = [], isLoading, isError } = useQuery({
        queryKey: ['featuredClubs'],
        queryFn: async () => {
            const res = await api.get('/clubs');
            // Mock sort by members count desc and take top 3
           
            return res.data.sort((a, b) => (b.membersCount || 0) - (a.membersCount || 0)).slice(0, 3);
        }
    });

    if (isLoading) return <div className="text-center py-12"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (isError) return <div className="text-center py-12 text-error">Failed to load featured clubs.</div>;

    return (
        <section className="py-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">Featured Clubs</h2>
                <p className="text-base-content/70">Join the most active communities this week</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map((club, index) => (
                    <motion.div
                        key={club._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200"
                    >
                        <figure className="h-48 relative overflow-hidden">
                            <img src={club.image || club.bannerImage || "https://placehold.co/600x400"} alt={club.clubName} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                            <div className="absolute top-4 right-4 badge badge-primary">{club.category}</div>
                        </figure>
                        <div className="card-body">
                            <h3 className="card-title">{club.clubName}</h3>
                            <p className="text-sm text-base-content/70 line-clamp-2">{club.description}</p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-base-content/60">
                                <div className="flex items-center gap-1">
                                    <Users size={16} />
                                    <span>{club.membersCount || 0} Members</span>
                                </div>
                            </div>
                            <div className="card-actions justify-end mt-4">
                                <Link to={`/clubs/${club._id}`} className="btn btn-outline btn-primary btn-sm w-full">View Details</Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedClubs;
