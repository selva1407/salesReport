import "./Sidebar.css"
import logo from "../../assets/openAi.png"
import { Link } from "react-router-dom"
import { FaHome } from "react-icons/fa"
import { BiBarChartAlt2 } from "react-icons/bi"

const Sidebar = () => {
  
  return (
    <nav className = "sidebar">
      <header>
        <div className = "logo">
          {/*<img src = {logo} alt = "logo" />*/}
        </div>
      </header>
      <main className = "menu-bar">
        <ul className = "menu-links">
          <li className = "nav-link">
            <Link to = "/">
              <FaHome className = "icon"/>
              <p className = "text">Dashboard</p>
            </Link>
          </li>
          <li className = "nav-link">
            <Link to = "/sales-report">
              <BiBarChartAlt2 className = "icon"/>
              <p className = "text">Sales Report</p>
            </Link>
          </li>
        </ul>
      </main>
      <footer>
        
      </footer>
    </nav>
  )
}
export default Sidebar;