// AuthForms.jsx
import React, { useState,useContext } from 'react';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import './LoginPage.css';
import { AuthContext } from '../context/AuthContext';

import { useNavigate, useSearchParams } from 'react-router-dom';



const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  let navigate=useNavigate()
  const {login}=useContext(AuthContext)


  const [loginData, setloginData] = useState({
    email: "",
    password: ""
  })

  const handleLoginChange = (event) => {
    let { name, value } = event.target
    setloginData({
      ...loginData,
      [name]: value
    })
  }

  const [SignupData, setSignupData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleSignupChange = (event) => {
    let { name, value } = event.target
    setSignupData({
      ...SignupData,
      [name]: value
    })
  }

  const [searchParams]=useSearchParams()


  const Login = async () => {
    try {
      console.log(loginData)
      const endpoint = "https://auth-image-640388342610.us-central1.run.app/user/login";
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message)
        throw new Error(data.message || 'Something went wrong');
      }

      // to do ma use context karine login karavnu cheh e

      if(data.success)
      {
        console.log('Hello')
        
        login(data);
        console.log("logged in success")
        console.log("navigating")
        const redirectTo = searchParams.get("redirect") || "/";
        navigate(redirectTo)
      }
      

      // Redirect or update app state here
    } 
    catch (err) {
      console.log(err)
      setError(err.message);
    } 
    finally {
      setLoading(false);
    }

  }
  const CreateUser = async () => {
    console.log(SignupData)
    try {
      const endpoint = "https://auth-image-640388342610.us-central1.run.app/user/createuser";
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(SignupData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.message)
        throw new Error(data.message || 'Something went wrong');
      }
      if(data.success)
      {
          setIsLogin(true)
      }
      
    } catch (err) {
      console.log(err)
      setError(err.message);
    } finally {
      setLoading(false);
    }

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (isLogin)
      Login()
    else
      CreateUser()
  };

  const handleSocialAuth = (provider) => {
    // Implement social authentication logic here
    console.log(`Authenticating with ${provider}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="logo">Cloud IDE</div>
        <h1>Build better software</h1>
        <div className="features">
          <div className="feature-item">
            <span>🤖</span>
            <p>Fully automated AI web developer and designer</p>
          </div>
          <div className="feature-item">
            <span>👥</span>
            <p>Collaborate in real-time with Multiplayer AI and Editing</p>
          </div>
          <div className="feature-item">
            <span>🌐</span>
            <p>Join a community of world class developers</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <h2>{isLogin ? 'Log in to Cloud IDE' : 'Create a Cloud IDE account'}</h2>

          <div className="social-buttons">
            <button
              className="social-button google"
              onClick={() => handleSocialAuth('google')}
            >
              <FaGoogle />
              Continue with Google
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            {isLogin?  
              <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            :
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={SignupData.name}
                onChange={handleSignupChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={SignupData.email}
                onChange={handleSignupChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={SignupData.password}
                onChange={handleSignupChange}
                required
              />
            </div>
            

            
            }
            

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
            </button>
          </form>

          <p className="terms">
            By continuing, you agree to Cloud IDE's terms and services
          </p>

          <p className="auth-switch">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)}>Sign up</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)}>Log in</button>
              </>
            )}
          </p>

          

        </div>
      </div>
    </div>
  );
};

export default AuthForms;