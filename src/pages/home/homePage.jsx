import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import "./HomePage.css";
import { Products } from "./products";
export function HomePage({ cart, getCart }) {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getHome = async () => {
      const Response = await axios.get("/api/products");
      setProducts(Response.data);
    };
    getHome();
  }, []);

  return (
    <>
      <Header cart={cart} />

      <div className="home-page">
        <div className="products-grid">
          {products.map((product) => {
            return (
             <Products key={product.id} getCart={getCart} product={product}/>
            );
          })}
        </div>
      </div>
    </>
  );
}
