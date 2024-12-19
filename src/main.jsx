import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Card from '../components/card.jsx'
import Nav from '../components/nav.jsx'
import MonthlyEnergyChart from '../components/chart.jsx'
import LiveData from '../components/livedata.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Nav></Nav>
    <App />
    <LiveData />
    {/* <MonthlyEnergyChart/> */}
    {/* <Card
        title="Voltage"
        value={230}
        unit="Volts"
        icon={"V"}
        progress={80}
      />
      <Card
        title="Voltage"
        value={230}
        unit="Volts"
        icon={"V"}
        progress={80}
      />
      <Card
        title="Watts"
        value={999}
        unit="Watts"
        icon={"W"}
        progress={10}
      />
      <Card
        title="Current"
        value={2}
        unit="Amps"
        icon={"A"}
        progress={50}
      /> */}
  </StrictMode>,
)
