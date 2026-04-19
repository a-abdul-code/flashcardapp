import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { supabase } from "../../supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialisation ------------------------------------------
  // State ---------------------------------------------------
  const [session, setSession] = useState(undefined);

  // Handlers ------------------------------------------------
  const signUpNewUser = async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password: password,
      options: {
        data: {
          displayName: displayName,
        },
      },
    });

    if (error) {
      console.log("Error signing up: ", error);
      return { success: false, error };
    }

    if (!error) {
      const insertUserResponse = await supabase
        .from("Users")
        .insert({
          userID: data.user.id,
          coinBalance: 0,
          numOfFlashcardSetCompletedToday: 0,
        })
        .select()
        .single();

      if (insertUserResponse.error) {
        console.log("Error creating user profile in database: ", insertUserResponse.error);
        return { success: false, error: insertUserResponse.error.message };
      }
    }
    return { success: true, data };
  };

  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (error) {
        console.log("Sign-in error:", error.message);
        return { success: false, error: error.message };
      }

      console.log("Sign-in success:", data);
      return { success: true, data };
    } catch (error) {
      console.log("Unexpected error during sign-in:", error.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Error signing out:", error);
    }
  };

  // View ------------------------------------------

  return (
    <AuthContext.Provider value={{ signUpNewUser, signInUser, session, signOut }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
