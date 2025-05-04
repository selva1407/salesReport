import './App.css'
import PieChart from "./Components/PieChart/PieChart"
import Sidebar from "./Components/Sidebar/Sidebar"
import Dashboard from "./Components/Dashboard/Dashboard"
import SalesReport from "./Components/SalesReport/SalesReport"
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <main>
      {/*<PieChart />*/}
      <Sidebar />
      <Routes>
        <Route path = "/" element = {<Dashboard />} />
        <Route path = "/sales-report" element = {<SalesReport />} />
      </Routes>
    </main>
  )
}

export default App
