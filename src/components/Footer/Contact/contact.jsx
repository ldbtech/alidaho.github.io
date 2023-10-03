import React from "react";
import './contact.css';

const Contact = () => {
    return (
        <section id="contactsPage">
            <div id="contact">
                <h1 className="contactPageTitle">Contact Me</h1>
                <span className="contactDesc">Please fill out the form below to discuss any careers/work opportunities.</span>
                <form action="" className="contactForm">
                    <input type="name" className="name" placeholder="Full Name" />
                    <input type="email" className="email" placeholder="Email" />
                    <textarea className="msg" name="message" rows={5} placeholder="Your Message"></textarea>
                    <button type="submit" value="send" className="submitBtn">Submit</button>
                    <div className="links">
                        Social Media
                    </div>
                </form>
            </div>
        </section>

    )
}

export default Contact;