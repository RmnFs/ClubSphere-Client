import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Clubs from "../pages/public/Clubs";
import ClubDetails from "../pages/public/ClubDetails";
import Events from "../pages/public/Events";
import EventDetails from "../pages/public/EventDetails";
import MemberDashboard from "../pages/dashboard/MemberDashboard";
import ManagerDashboard from "../pages/dashboard/ManagerDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import EditProfile from "../pages/dashboard/EditProfile";
import AddClub from "../pages/dashboard/manager/AddClub";
import EditClub from "../pages/dashboard/manager/EditClub";
import AddEvent from "../pages/dashboard/manager/AddEvent";
import EditEvent from "../pages/dashboard/manager/EditEvent";
import ClubMembers from "../pages/dashboard/manager/ClubMembers";
import EventRegistrations from "../pages/dashboard/manager/EventRegistrations";
import ErrorPage from "../pages/public/ErrorPage";
import DashboardRedirect from "../components/DashboardRedirect";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "clubs",
                element: <Clubs />
            },
            {
                path: "clubs/:id",
                element: <ClubDetails />
            },
            {
                path: "events",
                element: <Events />
            },
            {
                path: "events/:id",
                element: <EventDetails />
            },
        ],
    },
    {
        path: "dashboard",
        element: <DashboardLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <DashboardRedirect />
            },
            {
                path: "my-clubs",
                element: <MemberDashboard />
            },
            {
                path: "profile",
                element: <EditProfile />
            },
            {
                path: "my-events",
                element: <MemberDashboard />
            },
            {
                path: "manager",
                element: <ManagerDashboard />
            },
            {
                path: "manager/clubs",
                element: <ManagerDashboard />
            },
            {
                path: "manager/add-club",
                element: <AddClub />
            },
            {
                path: "manager/edit-club/:id",
                element: <EditClub />
            },
            {
                path: "manager/add-event",
                element: <AddEvent />
            },
            {
                path: "manager/edit-event/:id",
                element: <EditEvent />
            },
            {
                path: "manager/club/:clubId/members",
                element: <ClubMembers />
            },
            {
                path: "manager/event/:eventId/registrations",
                element: <EventRegistrations />
            },
            {
                path: "admin",
                element: <AdminDashboard />
            },
            {
                path: "admin/clubs",
                element: <AdminDashboard />
            },
            {
                path: "admin/club/:clubId/members",
                element: <ClubMembers />
            },
            {
                path: "admin/users",
                element: <AdminDashboard />
            },
            {
                path: "admin/events",
                element: <AdminDashboard />
            },
            {
                path: "admin/payments",
                element: <AdminDashboard />
            }
        ]
    }
]);

export default router;
