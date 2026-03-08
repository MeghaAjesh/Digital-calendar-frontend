import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CalendarPage from "./pages/CalendarPage"
import AuthPages from "./pages/AuthPages"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<AuthPages />} />
        <Route path="/signup" element={<AuthPages />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App