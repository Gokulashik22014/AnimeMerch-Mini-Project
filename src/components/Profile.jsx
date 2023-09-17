import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../config/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {ref,uploadBytes,getDownloadURL} from "firebase/storage"

const Profile = (props) => {
  const navigate = useNavigate();
  const [loading,setLoading]=useState(true)
  const [user, setUser] = useState({
    cart: [],
    email: "",
    userName: "",
    img: "src/images/defaultLogin.png"
  });
  const [isEditing, setEditing] = useState(false);
  const [doneUploading,setDoneUploading]=useState(false)
  const [uploadFile,setUploadFile]=useState(null)
  useEffect(() => {
    async function getData() {
      try {
        const dataDoc = doc(db, "Users", auth?.currentUser?.email);
        const wholeData = await getDoc(dataDoc);
        if (wholeData.exists()) {
          setUser(wholeData.data());
          console.log(wholeData)
        }
        console.log("here"+user)
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [auth?.currentUser?.email]);

  const handleEditClick = () => {
    setEditing(!isEditing);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  useEffect(()=>{
    if(!isEditing&&!loading){
      handleSaveProfile()
    }
  },[isEditing,loading])
  const handleSaveProfile = async () => {
    try {
      const dataDoc = doc(db, "Users", auth?.currentUser?.email);
      await setDoc(dataDoc, {
        cart: user.cart,
        email: user.email,
        userName: user.userName,
        img: user.img
      });
      console.log("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  async function handleFileLoad(event) {
    const file = event.target.files[0];
    
    if (file) {
      setUploadFile(file);
      const fileRef = ref(storage, `${user.email}/profile.png`);
  
      try {
        // Upload the file to Firebase Storage
        const uploadTask = uploadBytes(fileRef, file);
  
        // Get the download URL after the upload is complete
        uploadTask.then(async (snapshot) => {
          const downloadURL = await getDownloadURL(fileRef);
  
          // Update the user state with the new image URL
          setUser((prevUser) => ({ ...prevUser, img: downloadURL }));
  
          // Save the updated profile data to Firestore
          handleSaveProfile();
  
          // Set doneUploading to true to indicate that the upload is complete
          setDoneUploading(true);
  
          console.log("Image uploaded successfully.");
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }
  
  return (
    <div className="flex mt-32 space-x-2 h-[550px]">
      {/* Left Section (1/4 of the page) */}
      <div className="flex flex-col space-y-10 w-1/4 bg-stone-600 p-8 rounded-lg">
        <div className="flex flex-col items-center w-42 h-42">
          <img src={props.profileImg} alt="" className='w-32 h-32 rounded-full bg-gray-300 mx-auto' />
          <div className="relative inline-block">
            <input
              type="file"
              className="absolute w-4 h-4 opacity-0 hidden"
              id="fileInput"
              accept="image/*" // Add your file input change handler
              onChange={handleFileLoad}
            />
            <label
              htmlFor="fileInput"
              className="material-symbols-rounded w-4 h-4 text-white text-center p-1 cursor-pointer"
            >
              Edit
            </label>
          </div>

        </div>
        <h1 className="text-2xl text-center font-semibold mt-4">{user.userName}</h1>
        <p className="text-zinc-900 text-center mt-2">Email: {user.email}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={handleEditClick}>
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </button>
        <button className="flex flex-row justify-center bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>
          <span className="material-symbols-rounded">logout</span> Logout
        </button>
      </div>

      {/* Right Section (3/4 of the page) */}
      <div className={`w-3/4 p-8 bg-dark-blue rounded-lg`}>
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
        <form>
          {Object.entries(user).map(([key, value]) => {
            if(key!=="cart" && key!=="img" && key!="email"){
            return(<div key={key} className="mb-4">
              <label className="block font-semibold">{key}:</label>
              {isEditing ? (
                <input
                  type="text"
                  className="w-full border-gray-300 border rounded p-2"
                  value={value}
                  onChange={handleInputChange}
                  name={key}
                />
              ) : (
                <p className="text-gray-600">{value}</p>
              )}
            </div>)
            }
            })}
        </form>
      </div>
    </div>
  );
};

export default Profile;
