import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "./config/firebase";

import Login from "./components/login";
import Home from "./components/home";
import CartPage from "./components/cartPage";
import NavBar from "./components/navbar";
import Profile from "./components/Profile";

export default function App() {
  const [cartVal, setCartVal] = useState(0);
  const [profileImg, setProfileImg] = useState(null);

  useEffect(() => {
    // Define a reference to the Firestore document you want to monitor
    const dataDocRef = doc(db, "Users", auth?.currentUser?.email);

    // Set up a real-time listener using onSnapshot
    const unsubscribe = onSnapshot(dataDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        // Extract the data from the document
        const data = docSnapshot.data();

        // Update your state variables based on the changes
        setProfileImg(data.img);
        setCartVal(data.cart.length);
      }
    });

    return () => {
      // Unsubscribe from the real-time listener when the component unmounts
      unsubscribe();
    };
  }, []);

  const [user, setUser] = useState(false);

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unSubscribe();
  }, []);

  return (
    <div>
      <Router>
        {user && <NavBar cartVal={cartVal} profileImg={profileImg} />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home setCartVal={setCartVal} />} />
          <Route path="/cartPage" element={<CartPage setCartVal={setCartVal} />} />
          <Route path="/Profile" element={<Profile profileImg={profileImg} />} />
        </Routes>
      </Router>
    </div>
  );
}
