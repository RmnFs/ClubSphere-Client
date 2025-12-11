import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page" className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-4xl font-bold mt-4">Page Not Found</h2>
            <p className="py-6 text-xl">The page you are looking for does not exist or has been moved.</p>
            <p className="text-base-content/60 italic mb-8">
                {error?.statusText || error?.message}
            </p>
            <Link to="/" className="btn btn-primary btn-wide">Back to Home</Link>
        </div>
    );
};

export default ErrorPage;
