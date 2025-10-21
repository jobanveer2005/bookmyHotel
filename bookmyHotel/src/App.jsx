import { Routes, Route, useLocation } from "react-router-dom";
import './index.css';
import Homepage from "./Components/Homepage";
import Booking from "./Components/Pages/Booking";
import Login from "./Components/Pages/Login";
import ExploreRooms from "./Components/Pages/ExploreRooms";
import Signup from "./Components/Pages/Signup";
import ForgotPassword from "./Components/Pages/ForgotPassword";
import PageFade from "./Components/PageFade";
// import Settings from "./Components/Pages/Settings"; // <-- REMOVED
import ResetPassword from "./Components/Pages/ResetPassword";
import { AlertProvider } from "./Components/AlertProvider";

function App() {
  const location = useLocation();
  return (
    <AlertProvider>
      <PageFade key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Homepage />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<ExploreRooms />} />
          {/* <Route path="/settings" element={<Settings />} /> */} {/* <-- REMOVED */}
        </Routes>
      </PageFade>
    </AlertProvider>
  );
}

export default App;