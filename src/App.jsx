import { Routes, Route } from "react-router";
import { HomePage } from "./pages/homePage";
import { Checkout } from "./pages/checkout/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { Tracking } from "./pages/TrackingPage";
import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
function App() {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    axios.get("/api/cart-items?expand=product").then((Response) => {
      setCart(Response.data);
    });
  }, []);
  return (
    <Routes>
      <Route path="/" element={<HomePage  cart={cart}/>} />

      <Route path="checkout" element={<Checkout  cart={cart}/>} />
      <Route path="orders" element={<OrdersPage />} />
      <Route path="tracking" element={<Tracking />} />
    </Routes>
  );
}

export default App;
