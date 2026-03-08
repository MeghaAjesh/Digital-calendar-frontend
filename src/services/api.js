import axios from "axios"

const API = axios.create({
   baseURL: "https://digital-calendar-backend-1.onrender.com"
  // baseURL : "http://localhost:8080"
})

export const getEvents = () => API.get("/events")

export const addEvent = (event) => {
  const role = localStorage.getItem("role")
  return API.post(`/events?role=${role}`, event)
}
export const deleteEvent = (id) => {
  const role = localStorage.getItem("role")
  return API.delete(`/events/${id}?role=${role}`)
}
export const signupUser = (user) => API.post("/auth/signup", user)

export const loginUser = (user) => API.post("/auth/login", user)