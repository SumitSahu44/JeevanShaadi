import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Faq from './Faq'
import Footer from '../Components/Footer'
import Gallery from './Gallery'
import Hero from './Hero'
import HowitWorks from './HowitWorks'
import PersonalizedMatch from './PersonalizedMatch'
import Match from './Match'
import WhyChoose from './WhyChoose' 

import Testimonials from './Testimonials'
import FixedBackgroundHero from './FixedBackground'
import Navbar from '../Components/Navbar'
import About from "../Pages/About"
import Login from "../Pages/Login"
import Inquery from "../Pages/Inquery"

import Dashboard from "../Pages/Dashboard"
import Inquiry from "../Pages/Inquery"
import EditProfile from "../Pages/EditProfile"

// Admin imports
import AdminRoute from '../Components/admin/AdminRoute'
import AdminLogin from '../Pages/admin/Login'
import AdminDashboard from '../Pages/admin/AdminDashboard'
import AdminUsers from '../Pages/admin/Users'
import AdminInquiries from '../Pages/admin/Inquiries'
// import ScrollToTop from "../../../EdmireAi/EdmireAi/src/ScrollToTop"

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Routes where we don't want to show the main Navbar and Footer
  const hideLayoutRoutes = [
    "/login", 
    "/inquery",
    "/admin",
    "/admin/login",
    "/admin/users",
    "/admin/dashboard"
  ];

  const shouldHideLayout = hideLayoutRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Conditionally Navbar */}
      {!shouldHideLayout && <Navbar />}

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>
        </Route>

        {/* Main Routes */}
        <Route path="/" element={
          <>
      
            <Hero />

            <WhyChoose />
            <HowitWorks />
            <PersonalizedMatch />
            <Match />
            <Gallery />
            <FixedBackgroundHero />
            <Faq />
            <Testimonials />
          </>
        } />
    {/* <ScrollToTop/> */}
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inquery" element={<Inquiry />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile/:id" element={<EditProfile />} />
      </Routes>

      {/* Conditionally Footer */}
      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default App;