import DashBoardLayout from "@/layouts/dashBoardLayout";
import UserLayout from "@/layouts/Userlayout";
import React, { useState, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAndProfile } from "../../config/redux/action/authaction/index.js";
import { getAllPosts } from "../../config/redux/action/postAction/index.js";
import style from "./profile.module.css";
import { useRouter } from "next/router";
import { BASE_URL, clientServer } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postreducer";

export default function ProfilePage() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);
  const router = useRouter();

  const dispatch = useDispatch();

  const userPost = postReducer.posts.filter(
    (post) => post.userId === authState.user?._id,
  );

  const [userProfile, setUserProfile] = useState({
    userId: {
      name: "",
      username: "",
      profilePicture: "",
    },
    bio: "",
    pastPost: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const handleDataChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    getUserInfo();
    // console.log("Auth State in Profile Page:", authState.userProfile)
  }, []);

  const getUserInfo = async () => {
    await dispatch(getUserAndProfile());
    await dispatch(getAllPosts());
  };

  useEffect(() => {
    if (authState.userProfile) {
      setUserProfile(authState.userProfile);
      // console.log("User Profile updated in Profile Page:", authState.userProfile);
    }
  }, [authState.userProfile]);

  const updateProfilePicture = async (file) => {
    // console.log("Selected file for profile picture update:", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("token", localStorage.getItem("token"));
    // console.log("Form Data to be sent for profile picture update:", formData);
    try {
      const response = await clientServer.post(
        "/updateProfile_picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      // console.log("Response from updating profile picture:", response);
      if (response.status === 200) {
        console.log("Profile picture updated successfully:", response.data);
        // Refresh user profile info
        dispatch(getUserAndProfile());
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const updateProfileData = async () => {
    try {
      // console.log("userprofile" , userProfile);
      // const responses= await clientServer.post()
      const response = await clientServer.post("/updateProfileData", {
        token: localStorage.getItem("token"),
        name: userProfile.userId.name,
        bio: userProfile.bio,
        pastPost: [...userProfile.pastPost],
      });
      if (response.status === 200) {
        // console.log("Profile data updated successfully:", response.data);
        // Refresh user profile info
        dispatch(getUserAndProfile());
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className={style.container}>
          <div className={style.backDropContainer}>
            <div className={style.backDropImage}>
              <label
                onChange={(e) => {}}
                htmlFor="editProfileInput"
                className={style.editProfileButton}
              >
                <p>Edit</p>
              </label>
              <input
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
                type="file"
                id="editProfileInput"
                style={{ display: "none" }}
              />

              <img
                src={
                  `${BASE_URL}/${userProfile?.userId?.profilePicture}` ||
                  "/default-profile.png"
                }
                alt="Profile"
                className={style.profileImage}
              />
            </div>
          </div>
          <div className={style.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div style={{ flex: "0.8" }}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    flex: "start",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    className={style.profileName}
                    type="text"
                    value={userProfile?.userId?.name || "No Name"}
                    onChange={(e) => {
                      setUserProfile({
                        ...userProfile,
                        userId: { ...userProfile.userId, name: e.target.value },
                      });
                    }}
                  />
                  <p className={style.profileUsername}>
                    @{userProfile?.userId?.username}
                  </p>
                </div>
                <div>
                  <textarea
                    className={style.profileBio}
                    rows={4}
                    cols={100}
                    value={userProfile?.bio || ""}
                    onChange={(e) => {
                      setUserProfile({ ...userProfile, bio: e.target.value });
                    }}
                  />
                </div>
              </div>
              <div style={{ flex: "0.2" }}>
                <h3 className={style.recentActivity}>Recent Activity</h3>

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
              {userProfile?.pastPost && userProfile?.pastPost.length >= 0 ? (
                // console.log("User work history:", userProfile.pastPost),
                userProfile.pastPost.map((work, index) => {
                  return (
                    <div key={index} className={style.workHistoryItemContainer}>
                      <div key={index} className={style.workHistoryItem}>
                        {/* <h5 className={style.workHistoryItemTitle}>{work.title}</h5> */}
                        <p className={style.workHistoryItemCompany}>
                          {work.company} - {work.position}
                        </p>
                        <p className={style.workHistoryItemDuration}>
                          {work.years}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No work history available.</p>
              )}
              <button
                className={style.editWorkHistoryButton}
                onClick={() => {
                  // console.log("Edit work history item:", work);
                  // You can implement the logic to edit the work history item here
                  setModalOpen(true);
                }}
              >
                Add/Edit
              </button>
            </div>
          </div>
          {userProfile !== authState.userProfile && (
            <>
              <button
                className={style.updateProfileButton}
                onClick={() => {
                  updateProfileData();
                }}
              >
                UpdateProfile
              </button>
            </>
          )}
        </div>
        {modalOpen && (
          <div
            className={style.commentContainer}
            onClick={() => {
              // dispatch(resetPostId());
              setModalOpen(false);
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={style.allComments}
            >
              <input
                type="text"
                className={style.inputField}
                placeholder=" Enter Company Name"
                // value={userProfile?.userId?.name || ""}
                name="company"
                onChange={(e) => {
                  handleDataChange(e);
                }}
              />
              <input
                type="text"
                className={style.inputField}
                placeholder=" Enter Position"
                // value={userProfile?.userId?.name || ""}
                name="position"
                onChange={(e) => {
                  handleDataChange(e);
                }}
              />
              <input
                type="text"
                className={style.inputField}
                placeholder=" Enter Years"
                // value={userProfile?.userId?.name || ""}
                name="years"
                onChange={(e) => {
                  handleDataChange(e);
                }}
              />

              <button
                className={style.editWorkHistoryButton}
                onClick={() => {
                  if (
                    !inputData.company ||
                    !inputData.position ||
                    !inputData.years
                  ) {
                    alert("Please fill all fields");
                    return;
                  }
                  // console.log("Input data for work history update:", inputData);
                  // You can implement the logic to update the work history item here using the inputData state
                  setUserProfile({
                    ...userProfile,
                    pastPost: [...userProfile.pastPost, inputData],
                  });
                  setModalOpen(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
}
