import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Yahan par jo bhi route me Navbar/Footer nahi chahiye unko list karo
  const hideLayoutRoutes = ["/login", "/inquery"];

  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {/* Conditionally Navbar */}
      {!shouldHideLayout && <Navbar />}

      <Routes>
        {/* Home Page */}
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

        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inquery" element={<Inquiry />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* Conditionally Footer */}
      {!shouldHideLayout && <Footer />}
    </>
  );
}

export default App;
