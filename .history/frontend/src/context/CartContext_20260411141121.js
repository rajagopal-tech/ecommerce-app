import { Children, createContext , useEffect , useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({Children}) =>{
    const [cart , setCart] = useState([]);
    useEffect(()=>{
        const savedCart = JSON.parse
    })
}