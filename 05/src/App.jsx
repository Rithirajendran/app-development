import { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      alert("Login successful!");
    } else {
      alert("Registration successful!");
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: ""
    });
  };

  return (
    <div className="app">

      {/* Background decoration */}
      <div className="circle circle-one"></div>
      <div className="circle circle-two"></div>

      <div className="auth-container">

        {/* Left Section */}
        <div className="welcome-section">
          <div className="logo">◆</div>

          <h1>
            Welcome to <span>AuthSpace</span>
          </h1>

          <p>
            A simple and secure authentication experience
            built with React.js.
          </p>

          <div className="features">
            <div className="feature">
              <span>✓</span>
              Easy to use
            </div>

            <div className="feature">
              <span>✓</span>
              Secure authentication
            </div>

            <div className="feature">
              <span>✓</span>
              Responsive design
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">

          <div className="form-header">
            <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

            <p>
              {isLogin
                ? "Please enter your details to continue."
                : "Fill in your details to create an account."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {!isLogin && (
              <div className="input-group">
                <label>Full Name</label>

                <div className="input-wrapper">
                  <span className="input-icon">👤</span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Email Address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="form-options">
                <label className="remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>

                <a href="#" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
            )}

            <button type="submit" className="submit-button">
              {isLogin ? "Sign In" : "Create Account"}
              <span>→</span>
            </button>

          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="switch-text">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button onClick={switchMode}>
              {isLogin ? "Create account" : "Sign in"}
            </button>
          </div>

        </div>
      </div>

      <div className="footer">
        React.js Authentication Application • Experiment 5
      </div>

    </div>
  );
}

export default App;