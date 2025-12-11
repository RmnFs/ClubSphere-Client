import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import MemberDashboard from '../pages/dashboard/MemberDashboard';

const DashboardRedirect = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/dashboard/admin/clubs', { replace: true });
            } else if (user.role === 'clubManager') {
                navigate('/dashboard/manager', { replace: true });
            }
            // Members stay on /dashboard and see MemberDashboard
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    // Render MemberDashboard for members (and briefly for admins/managers before redirect)
    return <MemberDashboard />;
};

export default DashboardRedirect;
