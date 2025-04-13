import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { ThemeContext } from "./lib/theme-context"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeContext>
    <App />
    </ThemeContext>
  </React.StrictMode>,
)
