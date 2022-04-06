import React from "react";
import { useContext } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";
import useHttp from "../../hooks/use-http";

const Cart = (props) => {
  const cartCTX = useContext(CartContext);
  const cartAmount = `$${cartCTX.totalAmount.toFixed(2)}`;
  const hasItems = cartCTX.items.length > 0;
  const [showOrderForm, setShowOrderForm] = React.useState(false);
  const { isLoading, isSubmited, error, sendRequest: postData } = useHttp();

  const cartItemRemoveHandler = (id) => {
    cartCTX.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCTX.addItem({ ...item, amount: 1 });
  };

  const orderHandler = () => {
    setShowOrderForm(true);
  };

  const submitOrderHandler = (userData) => {
    const processResponse = (data) => {
      console.log(data);
    };

    postData(
      {
        url: "https://react-http-9f5a0-default-rtdb.europe-west1.firebasedatabase.app/orders.json",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          user: userData,
          orderedItems: cartCTX.items,
        },
      },
      processResponse
    );

    cartCTX.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCTX.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  let cartModalcontent = (
    <React.Fragment>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{cartAmount}</span>
      </div>
      {showOrderForm && (
        <Checkout onCancel={props.onClose} onSubmit={submitOrderHandler} />
      )}
      {!showOrderForm && (
        <div className={classes.actions}>
          <button className={classes["button-alt"]} onClick={props.onClose}>
            Close
          </button>
          {hasItems && (
            <button className={classes.button} onClick={orderHandler}>
              Order
            </button>
          )}
        </div>
      )}
    </React.Fragment>
  );

  if (isLoading) {
    cartModalcontent = <p>Sending order data....</p>;
  }
  if (isSubmited) {
    cartModalcontent = <p>Order sent successfully.</p>;
  }
  if (error) {
    cartModalcontent = <p>Something went wrong. Contact administrator.</p>;
  }

  return <Modal onClose={props.onClose}>{cartModalcontent}</Modal>;
};

export default Cart;
