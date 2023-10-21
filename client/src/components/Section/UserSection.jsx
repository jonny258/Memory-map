import React, { useEffect } from "react";
import SplideWrapper from "../Helpers/SplideWrapper";
import UserCard from "../Cards/UserCard";
import { GET_ALL_USERS, GET_USER_BY_ID } from "../../GraphQL/Queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import Auth from "../../utils/auth";
import { userDataVar } from "../../main";
import { useReactiveVar } from "@apollo/client";

function UserSection({ userButtonHandler }) {

  const loggedInUser = useReactiveVar(userDataVar)
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_ALL_USERS);
  
  // const [getUserById, { loading, error, data }] = useLazyQuery(GET_USER_BY_ID);

  // useEffect(() => {
  //   console.log(userDataVar())
  //   const userProfile = Auth.getProfile();
  //   if (userProfile?.data?._id) {
  //     getUserById({ variables: { userId: userProfile.data._id } });
  //   }
  // }, []);

  return (
    <div className="flex items-center">
      {userData && (
        <div className="w-[calc(80vw-60px)] items-center justify-center mx-5">
          <h2 className="text-2xl font-bold">View users memories</h2>
          <SplideWrapper>
            {userData.getAllUsers.map((user, index) => {
              return (
                <UserCard
                  key={index}
                  user={user}
                  userButtonHandler={userButtonHandler}
                />
              );
            })}
          </SplideWrapper>
        </div>
      )}
      {loggedInUser && (
        <div className="w-20vw">
          <h2 className="text-2xl font-bold mb-2">View your memories</h2>
          <UserCard
            user={loggedInUser}
            userButtonHandler={userButtonHandler}
          />
        </div>
      )}
    </div>
  );
}

export default UserSection;
