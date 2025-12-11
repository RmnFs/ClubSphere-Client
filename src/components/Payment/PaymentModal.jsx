import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import PropTypes from 'prop-types';

// TODO: Replace  your actual publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ isOpen, onClose, paymentInfo, onSuccess }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-base-100 p-6 rounded-xl shadow-xl w-full max-w-lg relative">
                <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h2 className="text-2xl font-bold mb-6 text-center">Complete Payment</h2>

                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        paymentInfo={paymentInfo}
                        onSuccess={onSuccess}
                        onClose={onClose}
                    />
                </Elements>
            </div>
        </div>
    );
};

PaymentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    paymentInfo: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default PaymentModal;
