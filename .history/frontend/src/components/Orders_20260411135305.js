import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userId = "123"; // same as above

    axios.get(`http://localhost:5000/api/orders/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map(order => (
        <div key={order._id}>
          <h3>Total: ₹{order.totalPrice}</h3>

          {order.products.map((p, i) => (
            <p key={i}>{p.name} - ₹{p.price}</p>
          ))}

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Orders;