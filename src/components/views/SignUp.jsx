import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthForm from "../UI/AuthForm";

const intialNewUser = {
  displayName: "",
  email: "",
  password: "",
};

function SignUp() {
  //Initialisation ---------------------------------
  const { signUpNewUser, session } = useAuth();
  const navigate = useNavigate();

  //State ------------------------------------------
  const [newUser, setNewUser] = useState(intialNewUser);
  const [errorMessage, setErrorMessage] = useState(null);

  //Handlers ---------------------------------------
  const handleSignUp = async () => {
    if (!newUser.displayName.trim() || !newUser.email || !newUser.password) {
      setErrorMessage("All fields are required");
    } else {
      const result = await signUpNewUser(newUser.email, newUser.password, newUser.displayName);

      console.log(result);

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setNewUser({ ...newUser, [name]: value });
  };

  useEffect(() => {
    if (session) {
      navigate("/dashboard");
    }
  }, [session]);

  //View -------------------------------------------
  return <AuthForm title="Sign Up" onChange={handleChange} errorMessage={errorMessage} onSubmit={handleSignUp} />;
}

export default SignUp;
