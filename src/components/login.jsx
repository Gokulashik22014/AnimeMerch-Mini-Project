  import {useState} from "react"
  import { useNavigate } from "react-router-dom"
  //authentication
  import {auth} from "../config/firebase" 
  import { createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth"
  //firestore
  import { db } from "../config/firebase"
  import {collection, doc,setDoc} from "firebase/firestore"
  

  function Login() {

      //firebasestore
      const Users=collection(db,"Users")


      const toHome=useNavigate()//declaring the navigation
      
      const [loginData,setLoginData]=useState({
          email:"",
          pass:""
      })
      
      const login=async ()=>{
        let isLog=false
          try{
              await signInWithEmailAndPassword(auth,loginData.email,loginData.pass)
              isLog=true
          }
          catch(error){
              console.log(error)
          }
          if(isLog){
            toHome("/home")//say when and where to navigate
          }
      }
      const signUp=async ()=>{
        try{
          await createUserWithEmailAndPassword(auth,loginData.email,loginData.pass)
          const docData=doc(db,"Users",loginData.email)
          await setDoc(docData,{cart:[],email:loginData.email,userName:(loginData.email.slice(0,5)),img:"src/images/defaultLogin.png"})
          console.log("written")
        }
        catch(error){
          console.log(error)
        }
      }
      console.log(auth?.currentUser?.email)

      function updateInfo(){
          const {name,value}=event.target//remember to use{} and not []
          setLoginData(oldData=>({...oldData,[name]:value}))
      }
      return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-900">
          <div className="w-[1440px] h-[1024px] flex flex-col items-center  my-24  text-left text-11xl text-black font-inter">
            <div className="w-[700px] h-[600px] flex flex-col items-center space-y-7 justify-center border border-dashed rounded-lg [background-color:#171010]">
              <p className="text-white text-3xl">Login</p>
              <div className="relative">
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 material-symbols-rounded" >
                mail
              </span>
              
              <input className="w-[400px] h-[60px] rounded-full px-14" 
                  type="text" 
                  placeholder="Eamil"
                  name="email"
                  onChange={updateInfo}
                  value={loginData.email}
              />
              </div>
              <div className="relative">
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 material-symbols-rounded" >
                key
              </span>
              <input className="w-[400px] h-[60px] rounded-full px-14" 
                  type="password" 
                  placeholder="Password"
                  name="pass"
                  onChange={updateInfo}//onChange loosu not onLoad
                  value={loginData.pass}
              />
              </div>
              <button className="w-[200px] h-[60px] rounded-full text-white border border-dashed hover:bg-zinc-50 hover:text-zinc-900" 
                  onClick={login}    
              >Login</button>
              <hr className="border-t border-white w-4/6" />
              <p className="text-white">Dont have a account?   <span  onClick={signUp} className="cursor-pointer">sign in?</span></p>
            
            </div>
          </div>
        </div>
      );
    }
    
    export default Login;
    