import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Filter, Users } from 'lucide-react';
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";

const Clubs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const { data: clubs = [], isLoading, isError } = useQuery({
        queryKey: ['clubs'],
        queryFn: async () => {
            const res = await api.get('/clubs');
            return res.data;
        }
    });

    const categories = ["All", "Technology", "Outdoors", "Arts", "Literature", "Sports"]; // This could be dynamic too

    const filteredClubs = clubs.filter(club => {
        const matchesSearch = club.clubName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || club.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
    if (isError) return <div className="text-center py-12 text-error">Failed to load clubs.</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Explore Clubs</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <label className="input input-bordered flex items-center gap-2 w-full md:w-64">
                        <Search size={18} className="opacity-70" />
                        <input
                            type="text"
                            className="grow"
                            placeholder="Search clubs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-outline m-1"><Filter size={18} /> {selectedCategory === "All" ? "Filter" : selectedCategory}</div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            {categories.map(cat => (
                                <li key={cat}><a onClick={() => setSelectedCategory(cat)}>{cat}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredClubs.length > 0 ? filteredClubs.map((club, index) => (
                    <motion.div
                        key={club._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <figure className="h-40 relative overflow-hidden">
                            <img src={club.image || club.bannerImage || "https://placehold.co/600x400"} alt={club.clubName} className="w-full h-full object-cover" />
                        </figure>
                        <div className="card-body p-4">
                            <div className="flex justify-between items-start">
                                <h3 className="card-title text-lg">{club.clubName}</h3>
                                <div className="badge badge-sm badge-secondary">{club.category}</div>
                            </div>
                            <p className="text-sm text-base-content/70 line-clamp-2">{club.description}</p>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center gap-1 text-xs text-base-content/60">
                                    <Users size={14} /> {club.membersCount || 0}
                                </div>
                                <Link to={`/clubs/${club._id}`} className="btn btn-primary btn-sm btn-outline">Details</Link>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full text-center py-10 text-base-content/50">
                        No clubs found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Clubs;
