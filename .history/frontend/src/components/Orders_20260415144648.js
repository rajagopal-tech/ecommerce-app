import { useEffect,useState } from "react";
import ".../orders.css"

function Orders(){
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    const savedOrders = JSON.parse(localStorage.getItem(""))
  })
}