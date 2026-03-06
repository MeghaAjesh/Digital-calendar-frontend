import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CalendarPage from "./pages/CalendarPage"

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/events" element={<CalendarPage />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App