import "../UI/AuthForm.scss";
import { NavLink } from "react-router-dom";

export default function AuthForm({ title, onChange, errorMessage, onSubmit }) {
  //Initialisation ---------------------------------
  //State ------------------------------------------
  //Handlers ---------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  //View -------------------------------------------
  return (
    <div className="form">
      <form className="authForm" onSubmit={handleSubmit}>
        <h1>{title}</h1>

        {title === "Sign Up" && (
          <label className="authFormLabel">
            Display Name:
            <input
              className="authFormInput"
              type="text"
              name="displayName"
              placeholder="Enter your Display Name"
              onChange={onChange}
            />
          </label>
        )}

        <label className="authFormLabel">
          Email:
          <input className="authFormInput" type="text" name="email" placeholder="Enter Email" onChange={onChange} />
        </label>

        <label className="authFormLabel">
          Password:
          <input
            className="authFormInput"
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={onChange}
          />
        </label>

        <p className="errorMessage">{errorMessage}</p>

        <div className="authFormButton">
          <button type="submit">{title}</button>
        </div>

        {title === "Login" ? (
          <p className="accountLabel">
            Don't have an account:{" "}
            <NavLink className="navbutton" to="/signup">
              Sign Up
            </NavLink>
          </p>
        ) : (
          <p className="accountLabel">
            Already have an account:{" "}
            <NavLink className="navbutton" to="/">
              Login
            </NavLink>
          </p>
        )}
      </form>
    </div>
  );
}
