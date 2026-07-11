import "./CheckoutPage.css";
import { CheckoutHeader } from "./CheckoutHeader";
import axios from "axios";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
export function Checkout({ cart, getCart }) {
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);
  useEffect(() => {
    const fetchCheckoutData = async () => {
      let Response = await axios.get(
        "/api/delivery-options?expand=estimatedDeliveryTime",
      );
      setDeliveryOptions(Response.data);
    };
    fetchCheckoutData();
  }, []);

  useEffect(() => {
    const payment = async () => {
      const response = await axios.get("/api/payment-summary");
      setPaymentSummary(response.data);
    };
    payment();
  }, [cart]);
  return (
    <>
      <title>Checkout</title>
      <CheckoutHeader />
      <div className="checkout-page">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary">
            {deliveryOptions.length > 0 &&
              cart.map((cartItem) => {
                let selectedDeliveryOption = deliveryOptions.find(
                  (deliveryOption) => {
                    return deliveryOption.id === cartItem.deliveryOptionId;
                  },
                );
                const deleteCartItem = async () => {
                  await axios.delete(`/api/cart-items/${cartItem.productId}`);
                  await getCart();
                };
                const updateCartItem = async () => {
                  await axios.put(`/api/cart-items/${cartItem.productId}`);
                };
                return (
                  <div key={cartItem.productId} className="cart-item-container">
                    <div className="delivery-date">
                      Delivery date:
                      {dayjs(
                        selectedDeliveryOption.estimatedDeliveryTimeMs,
                      ).format("dddd,MMMM,D")}
                    </div>

                    <div className="cart-item-details-grid">
                      <img
                        className="product-image"
                        src={cartItem.product.image}
                      />

                      <div className="cart-item-details">
                        <div className="product-name">
                          {cartItem.product.name}
                        </div>
                        <div className="product-price">
                          ${(cartItem.product.priceCents / 100).toFixed(2)}
                        </div>
                        <div className="product-quantity">
                          <span>
                            Quantity:{" "}
                            <span className="quantity-label">
                              {cartItem.quantity}
                            </span>
                          </span>
                          <span
                            className="update-quantity-link link-primary"
                            onClick={updateCartItem}
                          >
                            Update
                          </span>
                          <span
                            className="delete-quantity-link link-primary"
                            onClick={deleteCartItem}
                          >
                            Delete
                          </span>
                        </div>
                      </div>

                      <div className="delivery-options">
                        <div className="delivery-options-title">
                          Choose a delivery option:
                        </div>
                        {deliveryOptions.map((deliveryOption) => {
                          let priceString = "Free Shipping ";
                          if (deliveryOption.priceCents > 0) {
                            priceString = `${(deliveryOption.priceCents / 100).toFixed(2)}-Shipping`;
                          }
                          const updateDeliveryOption = async () => {
                            await axios.put(
                              `/api/cart-items/${cartItem.productId}`,
                              {
                                deliveryOptionId: deliveryOption.id,
                              },
                            );
                            await getCart();
                          };
                          return (
                            <div
                              key={deliveryOption.id}
                              className="delivery-option"
                              onClick={updateDeliveryOption}
                            >
                              <input
                                type="radio"
                                checked={
                                  deliveryOption.id ===
                                  cartItem.deliveryOptionId
                                }
                                onChange={() => {}}
                                className="delivery-option-input"
                                name={`delivery-option-${cartItem.productId}`}
                              />
                              <div>
                                <div className="delivery-option-date">
                                  {dayjs(
                                    deliveryOption.estimatedDeliveryTimeMs,
                                  ).format("dddd, MMMM,D")}
                                </div>
                                <div className="delivery-option-price">
                                  {priceString}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="payment-summary">
            <div className="payment-summary-title">Payment Summary</div>
            {paymentSummary && (
              <>
                <div className="payment-summary-row">
                  <div>Items ({paymentSummary.totalItems}):</div>
                  <div className="payment-summary-money">
                    ${(paymentSummary.productCostCents / 100).toFixed(2)}
                  </div>
                </div>

                <div className="payment-summary-row">
                  <div>Shipping &amp; handling:</div>
                  <div className="payment-summary-money">
                    ${(paymentSummary.shippingCostCents / 100).toFixed(2)}
                  </div>
                </div>

                <div className="payment-summary-row subtotal-row">
                  <div>Total before tax:</div>
                  <div className="payment-summary-money">
                    ${(paymentSummary.totalCostBeforeTaxCents / 100).toFixed(2)}
                  </div>
                </div>

                <div className="payment-summary-row">
                  <div>Estimated tax (10%):</div>
                  <div className="payment-summary-money">
                    ${(paymentSummary.taxCents / 100).toFixed(2)}
                  </div>
                </div>

                <div className="payment-summary-row total-row">
                  <div>Order total:</div>
                  <div className="payment-summary-money">
                    ${(paymentSummary.totalCostCents / 100).toFixed(2)}
                  </div>
                </div>

                <button className="place-order-button button-primary">
                  Place your order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
