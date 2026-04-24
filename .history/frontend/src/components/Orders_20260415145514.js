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
        <p className="empty">No orders Yet  😔 </p>
      ):(
        orders.map(order =>(
          <div key={order.id} className="order-card">
            <div className="order-header">
              <p><strong>Order Id:</strong>{order.id}</p>
              <p><strong>Date:</strong>{order.date}</p>
            </div>

            <div className="order-items">
              {order.items.map(item)}
            </div>
        ))
      )}
    </div>
  )
}