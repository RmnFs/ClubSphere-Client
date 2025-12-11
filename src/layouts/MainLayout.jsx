import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
    return (
        <div className="font-sans antialiased text-base-content bg-base-100 min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
