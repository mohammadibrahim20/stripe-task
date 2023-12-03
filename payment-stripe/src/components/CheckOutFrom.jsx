import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const CheckOutFrom = () => {
  const [name, setName] = useState("test");
  const [email, setEmail] = useState("example@mail.com");
  const [price, setPrice] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const cart = {
    name,
    quantity: parseInt(quantity),
    price: parseInt(price),
    email,
  };
  console.log(cart);
  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51NEXj4G65CnbWJkOYvtYi5qysCY146nNz9c77rP9O8sg6luZ7UjeyAKHHSGof6LggjELyPsIFg7GjNREqchoFqPh008F9ttHSM"
    );

    const response = await fetch(
      "http://localhost:5000/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cart),
      }
    );
    const session = await response.json();
    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <div className="px-2">
      <div className="w-full max-w-sm mx-auto py-4 bg-gray-200 my-4 px-4 shadow-xl rounded-xl">
        <h1 className="text-center text-xl text-gray-700 font-semibold">
          Add Products
        </h1>
        <div className="flex py-2">
          <span className="flex items-center justify-center border border-gray-400 border-r-0 py-2 px-3 text-gray-700 w-28">
            Email
          </span>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-400 p-2 focus:outline-none"
            type="email"
            placeholder="example@example.com"
            defaultValue={email}
            required
          />
        </div>
        <div className="flex py-2">
          <span className="flex items-center justify-center border border-gray-400 border-r-0 py-2 px-3 text-gray-700 w-28">
            Name
          </span>
          <input
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-400 p-2 focus:outline-none"
            type="text"
            placeholder="Product name"
            defaultValue={name}
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex py-2">
            <span className="flex items-center justify-center border border-gray-400 border-r-0 py-2 px-3 text-gray-700">
              Quantity
            </span>
            <input
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-400 p-2 focus:outline-none"
              type="number"
              placeholder="Quantity"
              defaultValue={1}
              required
            />
          </div>
          <div className="flex py-2">
            <span className="flex items-center justify-center border border-gray-400 border-r-0 py-2 px-3 text-gray-700">
              Price
            </span>
            <input
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-400 p-2 focus:outline-none"
              type="number"
              placeholder="Price"
              defaultValue={1}
              required
            />
          </div>
        </div>
      </div>

      <button
        onClick={makePayment}
        className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
      >
        CheckOut
      </button>
    </div>
  );
};

export default CheckOutFrom;
