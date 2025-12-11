import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import api from "../../../utils/api";
import { ArrowLeft, Users } from "lucide-react";

const ClubMembers = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();

    const { data: club, isLoading: clubLoading } = useQuery({
        queryKey: ['club', clubId],
        queryFn: async () => {
            const res = await api.get(`/clubs/${clubId}`);
            return res.data;
        }
    });

    const { data: members = [], isLoading: membersLoading } = useQuery({
        queryKey: ['clubMembers', clubId],
        queryFn: async () => {
            const res = await api.get(`/memberships/club/${clubId}`);
            return res.data;
        }
    });

    if (clubLoading || membersLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    const { user } = useContext(AuthContext); // Import AuthContext first
    const backLink = user?.role === 'admin' ? '/dashboard/admin/clubs' : '/dashboard/manager';

    return (
        <div>
            <button onClick={() => navigate(backLink)} className="btn btn-ghost mb-4">
                <ArrowLeft size={18} /> Back {user?.role === 'admin' ? 'to Clubs' : 'to Dashboard'}
            </button>

            <div className="flex items-center gap-3 mb-6">
                <Users size={32} className="text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">{club?.clubName} - Members</h1>
                    <p className="text-base-content/60">Total Members: {members.length}</p>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User Email</th>
                                    <th>Joined Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.length > 0 ? members.map((member, index) => (
                                    <tr key={member._id}>
                                        <th>{index + 1}</th>
                                        <td>{member.userEmail}</td>
                                        <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge ${member.status === 'active' ? 'badge-success' : 'badge-ghost'}`}>
                                                {member.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-base-content/50">
                                            No members yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClubMembers;
