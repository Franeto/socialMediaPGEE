import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer"

const INITIAL_STATE = {
  user: {
    _id: "63dcf96cc8ce0800ff0d3093",
    username: "Frane",
    email: "frane@gmail.com",
    profilePicture: "person/2.jpeg",
    coverPicture: "",
    isAdmin: false,
    followers: [],
    followering: [],
    
  },
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
