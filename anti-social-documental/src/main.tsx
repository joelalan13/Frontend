import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from "./App.tsx";
import { BrowserRouter } from 'react-router'
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.min.css'
// @ts-ignore: allow importing CSS without type declarations
import './index.css'





createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </StrictMode>,

)
