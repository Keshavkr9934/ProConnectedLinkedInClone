import UserLayout from "@/layouts/Userlayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import style from "./login.module.css";
import { useDispatch } from "react-redux";
import { emptyMessage } from "@/config/redux/reducer/authreducer";
import { loginUser, registerUser } from "@/config/redux/action/authaction";

function LoginComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isLoginMethod, setIsLoginMethod] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    // console.log("Auth State:", authState);
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
    //  router.push("/");
  }, [authState.loggedIn]);

  // useEffect(()=>{
  //   if(localStorage.getItem("token")){
  //     // console.log("Token found, redirecting to dashboard");
  //     router.push("/dashboard");
  //   }
  // },[])
  useEffect(() => {
  if (!router.isReady) return;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    router.replace("/dashboard"); // use replace instead of push to avoid extra history entry
  }
}, [router.isReady]);
  useEffect(() => {
     dispatch(emptyMessage())// Clear messages on component mount
  }, [isLoginMethod]);
  const handdleSubmit = async () => {
    setLoading(true); // disable button and show loading
    try{
      await dispatch(
        loginUser({
          email,
          password,
        })
      )
      setEmail("");
      setPassword("");
      // console.log(authState.message);
    }catch (error){
      console.error("Login error:", error);
      setMessages("Login failed. Try again.");
    }finally{
      setLoading(false); // always reset button
    }
  };
  const handleResiter = async () => {
    setLoading(true); // disable button and show loading
    try {
      await dispatch(
        registerUser({
          name,
          username: userName,
          email,
          password,
        })
      ); // this throws if failed

      // Clear fields after successful registration
      setName("");
      setUserName("");
      setEmail("");
      setPassword("");

      //  You can also show success message here
      // setMessages("Registration successful!");
    } catch (error) {
      console.error("Register error:", error);
      setMessages("Registration failed. Try again.");
    } finally {
      setLoading(false); // always reset button
    }
  };

  return (
    <UserLayout>
      <div className={style.container}>
        <div className={style.cardContainer}>
          <div className={style.cardContainer_left}>
            <p className={style.signText}>
              {isLoginMethod ? "Sign in" : "Sign Up"}
            </p>
            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message.message}
            </p>
            <div className={style.inputContainer}>
              {!isLoginMethod && <div className={style.inputRow}>
                <input
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  type="text"
                  className={style.inputField}
                  value={name}
                  placeholder="Name"
                />
                <input
                  type="text"
                  className={style.inputField}
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </div>

              }
              <input
                type="text"
                placeholder="Email"
                value={email}
                className={style.inputField}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
             <div className={style.passwordWrapper}>
               <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                className={style.inputField}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <span
                className={style.eyeIcon}
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
              >
                👁️
              </span>
             </div>
              <button
                className={style.SignUpBotton}
                onClick={() => {
                  if (isLoginMethod) {
                    // Handle login logic
                    handdleSubmit();
                  } else {
                    // Handle signup logic
                    handleResiter();
                  }
                }}
                disabled={loading}
              >
                <p>
                  {loading
                    ? "Please wait..."
                    : isLoginMethod
                    ? "Sign In"
                    : "Sign Up"}
                </p>
              </button>
            </div>
          </div>
          <div className={style.cardContainer_right}>
            <div>
              <p className={style.signText}>
                {isLoginMethod ? "Dont't have an account?" : "Already have an account?"}
              </p>
              <button
                className={style.SignUpBotton}
                onClick={() => {
                  setIsLoginMethod(!isLoginMethod);
                  setMessages("");
                }}
              >
                {isLoginMethod ? "Sign Up" : "Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
