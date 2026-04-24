import { Children, createContext , useEffect , useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({Children}) =>{
    const [cart , setCart] = useState([]);
 
 //load from localstorage
    useEffect(()=>{
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [] ;
        setCart(savedCart);
    }, []);
// save to localstorage
useEffect(()=>{
    localStorage.setItem("cart",JSON.stringify(cart));
},[cart]);

    return(
        <CartContext.Provider value={}
    )
}



