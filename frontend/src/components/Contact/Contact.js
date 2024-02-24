import React from "react";
import Navbar from "../Home/Navbar/Navbar";
import ContactHero from "./ContactHero/ContactHero";
import ContactForm from "./Form/ContactForm";
import Footer from "../Home/Footer/Footer";

const Contact = () =>{
    return(
        <div>
            <Navbar />
            <ContactHero />
            <ContactForm />
            <Footer />
        </div>
    )
}
export default Contact;