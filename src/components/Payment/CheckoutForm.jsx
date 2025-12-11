import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';

const CheckoutForm = ({ paymentInfo, onSuccess, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (paymentInfo.amount > 0) {
            api.post('/payments/create-intent', {
                amount: paymentInfo.amount,
                type: paymentInfo.type,
                clubId: paymentInfo.clubId,
                eventId: paymentInfo.eventId
            })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => console.error("Error creating payment intent", err));
        }
    }, [paymentInfo]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const card = elements.getElement(CardElement);
        if (card === null) {
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (error) {
            console.log('[error]', error);
            setCardError(error.message);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            setCardError('');
        }

        setProcessing(true);

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: paymentInfo?.userName || 'Anonymous',
                        email: paymentInfo?.userEmail || 'anonymous@example.com'
                    },
                },
            },
        );

        if (confirmError) {
            console.log(confirmError);
            setCardError(confirmError.message);
            setProcessing(false);
        } else {
            console.log('payment intent', paymentIntent);
            if (paymentIntent.status === 'succeeded') {
                // Save payment info to database
                const paymentData = {
                    paymentIntentId: paymentIntent.id,
                    amount: paymentInfo.amount,
                    type: paymentInfo.type,
                    clubId: paymentInfo.clubId,
                    eventId: paymentInfo.eventId
                }

                try {
                    const res = await api.post('/payments/confirm', paymentData);
                    if (res.data) {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Payment Successful',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        onSuccess(paymentIntent.id);
                    }
                } catch (err) {
                    console.error("Error confirming payment on backend", err);
                    setCardError("Payment succeeded but failed to record. Please contact support.");
                }
                setProcessing(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4">
            <h3 className="text-xl font-bold mb-4 text-center">Pay ${paymentInfo.amount}</h3>
            <div className="border p-4 rounded-lg bg-white shadow-sm mb-4">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            {cardError && <p className="text-red-500 text-sm mb-4">{cardError}</p>}

            <div className="flex gap-4 justify-end">
                <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={onClose}
                    disabled={processing}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={!stripe || !clientSecret || processing}
                >
                    {processing ? <span className="loading loading-spinner loading-xs"></span> : `Pay $${paymentInfo.amount}`}
                </button>
            </div>
        </form>
    );
};

CheckoutForm.propTypes = {
    paymentInfo: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default CheckoutForm;
