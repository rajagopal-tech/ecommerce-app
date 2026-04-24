import { createContext , useEffect , useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({children}) =>{
    const [cart , setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
 
 //load from localstorage
    useEffect(()=>{
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [] ;
        setCart(savedCart);
    }, []);
// save to localstorage
useEffect(()=>{
    localStorage.setItem("cart",JSON.stringify(cart));
},[cart]);

    const toggleCart = () => setIsCartOpen(!isCartOpen);

    return(
        <CartContext.Provider value={{cart, setCart, isCartOpen, setIsCartOpen, toggleCart}}>
            {children}
        </CartContext.Provider>
    );
};



