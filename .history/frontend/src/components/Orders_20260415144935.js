import { useEffect,useState } from "react";
import ".../orders.css"

function Orders(){
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  return(
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.length===0?(
        <p className="empty"
      )}
    </div>
  )
}