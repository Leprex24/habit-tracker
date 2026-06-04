import {Routes, Route, Navigate} from "react-router-dom"
import {AuthProvider} from './context/AuthContext'
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import HabitsPage from "./pages/HabitsPage"
import StatsPage from "./pages/StatsPage";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={
                    <PrivateRoute>
                        <Dashboard/>
                    </PrivateRoute>
                }/>
                <Route path="/habits" element={
                    <PrivateRoute>
                        <HabitsPage/>
                    </PrivateRoute>
                }/>
                <Route path="/stats" element={
                    <PrivateRoute>
                        <StatsPage/>
                    </PrivateRoute>
                }/>
                <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
        </AuthProvider>
    )
}

export default App