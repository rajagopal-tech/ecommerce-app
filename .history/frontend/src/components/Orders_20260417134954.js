import { useEffect,useState } from "react";
import "../orders.css"

function Orders(){
  const [orders, setOrders] = useState([]);
  
import axios from "axios";

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: token
          }
        }
      );

      setOrders(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  fetchOrders();
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
              {order.items.map(item =>(
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name}/>
                  <div>
                    <h4>{item.name}</h4>
                    <p>₹{item.price} x {item.qty}</p>
                  </div>
                  </div>
              ))}
            </div>
            <h3 className="order-total">Total: ₹{order.total}</h3>
              </div>
        ))
      )}
    </div>
  );
}

export default Orders;