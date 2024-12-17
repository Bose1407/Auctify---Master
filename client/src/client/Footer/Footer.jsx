import React, { useEffect, useState } from 'react';
import "./footer.scss";
import { NavLink, useHistory } from 'react-router-dom';

import {AiOutlineRight , AiFillTwitterCircle} from 'react-icons/ai';
import {AiFillLinkedin} from 'react-icons/ai';

import {FiTwitter , FiFacebook , FiInstagram , FiMail} from 'react-icons/fi';
// import {BsFacebook} from 'react-icons/bs';
// import {FaInstagramSquare} from 'react-icons/fa';
// import {CgMail} from 'react-icons/cg';

import 'font-awesome/css/font-awesome.min.css';



const Footer = () => {

  const [userData, setUserData] = useState({ name: "", email: "", subject: "", message: "" });
  const [showButton, setShowButton] = useState(true);
  const history = useHistory();
  const userContact = async () => {

    try {
      const res = await fetch('/getdata', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const data = await res.json();
      // console.log(data);
      setUserData({ ...userData, name: data.name, email: data.email });
      // console.log(`data send to backend`);

      if (!res.status === 200) {
        const error = new Error(res.error);
        throw error;

      }


    } catch (err) {
      console.log(err);
    }

  }
  /*  USEEFFECT HOOK -> RUN ONLY ONE TIME WHEN FUNCTION IS CALLED -> ARRAY DENOTES -> NO OF TYMS USEEFFECT CALLLS -> callProfilePage is async function -> so we can not use it inside useEffect */
 
  useEffect(() => {

    userContact();
  }, []);

  const newsLetterSubmitHandler = () => {
    console.log("Handler called");
    history.push('/');
        setShowButton(false);

  }




  return (
    <>
    <div className="footercls">
    <footer id="footer">
    {showButton && (
<div className="footer-newsletter">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <h4>Join Our Newsletter</h4>
        <p>Be the first to know about exciting new Auctions , special events and much more</p>
        <form    onSubmit={newsLetterSubmitHandler}>
          <input type="email" name="email" value={userData.email}/><input type="submit" value="Subscribe"/>
        </form>
      </div>
    </div>
  </div>
</div>
)}

<div className="footer-top">
  <div className="container">
    <div className="row">
      

      <div className="col-lg-4 col-md-6 footer-contact">
        <h3>Auctify</h3>
        <p>
          Madurai<br/>
          India<br/>
          <strong>Phone:</strong>+91 7094511720<br/>
          <strong>Email:</strong> team🐺@gmail.com<br/>
        </p>
      </div>

      

      <div className="col-lg-5 col-md-6 footer-links">
        <h4>Our Services</h4>
        <ul>

        <li><AiOutlineRight/> <NavLink to="/signin" excat className="nav-link">Sign In</NavLink></li>
        <li><AiOutlineRight/> <NavLink to="/signin" excat className="nav-link">Register</NavLink></li>
        <li><AiOutlineRight/> <NavLink to="/lot" excat className="nav-link">Active Auctions</NavLink></li>



          
        </ul>
      </div>

      <div className="col-lg-3 col-md-6 footer-links">
        <h4>Stay Connected</h4>
        <p>Best Bid Blogs</p>
        <div className="social-links mt-3">

        {/* <NavLink to="https://twitter.com/RiyaPar18563538?t=XzT0mte2elxP7XWMUQSD7w&s=08" excat className="nav-link twitter"><FiTwitter/></NavLink>
        <NavLink to="/contact" excat className="nav-link twitter"><AiFillLinkedin/></NavLink>
        <NavLink to="/contact" excat className="nav-link twitter"><FiInstagram/></NavLink>
        <NavLink to="/contact" excat className="nav-link twitter"><FiMail/></NavLink>
 */}

          <a className="nav-link twitter"><FiTwitter/></a>
          <a className="nav-link twitter"><AiFillLinkedin/></a>
          <a className="nav-link twitter"><FiInstagram/></a>
          <a className="nav-link twitter"><FiMail/></a>
        </div>
      </div>

    </div>
  </div>
</div>


<div className="container py-4">
  <div className="copyright">
    &copy;<strong><span> by team🐺</span></strong>.
  </div>
  
</div>
</footer>
</div>


    </>
  )
}

export default Footer