import React from 'react'
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from 'react';

const StipeCardForm = ({ setIsUserData, setDataWithPaymentInfo, dataWithPaymentInfo }) => {
    const [isSpinner, setIsSpinner] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            console.log("[error]", error);
        } else {
            setIsSpinner(true);
            console.log("[PaymentMethod]", paymentMethod);
            setIsUserData(true);
            setDataWithPaymentInfo({
                ...dataWithPaymentInfo,
                paymentMethod
            })
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button className="btn btn-primary mt-4" type="submit" disabled={!stripe}>
                Continure
            </button>

            {isSpinner && (
                <div class="spinner-grow" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            )}
        </form>
    );
};
export default StipeCardForm
