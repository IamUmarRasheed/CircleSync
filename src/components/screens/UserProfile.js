import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showfollow, setShowFollow] = useState(
    state && state.following ? !state.following.includes(userid) : true
  );

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userid]);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers, data._id],
          },
        }));
        setShowFollow(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setProfile((prevState) => {
          const newFollowers = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        setShowFollow(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }} className="profile">
      {userProfile ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",

              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              {/* {console.log("helll profile",userProfile.user.pic)} */}
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.pic}
                alt="Profile Picture"
              />
            </div>
            <div>
              <h4 style={{ color: "springgreen", fontWeight: "bold" }}>
                {userProfile.user?.name ? userProfile.user?.name.toUpperCase() : ""}
              </h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>
                  {userProfile.posts && userProfile.posts.length}{" "}
                  {userProfile.posts && userProfile.posts.length === 1
                    ? "post"
                    : "posts"}
                </h6>
                <h6>
                  {userProfile.user.followers &&
                    userProfile.user.followers.length}{" "}
                  {userProfile.user.followers &&
                  userProfile.user.followers.length === 1
                    ? "follower"
                    : "followers"}
                </h6>
                <h6>
                  {userProfile.user.following &&
                    userProfile.user.following.length}{" "}
                  following
                </h6>
              </div>
              {showfollow ? (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={followUser}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: "10px",
                  }}
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={unfollowUser}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>

          <div className="gallery">
            {userProfile.posts &&
              userProfile.posts.map((item) => (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              ))}
          </div>
        </>
      ) : (
        <h2>Loading...!</h2>
      )}
    </div>
  );

    }

export default Profile;
