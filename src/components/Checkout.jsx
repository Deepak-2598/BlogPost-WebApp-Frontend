import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import '../styles/Checkout.css';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLIC_KEY');

const Checkout = ({ amount, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error('Payment error:', error);
            onError(error);
        } else {
            try {
                const response = await axios.post('http://localhost:5000/payment', {
                    paymentMethodId: paymentMethod.id,
                    amount,
                });

                if (response.data.success) {
                    onSuccess();
                } else {
                    onError(new Error('Payment failed'));
                }
            } catch (err) {
                console.error('Error processing payment:', err);
                onError(err);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Payment Details</h2>
            <div className="form-group">
                <label>Card Details</label>
                <CardElement options={{ 
                    style: {
                        base: {
                            fontSize: '16px',
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                        },
                        invalid: {
                            color: '#fa755a',
                            iconColor: '#fa755a',
                        },
                    },
                }} />
            </div>
            <div className="form-group">
                <label>Card Holder's Name</label>
                <input type='text' placeholder='John Doe' className="input-field" />
            </div>
            <div className="form-group">
                <label>Country</label>
                <input type='text' placeholder='United States' className="input-field" />
            </div>
            <button type="submit" disabled={!stripe} className="pay-button">Pay</button>
        </form>
    );
};

const WrappedCheckout = ({ amount, onSuccess, onError }) => (
    <Elements stripe={stripePromise}>
        <Checkout amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
);

export default WrappedCheckout;
