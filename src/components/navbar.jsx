import { useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
//firebase 
import {db,auth} from "../config/firebase"
import {getDoc,doc} from "firebase/firestore"



export default function NavBar(props){
    
    //navigation to cart page 
    const toCartPage=useNavigate();
    //navugation to home page
    const toHome=useNavigate()
    //navigation to user Profile
    const toProfile=useNavigate()
    
    return(
        <nav className="flex flex-row items-center justify-between space-x-96 bg-zinc-900 w-full h-[100px] rounded-2xl fixed top-0 z-10">
                <h1 className="text-white text-5xl px-14">AniMer</h1>
                <div className="flex px-5 mx-5 items-center flex-row space-x-12">
                    <button onClick={()=>toHome("/home")} className="flex flex-row text-2xl text-white">Home</button>
                    <div className="flex flex-row">
                        <button className="flex flex-row text-2xl text-white material-symbols-rounded" onClick={()=>toCartPage("/cartPage")}>shopping_cart<sub><span className={`text-[10px] flex items-center justify-center bg-red-600 w-5 h-5 rounded-full ${props.cartVal?"block":"hidden"}`}>{props.cartVal}</span></sub> <h1 className="text-white text-[15px]">Cart</h1></button>
        
                    </div>
                    <button className="text-white text-5xl material-symbols-rounded" onClick={()=>toProfile("/Profile")}>{props.profileImg?<img className="w-[70px] h-[70px] rounded-full" src={props.profileImg} alt="loading"/>:"account_circle"}</button>
                </div>
        </nav>
    )
}