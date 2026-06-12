import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/components_lite/Navbar";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import VerifyEmail from "./components/authentication/VerifyEmail";
import ForgotPassword from "./components/authentication/ForgotPassword";
import VerifyOTP from "./components/authentication/VerifyOTP";
import ResetPassword from "./components/authentication/ResetPassword";
import Home from "./components/components_lite/Home";
import Jobs from "./components/components_lite/Jobs";
import Browse from "./components/components_lite/Browse";
import Profile from "./components/components_lite/Profile";
import SavedJobs from "./components/components_lite/SavedJobs";
import About from "./components/components_lite/About";
import Description from "./components/components_lite/Description";
import Companies from "./components/admincomponent/Companies";
import CompanyCreate from "./components/admincomponent/CompanyCreate";
import CompanySetup from "./components/admincomponent/CompanySetup";
import AdminJobs from "./components/admincomponent/AdminJobs";
import PostJob from "./components/admincomponent/PostJob";
import Applicants from "./components/admincomponent/Applicants";
import ProtectedRoute from "./components/admincomponent/ProtectedRoute";
import RecruiterDashboard from "./components/admincomponent/RecruiterDashboard";
import Chatbot from "./components/ui/Chatbot";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/Jobs",
    element: <Jobs />,
  },
  {
    path: "/Browse",
    element: <Browse />,
  },
  {
    path: "/About",
    element: <About />,
  },
  {
    path: "/Profile",
    element: <Profile />,
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />,
  },
  {
    path: "/description/:id",
    element: <Description />,
  },
  // Admin Routes
  {
    path: "/admin/dashboard",
    element: <ProtectedRoute><RecruiterDashboard /></ProtectedRoute>,
  },
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>,
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>,
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
      <Chatbot />
    </div>
  );
}

export default App;
