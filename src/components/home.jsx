import { useEffect, useState } from "react";
import Card from "./card";
import {auth, db } from "../config/firebase";
import { collection, getDocs,setDoc,doc,getDoc } from "firebase/firestore";

function Home(props) {
  const items = ["KeyChain", "Shirt", "Shoe"];
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsLoading(true), 1000);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const updatedCartList = {}; // Create a new object to avoid state mutation
        await Promise.all(
          items.map(async (name) => {
            const coll = collection(db, name);
            const data = await getDocs(coll);
            updatedCartList[name] = data.docs.map((val) => ({ ...val.data(),id:val.id}));
          })
        );
        setCartList(updatedCartList);
      } catch (error) {
        console.log(error);
      }
    };

    //console.log("ran");
    if(search==""){
        getData();
        setDisplayCard(items.map((name) => {
            if (cartList[name]) {
            const datas = cartList[name];
            const data = [...datas];
            return data.map((d) => (
                <Card key={d.id} {...d} addToCart={addToCart} />
            ));
            }
            return null; // Handle the case when cartList[name] is not available yet
        }))
    }
    
  }, [isLoading,search]);
    
  
  const [cartList, setCartList] = useState({});
  const [cart,setCart]=useState([])
  //console.log(search);

  function addToCart(id,catog) {
    props.setCartVal((old) => old + 1);
    setCart((oldCart) => {
      //console.log("CartValue"+oldCart[0].cat)
      const data={id:id,cat:catog}
      console.log(data)
      return [...oldCart,data]
    });
    
  }
  useEffect(()=>{
    const loadCart = async () => {
        try {
          const dataDoc = doc(db, "Users", auth?.currentUser?.email);
          const data = await getDoc(dataDoc);
          console.log({ cart: [...cart], ...data.data() });
          await setDoc(dataDoc, { ...data.data(), cart: [...cart] }); // Update 'cart' field
          console.log("Document updated successfully.");
        } catch (error) {
          console.log(error);
        }
      }
    if(cart.length>0)
    loadCart()
  },[cart])
  function findAndDisplay(){ 
        if (cartList[search]) {
          const datas = cartList[search];
          const data = [...datas];
          setDisplayCard(data.map((d) => (
            <Card key={d.id} {...d} addToCart={addToCart} />
          )))
        }
        return null; // Handle the case when cartList[name] is not available yet
    }
  const [displayCard,setDisplayCard]=useState()
  
  return (
    <div className="flex my-3 flex-col items-center min-h-screen">
      <div className="mt-24 flex items-center justify-center">
        <div className="flex items-center justify-center w-[700px]">
          <input
            className="text-black text-1xl rounded-full px-6 py-1 w-[600px]"
            placeholder="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={findAndDisplay} className="material-symbols-rounded cursor-default px-2 text-white">
            search
          </button>
        </div>
      </div>
      <div className="flex flex-row flex-wrap my-24 w-[1000px]">
        {isLoading && displayCard}
      </div>
    </div>
  );
}

export default Home;
