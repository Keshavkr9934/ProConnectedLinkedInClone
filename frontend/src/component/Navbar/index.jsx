import{ React, useState} from "react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "@/config/redux/reducer/authreducer";

export default function Navbar() {
  const routers = useRouter();
  const dispatch = useDispatch();
  const [popBar, setPopBar] = useState(false);
// console.log("PopBar State:", popBar);
  const authState = useSelector((state) => state.auth);
  // console.log("Auth State in Navbar:", authState.user);
  return (
    <div  className={styles.container}>
      <nav className={styles.navbar}>
        <h1
          onClick={() => {
            routers.push("/");
          }}
        >
          ProConnect
        </h1>
        <div className={styles.NavBarOptionContainer}>

          {authState.profileFeched && 
          <div>
            <div style={{display: "flex", gap: "1.2rem"}} onClick={ ()=>{
              setPopBar(!popBar);
            }}>
              {popBar && <div onClick={(e)=>{e.stopPropagation()}} className={styles.firstDiv}>
                   <div className={styles.secondDiv}>
                      <p>{authState.user.userId.name}</p>
                      <p>{authState.user.bio}</p>
                      <div className={styles.button} onClick={() => routers.push("/profile")}>
                        <button >View Profile</button>
                      </div>
                      <hr />
                      <h3>Account</h3>
                      <hr />
                      <h3>Management</h3>
                      <hr />
                      <p className={styles.signup} style={{cursor:"pointer"}} onClick={()=>{
                        localStorage.removeItem("token");
                        dispatch(reset());
                        routers.push("/login"); 

                        }
                      }>SignOut</p>
                   </div>

                </div>}
              {/* <p>Hey , {authState.user.userId.name}</p> */}
            <p style={{fontWeight: "bold" , cursor :"pointer"}} >Profile</p>
            </div>
          </div>
          }
           {!authState.profileFeched && 
            <div
              onClick={() => {
                routers.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
}
          
        </div>
      </nav>
    </div>
  );
}
