import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import MyTickets from "./pages/MyTickets";
import AssignedTickets from "./pages/AssignedTickets";
import TicketDetails from "./pages/TicketDetails";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/"                element={<Login />} />
                <Route path="/login"           element={<Login />} />
                <Route path="/register"        element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password"  element={<ResetPassword />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard"        element={<Dashboard />} />
                    <Route path="/create-ticket"    element={<CreateTicket />} />
                    <Route path="/my-tickets"       element={<MyTickets />} />
                    <Route path="/assigned-tickets" element={<AssignedTickets />} />
                    <Route path="/ticket/:id"       element={<TicketDetails />} />
                    <Route path="/analytics"        element={<Analytics />} />
                    <Route path="/settings"         element={<Settings />} />
                    <Route path="/notifications"    element={<Notifications />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;