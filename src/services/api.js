import axios from "axios"

const API = axios.create({
  baseURL: "https://digital-calendar-backend-1.onrender.com"
})

export const getEvents = () => API.get("/events")

export const addEvent = (event) => API.post("/events", event)

export const deleteEvent = (id) => API.delete(`/events/${id}`)