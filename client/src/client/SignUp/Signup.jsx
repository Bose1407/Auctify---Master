import React, { useContext, useState } from 'react';
import "./signupstyle.scss";
import login from '../images/login.svg';
import register from '../images/register.svg';
import 'font-awesome/css/font-awesome.min.css';
import { NavLink, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import { useAlert } from 'react-alert';

const Signup = () => {
  const alert = useAlert();
  const { dispatch } = useContext(UserContext);
  const [flag, setFlag] = useState(1); // flag for switching between login and signup forms
  const history = useHistory();

  // State for signup form fields
  const [user, setUser] = useState({
    name: "", 
    email: "", 
    phone: "", 
    password: "", 
    cpassword: ""
  });

  // State for login form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle input changes for signup
  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  }

  // Signup handler
  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, cpassword } = user;
    console.log(user);  // Add this line


    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        name, email, phone, password, cpassword
      })
    });

    const data = await res.json();
    console.log(data); 
    if (res.status === 400 || !data) {
      alert.error(data.error || "Invalid Registration");
    } else {
      alert.success("Registration Successful");
      setFlag(!flag); // Switch to login form on successful registration
    }
  }

  // Login handler
  const loginUser = async (e) => {
    e.preventDefault();

    const res = await fetch('/signin', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (res.status === 400 || !data) {
      alert.error("Invalid Credential");
    } else {
      dispatch({ type: "USER", payload: true });
      alert.success("Login Successful");
      history.push('/');
    }
  }

  return (
    <>
      <div className="signupcls" data-aos="fade-up" data-aos-delay="400">
        <div className='row'>
          <div className='col-10 mx-auto'>
            <div className={`container ${flag ? 'sign-up-mode' : ''}`}>
              <div className="forms-container">
                <div className="signin-signup">
                  {/* Sign-in form */}
                  <form method='POST' className="sign-in-form">
                    <h2 className="title">Sign in</h2>
                    <div className="input-field">
                      <i className="fas fa-user"></i>
                      <input type="email" placeholder="Email" name='email' autoComplete='off' 
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-field">
                      <i className="fas fa-lock"></i>
                      <input type="password" placeholder="Password" name='password' autoComplete='off' 
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <input type="submit" value="Login" className="btn solid" name='signin' onClick={loginUser} />
                    <p className="social-text">Or Sign in with social platforms</p>
                    <div className="social-media">
                      <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                  </form>

                  {/* Sign-up form */}
                  <form method='POST' className="sign-up-form" onSubmit={PostData}>
                    <h2 className="title">Sign up</h2>
                    <div className="input-field">
                      <i className="fas fa-user"></i>
                      <input type="text" name="name" placeholder="Username" autoComplete='off' 
                        value={user.name} onChange={handleInputs} />
                    </div>
                    <div className="input-field">
                      <i className="fas fa-envelope"></i>
                      <input type="email" name="email" placeholder="Email" autoComplete='off' 
                        value={user.email} onChange={handleInputs} />
                    </div>
                    <div className="input-field">
                      <i className="fas fa-envelope"></i>
                      <input type="tel" name="phone" placeholder="Phone Number" autoComplete='off' pattern="[0-9]{10}" 
                        value={user.phone} onChange={handleInputs} />
                    </div>
                    <div className="input-field">
                      <i className="fas fa-lock"></i>
                      <input type="password" name="password" placeholder="Password" autoComplete='off' 
                        value={user.password} onChange={handleInputs} />
                    </div>
                    <div className="input-field">
                      <i className="fas fa-lock"></i>
                      <input type="password" name="cpassword" placeholder="Confirm Password" autoComplete='off' 
                        value={user.cpassword} onChange={handleInputs} />
                    </div>
                    <input type="submit" className="btn" name='signup' value="Sign up" />
                    <p className="social-text">Or Sign up with social platforms</p>
                    <div className="social-media">
                      <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
                      <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                  </form>
                </div>
              </div>

              <div className="panels-container">
                <div className="panel left-panel">
                  <div className="content">
                    <h3>Haven't an account?</h3>
                    <p>Get Started with a free account!</p>
                    <NavLink exact to="/signup">
                      <button className="btn transparent" id="sign-up-btn" onClick={() => setFlag(!flag)}>Sign up</button>
                    </NavLink>
                  </div>
                  <img src={register} className="image" alt="register" />
                </div>
                <div className="panel right-panel">
                  <div className="content">
                    <h3>Already have an account?</h3>
                    <p>Log in first to start with BestBid!</p>
                    <NavLink exact to="/signin">
                      <button className="btn transparent" id="sign-in-btn" onClick={() => setFlag(!flag)}>Sign in</button>
                    </NavLink>
                  </div>
                  <img src={login} className="image" alt="login" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
