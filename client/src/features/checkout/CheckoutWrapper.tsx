import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51OXlUdCEVVNDFtH1DiqKINEkEpmyATOKaPegLZe2VEcfKx7FRRE1tAOwVbBEW848kjvMKEBfLhWk5rRUbwgEm0ub00UV2EWHoB');

export default function CheckoutWrapper() 
{
    return (

        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>

    )
}