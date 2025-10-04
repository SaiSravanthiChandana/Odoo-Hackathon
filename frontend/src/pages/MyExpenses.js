// import React, { useEffect, useState } from "react";
// import API from "../services/api";

// function MyExpenses() {
//   const [expenses, setExpenses] = useState([]);

//   useEffect(() => {
//     API.get("/expenses/my").then((res) => setExpenses(res.data));
//   }, []);

//   return (
//     <table border="1">
//       <thead>
//         <tr>
//           <th>Amount</th>
//           <th>Category</th>
//           <th>Description</th>
//           <th>Date</th>
//           <th>Status</th>
//           <th>Receipt</th>
//         </tr>
//       </thead>
//       <tbody>
//         {expenses.map((e) => (
//           <tr key={e._id}>
//             <td>{e.amount}</td>
//             <td>{e.category}</td>
//             <td>{e.description}</td>
//             <td>{new Date(e.date).toLocaleDateString()}</td>
//             <td>{e.status}</td>
//             <td>
//               {e.receipt && (
//                 <a href={`http://localhost:5000/${e.receipt}`} target="_blank">
//                   View Receipt
//                 </a>
//               )}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// export default MyExpenses;




import React, { useEffect, useState } from "react";
import { getExpenses } from "../services/api";

function MyExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    getExpenses(token)
      .then(res => setExpenses(res.data))
      .catch(err => setError(err.response?.data?.message || "Failed to fetch expenses"));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Expenses</h2>
      {error && <p style={{color:"red"}}>{error}</p>}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Currency</th>
            <th>Category</th>
            <th>Description</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((e) => (
              <tr key={e._id}>
                <td>{e.amount}</td>
                <td>{e.currency}</td>
                <td>{e.category}</td>
                <td>{e.description}</td>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No expenses found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyExpenses;
