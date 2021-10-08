import './App.css';
import firebaseInitialize from './Firebase/firebase.init';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useState } from 'react';


firebaseInitialize();
const googleProvider = new GoogleAuthProvider();

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);

  const auth = getAuth();

  // Google Sign In Handle
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
  }

  // Form Submit Handle
  const handleFormSubmit = event => {
    event.preventDefault();
    console.log(email, password);

    if (password.length < 6) {
      setError("Password Must be 6 Characters long.");
      return;
    } else if (!/(?=.*[A-Z])/.test(password)) {
      setError("Password Must Container At Least One Upper Character");
      return;
    }

    if (isLogin) {
      loginUser(email, password);
    } else {
      createNewUser(email, password);
    }

  }

  // Email
  const handleEmailChange = event => {
    setEmail(event.target.value);
  }

  // Password
  const handlePasswordChange = event => {
    setPassword(event.target.value);
  }

  // Form Toggle
  const toggleForms = event => {
    setIsLogin(event.target.checked);
  }

  // Create New User
  const createNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        verifyEmail();
        setError("");
      }).catch(error => {
        setError(error.message);
      })
  }

  // Login User
  const loginUser = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError("");
      }).catch(error => {
        setError(error.message);
      })
  }

  // Verify Email
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
  }

  return (
    <div className="App">

      <div className="container bg-dark text-white mt-4 py-5 rounded-3">
        <h2 className="mb-5 text-center">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleFormSubmit} className="w-75 mx-auto">
          <div className="row mb-3">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" placeholder="Email Address" required />
          </div>
          <div className="row mb-3">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" placeholder="Password" required />
          </div>
          <div class="form-check">
            <input onChange={toggleForms} class="form-check-input" type="checkbox" id="gridCheck1" />
            <label class="form-check-label" for="gridCheck1">
              {isLogin ? "Have Not Account?" : "Have an Account?"}
            </label>
          </div>
          <div><p>{error}</p></div>
          <button type="submit" className="btn btn-light">{isLogin ? "Login" : "Register"}</button>
        </form>
      </div>


      <br /><br /><br />
      <div className="google-auth">
        <p>----------------------------------------------------</p>
        <h2>Google Authentication</h2>
        <button onClick={handleGoogleSignIn}>Google Sign In</button>
      </div>
    </div>
  );
}

export default App;
