import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Events from "@/pages/Events";
import CreateEvent from "@/pages/CreateEvent";
import Login from "@/pages/Login";
import Settings from "@/pages/Settings";
import OrganizerDashboard from "@/pages/OrganizerDashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16"> {/* Add padding to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/create" element={<CreateEvent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;