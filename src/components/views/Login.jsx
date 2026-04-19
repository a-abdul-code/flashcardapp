import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import AuthForm from "../UI/AuthForm";

function Login() {
  //Initialisation ---------------------------------
  const { signInUser, session } = useAuth();
  const navigate = useNavigate();

  //State ------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required");
    } else {
      const result = await signInUser(email, password);

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        navigate("/dashboard");
      }
    }
  };
  //Handlers ---------------------------------------
  const handleChange = (event) => {
    const { name, value } = event.target;

    name === "email" ? setEmail(value) : setPassword(value);
  };

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session]);

  //View -------------------------------------------
  return <AuthForm title="Login" onChange={handleChange} errorMessage={errorMessage} onSubmit={handleLogin} />;
}

export default Login;
