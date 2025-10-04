// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import MyExpenses from "./pages/MyExpenses";

// function App() {
//   const isLoggedIn = !!localStorage.getItem("token");

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route
//           path="/my-expenses"
//           element={isLoggedIn ? <MyExpenses /> : <Navigate to="/login" />}
//         />
//         <Route path="*" element={<Navigate to="/login" />} /> {/* default fallback */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;






import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MyExpenses from "./pages/MyExpenses";

function App() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/my-expenses"
          element={isLoggedIn ? <MyExpenses /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
