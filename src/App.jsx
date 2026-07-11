import { Routes, Route } from "react-router";
import { HomePage } from "./pages/home/homePage";
import { Checkout } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/order/OrdersPage";
import { TrackingPage } from "./pages/tracking/trackingPage";
import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
function App() {
  const [cart, setCart] = useState([]);
  const getCart = async () => {
    const Response = await axios.get("/api/cart-items?expand=product");
    setCart(Response.data);
  };
  useEffect(() => {
    getCart();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<HomePage cart={cart} getCart={getCart} />} />

      <Route
        path="checkout"
        element={<Checkout cart={cart} getCart={getCart} />}
      />
      <Route path="orders" element={<OrdersPage cart={cart} />} />
      <Route path="tracking" element={<TrackingPage />} />
    </Routes>
  );
}

export default App;
