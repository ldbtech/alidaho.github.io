import { React, useState } from "react";
import "./navbar.css";
import { Link } from "react-scroll";
import Contact from '../../assets/contact.png';
import Menu from '../../assets/menu.png';
const Navbar = () => {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <nav className="navbar" id="custom-navbar">
            <img src="" alt="logo" className="logo " />
            <div className="desktopMenu">
                <Link activeClass="active" to="intro" spy={true} smooth={true} offset={-100} duration={500} className="desktopMenuListItem">Home</Link>
                <Link activeClass="active" to="skills" spy={true} smooth={true} offset={-100} duration={500} className="desktopMenuListItem">About</Link>
                <Link activeClass="active" to="works" spy={true} smooth={true} offset={-100} duration={500} className="desktopMenuListItem">Projects</Link>
                <Link className="desktopMenuListItem">Resume</Link>
            </div>
            <button className="desktopMenuButton" onClick={() => {
                document.getElementById('#').scrollIntoView({ behavior: "smooth" });
            }}>
                <div className="buttonContents">
                    <img src={Contact} alt="desktopImage" className="deskopMenuButtonImage" />
                    <span className="contactMe">Contact Me</span>
                </div>
            </button>
            <img src={Menu} alt="logo" className="mobMenu " onClick={() => setShowMenu(!showMenu)} />
            <div className="navMenuResp" style={{ display: showMenu ? 'flex' : 'none' }}>
                <Link activeClass="active" to="intro" spy={true} smooth={true} offset={-100} duration={500} className="ListItem" onClick={() => setShowMenu(false)}>Home</Link>
                <Link activeClass="active" to="skills" spy={true} smooth={true} offset={-100} duration={500} className="ListItem" onClick={() => setShowMenu(false)}>About</Link>
                <Link activeClass="active" to="works" spy={true} smooth={true} offset={-100} duration={500} className="ListItem" onClick={() => setShowMenu(false)}>Projects</Link>
                <Link className="ListItem" onClick={() => setShowMenu(false)}>Resume</Link>
                <Link activeClass="active" to="works" spy={true} smooth={true} offset={-100} duration={500} className="ListItem" onClick={() => setShowMenu(false)}>Contact</Link>

            </div>
        </nav >
    )
}

export default Navbar; 