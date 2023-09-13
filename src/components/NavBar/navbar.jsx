import { React } from "react";
import "./navbar.css";
import { Link } from "react-scroll";
import Contact from '../../assets/contact.png'

const Navbar = () => {
    return (
        <nav className="navbar" id="custom-navbar">
            <img src="" alt="logo" className="logo " />
            <div className="desktopMenu">
                <Link to="/home" className="desktopMenuListItem">Home</Link>
                <Link to="/about" className="desktopMenuListItem">About</Link>
                <Link to="/projects" className="desktopMenuListItem">Projects</Link>
                <Link to="/resume" className="desktopMenuListItem">Resume</Link>
            </div>
            <button className="desktopMenuButton">
                <div className="buttonContents">
                    <img src={Contact} alt="desktop Image Menu Button" className="deskopMenuButtonImage" />
                    <span className="contactMe">Contact Me</span>
                </div>
            </button>

        </nav>
    )
}

export default Navbar; 