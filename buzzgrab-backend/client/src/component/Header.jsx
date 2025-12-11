/**
 * @copyright : Ozvid Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Ozvid Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./header.scss";
import "../assets/responsive.scss";
function Header() {
    const navigate = useNavigate();
    return (
        <>
            <Navbar expand="lg" className="navigation-top">
                <Container>
                    <Navbar.Brand onClick={() => { navigate(`/`) }
                    } className='header-logo'>
                        <img src={"/images/logo.svg"} />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto gap-lg-3 gap-0 navbar-nav me-5">
                            <Nav.Link onClick={() => { navigate(`/`) }
                            }>Home</Nav.Link>
                            <Nav.Link onClick={() => { navigate(`/about-us`) }
                            }>About Us</Nav.Link>
                               <Nav.Link onClick={() => { navigate(`/how-it-work`) }
                            }>How it Works</Nav.Link>
                           <Nav.Link onClick={() => { navigate(`/faqs`) }
                            }>Faqs</Nav.Link>
                            <Nav.Link onClick={() => { navigate(`/contact-us`) }
                            }>Contact Us</Nav.Link>
                        </Nav>
                        <div className="login-btn">
                            <Link to='/login' className="theme-btn">Login</Link>
                        </div>
                    </Navbar.Collapse>

                  

                </Container>
            </Navbar>


        </>
    )
}

export default Header;
