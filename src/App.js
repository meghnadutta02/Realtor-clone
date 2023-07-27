import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditListing from "./pages/EditListing";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import ProtectedComponent from "./components/ProtectedComponent";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Category from "./pages/Category";
function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/category/:type/:id" element={<Listing/>}/>
          <Route path="/offers" element={<Offers />} />
          <Route path="/category/:type" element={<Category />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route element={<ProtectedComponent/>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing/>}/>
          <Route path="/edit-listing/:id" element={<EditListing/>}/>
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        
      />
    </div>
  );
}

export default App;
