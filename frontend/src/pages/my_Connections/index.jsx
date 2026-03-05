import React, { act, use, useEffect } from "react";
import UserLayout from "@/layouts/Userlayout";
import DashBoardLayout from "@/layouts/dashBoardLayout";
import { useDispatch, useSelector } from "react-redux";
import { whatAreMyConnections, acceptConnectionRequest ,getMyConnectionsRequest} from "@/config/redux/action/authaction";
import style from "./connection.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

function MyConnection() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { user, loggedIn, connection } = authState;
  console.log("Auth State in MyConnection:", authState);
  const router = useRouter();
  useEffect(() => {
    dispatch(whatAreMyConnections({ token: localStorage.getItem("token") }));
    console.log("Connections fetched:", authState.connectionRequest);
  }, [authState.connectionRequest.length]);

  return (
    <UserLayout>
      <DashBoardLayout>
        <h1>My Connection</h1>
        {authState.connectionRequest.length===0 && <h1>No Connections Found Pending</h1>}
        {authState.connctionRequest != 0 &&
          authState.connectionRequest.filter((connection)=>connection.status === null).map((connctionReq) => {
            return (
              <div onClick={() => router.push(`/view_profile/${connctionReq.senderId.username}`)} className={style.userCard} key={connctionReq._id}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <div className={style.profilePicture}>
                    <img
                      src={
                        connctionReq.senderId.profilePicture
                          ? `${BASE_URL}/${connctionReq.senderId.profilePicture}`
                          : "/default-profile.png"
                      }
                      alt={connctionReq.senderId.name}
                      style={{
                        border: "2px solid rgb(228, 209, 209)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        margin:"0.5rem"
                      }}
                    />
                  </div>
                </div>
                <div className={style.userInfo}>
                  <p>
                    <strong>Name: </strong> {connctionReq.senderId.name}
                  </p>
                  <p>
                    <strong>Username: </strong> {connctionReq.senderId.username}
                  </p>
                  {/* <p><strong>Email: </strong> {connctionReq.senderId.email}</p> */}
                </div>
                <button className={style.connectionButton} onClick={(e)=>{
                  e.stopPropagation();
                  dispatch(acceptConnectionRequest({ token: localStorage.getItem("token"), connectionId: connctionReq._id, accepted_status: "accept" }));
                  // dispatch(whatAreMyConnections({ token: localStorage.getItem("token") }));
                  // dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }));
                  }}>Accept</button>
              </div>
            );
          })}
          {authState.connctionRequest != 0 &&
          authState.connectionRequest.filter((connection)=>connection.status !==null).map((connctionReq) => {
            return (
              <div onClick={() => router.push(`/view_profile/${connctionReq.senderId.username}`)} className={style.userCard} key={connctionReq._id}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <div className={style.profilePicture}>
                    <img
                      src={
                        connctionReq.senderId.profilePicture
                          ? `${BASE_URL}/${connctionReq.senderId.profilePicture}`
                          : "/default-profile.png"
                      }
                      alt={connctionReq.senderId.name}
                      style={{
                        border: "2px solid rgb(228, 209, 209)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        margin:"0.5rem"
                      }}
                    />
                  </div>
                </div>
                <div className={style.userInfo}>
                  <p>
                    <strong>Name: </strong> {connctionReq.senderId.name}
                  </p>
                  <p>
                    <strong>Username: </strong> {connctionReq.senderId.username}
                  </p>
                  {/* <p><strong>Email: </strong> {connctionReq.senderId.email}</p> */}
                </div>
                <button className={style.acceptedButton}
                  >Accepted</button>
              </div>
            );
          })}
      </DashBoardLayout>
    </UserLayout>
  );
}

export default MyConnection;
