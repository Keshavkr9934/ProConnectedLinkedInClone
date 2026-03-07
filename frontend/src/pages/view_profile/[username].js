import { BASE_URL, clientServer } from "@/config";
import DashBoardLayout from "@/layouts/dashBoardLayout";
import UserLayout from "@/layouts/Userlayout";
import { useSearchParams } from "next/navigation";
import { React, use, useEffect, useState } from "react";
import style from "./view.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";
import axios from "axios";
import {
  sendConnectionRequest,
  getMyConnectionsRequest,
} from "@/config/redux/action/authaction";

function Username({ userProfile }) {
  const postReducer = useSelector((state) => state.posts);
  const authReducer = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [userPost, setUserPost] = useState([]);

  const [isCurrentUserConnection, setIsCurrentUserConnection] = useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPost = async () => {
    // if (!router.isReady) return;
    // console.log("Fetching posts for user:", router.query.username);
    await dispatch(getAllPosts());
    await dispatch(
      getMyConnectionsRequest({ token: localStorage.getItem("token") })
    );
    //  console.log("Posts after dispatch:", userProfile.pastPost);
  };
  useEffect(() => {
    if (!router.isReady) return;
    getUserPost();
  }, [router.isReady]);
  useEffect(() => {
    if (!postReducer || !postReducer.posts || !router.query.username) return;

    const post = postReducer.posts.filter(
      (p) => p?.userId?.username === router.query.username
    );

    setUserPost(post);
  }, [postReducer, router.query.username]);

  useEffect(() => {
    if (!authReducer.connection || authReducer.connection.length === 0) return;
    if (
      authReducer.connection.some(
        (user) => user.receiverId === userProfile.userId._id
      )
    ) {
      setIsCurrentUserConnection(true);
      // console.log("Connection status:", authReducer.connection.find(user=>user.receiverId === userProfile.userId._id).status);
      if (
        authReducer.connection.find(
          (user) => user.receiverId === userProfile.userId._id
        ).status === true
      ) {
        setIsConnectionNull(false);
        
      }
      console.log("Is Current User Connection:", authReducer.connection);
      
    } else {
      setIsCurrentUserConnection(false);
    }
  }, [authReducer.connection, userProfile.userId._id]);

  // useEffect(() => {
  // console.log("User Profile:", userProfile.userId._id);
  // getUserPost();
  // console.log("User Posts:", userPost);
  // }, []);

  const searchParams = useSearchParams();
  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={style.container}>
          <div className={style.backDropContainer}>
            <img
              src={
                `${BASE_URL}/${userProfile.userId.profilePicture}` ||
                "/default-profile.png"
              }
              alt="Profile"
              className={style.profileImage}
            />
          </div>
          <div className={style.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <h1 className={style.profileName}>
                    {userProfile.userId.firstName} {userProfile.userId.name}
                  </h1>
                  <p className={style.profileUsername}>
                    @{userProfile.userId.username}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.7rem",
                    alignItems: "center",
                  }}
                >
                  {isCurrentUserConnection ? (
                    <button className={style.connectionButton}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            userId: userProfile.userId._id,
                          })
                        );
                      }}
                      className={style.connectionButton}
                    >
                      {/* {isCurrentUserConnection ? "Pending" : "Connected"} */}
                      Connect
                    </button>
                  )}

                  <div
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      // Download resume logic
                      const response = await clientServer.get(
                        "/user/download_resume",
                        {
                          params: {
                            userId: userProfile.userId._id,
                          },
                        }
                      );
                      window.open(
                        `${BASE_URL}/${response.data.filePath}`,
                        "_blank"
                      );
                    }}
                  >
                    <svg
                      style={{ width: "1.2rem", height: "1.2rem" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className={style.profileBio}>
                    {userProfile.bio || "No bio available."}
                  </p>
                </div>
              </div>
              <div style={{ flex: "0.2" }}>
                <h3 className={style.recentActivity}>Recent Activity</h3>
                {/* {userPost.map((post) => (
                  <div key={post._id} className={style.recentActivityPost}>
                    <div className={style.post_card}>
                      <div className={style.post_card_profile}>
                        {post.media !== "" ? <img
                          src={
                            `${BASE_URL}/${post.media}`
                          }
                          alt="Profile"
                          className={style.post_profile_image}
                        /> : <div style={{ width: "3.4rem", height: "3.4rem", backgroundColor: "#ccc", borderRadius: "50%" }}></div>
                      }
                        {/* <div>
                          <h4 className={style.post_profile_name}>
                            {post.userId.firstName} {post.userId.name}
                          </h4>
                          <p className={style.post_profile_username}>
                            @{post.userId.username}
                          </p>
                        </div> */}
                {/* </div>
                       <div className={style.post_card_content}>
                        <p>{post.body}</p>
                      </div> 
                    </div>
                  </div>
                ))} } */}
                {userPost.length > 0 && (
                  <div className={style.recentActivityPost}>
                    <div className={style.post_card}>
                      <div className={style.post_card_profile}>
                        {userPost[0].media !== "" ? (
                          <img
                            src={`${BASE_URL}/${userPost[0].media}`}
                            alt="Profile"
                            className={style.post_profile_image}
                          />
                        ) : (
                          <div
                            style={{
                              width: "3.4rem",
                              height: "3.4rem",
                              backgroundColor: "#ccc",
                              borderRadius: "50%",
                            }}
                          ></div>
                        )}
                      </div>

                      <div className={style.post_card_content}>
                        <p>{userPost[0].body}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={style.workHistoryContainer}>
            <h4 className={style.workHistoryTitle}>Work History</h4>
            <div className={style.workHistoryContent}>
              {userProfile.pastPost && userProfile.pastPost.length >= 0 ? (
                // console.log("User work history:", userProfile.pastPost),
                userProfile.pastPost.map((work, index) => {
                  return (
                    <div key={index} className={style.workHistoryItem}>
                      {/* <h5 className={style.workHistoryItemTitle}>{work.title}</h5> */}
                      <p className={style.workHistoryItemCompany}>
                        {work.company} - {work.position}
                      </p>
                      <p className={style.workHistoryItemDuration}>
                        {work.years}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p>No work history available.</p>
              )}
            </div>
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export default Username;

export async function getServerSideProps(context) {
  const request =  await axios.get(
      `https://proconnectedlinkedinclone.onrender.com/user/get_user_profile_and_base_on_username`,
      {
      params: {
        username: context.params.username, // Assuming the username is passed as a URL parameter
      },
    }
  );
  const response = request.data;
  console.log("Response from server:", response.profile);
  return { props: { userProfile: response.profile } }; // will be passed to the page component as props
}
