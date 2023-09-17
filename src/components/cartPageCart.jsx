import {useState,useEffect} from "react"

import { auth,db } from "../config/firebase";
import {doc,getDoc,updateDoc} from "firebase/firestore"
function Star(){
    return(
        <span className="material-symbols-rounded" >grade</span>
    )
}

export function CartPageCart(props) {
    
    const stars=Array(props.data.rating).fill(null)
    
    

    return (
      <div className="flex flex-row overflow-x-auto space-y-3 mx-1 my-5 px-2 py-2 text-black rounded-lg w-full h-[430px] ">

        <div className="w-2/4">
          <img src={props.data.img} alt="loading" className="w-full h-full" />
        </div>
        <div className="flex flex-col  justify-between mx-1 my-5 px-2 py-2 text-black rounded-lg bg-zinc-50 w-[300px]">
          <div className="flex flex-col space-y-6 w-3/4">
            
            <h1 className="text-5xl text-center">{props.data.name}</h1>
            
            <div className="flex items-center ">
              <p>Rating</p>
              <span className="ml-2">
                {stars.map((e) => (
                  <Star count={e} />
                ))}
              </span>
            </div>
              <p>Cost:<span className="material-symbols-rounded text-sm">currency_rupee{props.data.cost}</span></p>
              <div>
                  <h1 className="text-3xl">Descrition:</h1>
                  <p>This is the {props.data.name}</p>
              </div>
              <div className="flex flex-row space-x-2 ">
                  <label>QTY:</label>
                  <input type="number" className="text-1xl text-center border border-solid border-stone-600 w-[100px]" placeholder="1"/>
              </div>
                  
          </div>
        </div>
      </div>
      
    );
  }
  
  