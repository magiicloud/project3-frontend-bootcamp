import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { MenuFrame } from "./pages/MenuFrame";
import { Buildings } from "./pages/Buildings";
import { Room } from "./pages/Room";
import { ManageItems } from "./pages/ManageItems";
import { AddNewItem } from "./pages/AddNewItem";
import { AllItems } from "./pages/allitems/page";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/landing" element={<MenuFrame />}>
          {/* Nested routes will render within <MenuFrame /> */}
          <Route path="buildings" element={<Buildings />} />
          <Route path="room" element={<Room />} />
          <Route path="allitems" element={<AllItems />} />
          <Route path="manageitems" element={<ManageItems />} />
          <Route path="addnewitem" element={<AddNewItem />} />
        </Route>
        {/* Redirect to "/landing/allitems" or a default nested route if "/landing" is accessed directly */}
        <Route
          path="/landing"
          element={<Navigate replace to="/landing/allitems" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Login } from "./pages/Login";
// import { Dashboard } from "./pages/Dashboard";
// import { Buildings } from "./pages/Buildings";
// import { Room } from "./pages/Room";
// import { AllItems } from "./pages/AllItems";
// import { ManageItems } from "./pages/ManageItems";
// import { AddNewItem } from "./pages/AddNewItem";
// import { ProtectedRoute } from "./components/ProtectedRoutes";

// const protectedRoutes = [
//   { path: "/dashboard", element: <Dashboard /> },
//   { path: "/buildings", element: <Buildings /> },
//   { path: "/room", element: <Room /> },
//   { path: "/allitems", element: <AllItems /> },
//   { path: "/manageitems", element: <ManageItems /> },
//   { path: "/addnewitem", element: <AddNewItem /> },
// ];

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         {protectedRoutes.map(({ path, element }) => (
//           <Route
//             key={path}
//             path={path}
//             element={<ProtectedRoute>{element}</ProtectedRoute>}
//           />
//         ))}
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;
