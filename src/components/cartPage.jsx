import { useEffect, useState } from "react";
import { CartPageCart } from "./cartPageCart";
import { auth, db } from "../config/firebase";
import { doc, getDoc,updateDoc } from "firebase/firestore";

function CartPage(props) {
  const [items, setItems] = useState([]);
  const [cost, setCost] = useState(0); // Initialize cost state

  const remove = async (id) => {
    try {
      const dataDoc = doc(db, "Users", auth?.currentUser?.email);
      const data = await getDoc(dataDoc);
      const newCart = data.data().cart.filter((value) => value.id !== id);
      const newData = { ...data.data(), cart: newCart };
      await updateDoc(dataDoc, newData);

      const newItems = [];
      await Promise.all(
        newCart.map(async (value) => {
          const loadingCart = doc(db, value.cat, value.id);
          const lData = await getDoc(loadingCart);
          const newData = { data: lData.data(), id: value.id };
          newItems.push(newData);
        })
      );
      setItems(newItems);

      // Recalculate the cost after removing an item
      const newCost = newItems.reduce(
        (totalCost, item) => totalCost + item.data.cost, // Assuming the cost is stored in item.data.cost
        0
      );
      setCost(newCost);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    props.setCartVal(0);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dataDoc = doc(db, "Users", auth?.currentUser?.email);
        const data = await getDoc(dataDoc);
        const cart = data.data().cart;

        const newItems = [];
        await Promise.all(
          cart.map(async (value) => {
            const loadingCart = doc(db, value.cat, value.id);
            const lData = await getDoc(loadingCart);
            const newData = { data: lData.data(), id: value.id };
            newItems.push(newData);
          })
        );
        setItems(newItems);

        // Calculate the initial cost when loading the cart
        const initialCost = newItems.reduce(
          (totalCost, item) => totalCost + item.data.cost, // Assuming the cost is stored in item.data.cost
          0
        );
        setCost(initialCost);
      } catch (error) {
        console.log(error);
      }
    };
    if (auth?.currentUser?.email) {
      loadData();
    }
  }, [auth?.currentUser?.email]);

  return (
    <div className="flex flex-col my-[120px] mx-[250px] text-white w-[1000px]">
      <h1 className="text-2xl text-center">Your Cart</h1>
      <div>
        {items.length > 0 ? (
          items.map((data) => (
            <div className="bg-zinc-50 rounded-lg w-full bg-zinc-50" key={data.id}>
              <CartPageCart {...data} />
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <span>Qty: {data.quantity}</span>
                  <button
                    onClick={() => remove(data.id)}
                    className="text-white bg-zinc-900 rounded-full px-1 py-1 mx-3 my-3 w-[200px]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h1>Your cart is EMPTY</h1>
        )}
        <div className="flex flex-row items-center justify-center space-x-24 text-center mt-24 text-zinc-900 bg-zinc-50 py-4 rounded-full">
          <h2>Total Cost:<span className="material-symbols-rounded text-sm">currency_rupee</span>{cost.toFixed(2)}</h2>
          <button className="text-lg bg-lime-500 rounded-full py-2 px-2">Purchase</button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
