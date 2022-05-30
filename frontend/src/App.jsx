import React, { useState, useEffect, useReducer, useCallback } from "react"
import Gun from "gun"

const gun = Gun({
  peers: ["http://localhost:5000/gun"],
})

const initialState = {
  messages: [],
}

function reducer(state, message) {
  return {
    messages: [message, ...state.messages],
  }
}

function App() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  })

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  // set a new message in gun, update the local state to reset the form field
  const saveMessage = useCallback(() => {
    const messages = gun.get("messages")
    messages.set({
      name: formData.name,
      message: formData.message,
      createdAt: Date.now(),
    })
    setFormData({
      name: "",
      message: "",
    })
  }, [formData.message])

  useEffect(() => {
    const messages = gun.get("messages")
    messages.map().on((msg) => {
      dispatch({
        name: msg.name,
        message: msg.message,
        createdAt: msg.createdAt,
      })
    })
    setFormData({
      name: "",
      message: "",
    })
  }, [])

  return (
    <div className="App">
      <input
        name="name"
        onChange={onChange}
        placeholder={"Name"}
        value={formData.name}
      />
      <input
        name="message"
        onChange={onChange}
        placeholder={"Message"}
        value={formData.message}
      />
      <button onClick={saveMessage}>Send Message</button>

      {state?.messages &&
        state.messages.map((message) => (
          <div key={`${message.createdAt}-${Math.random()}`}>
            <h2>{message.message}</h2>
            <h3>From: {message.name}</h3>
            <p>Date: {message.createdAt}</p>
          </div>
        ))}
    </div>
  )
}

export default App
