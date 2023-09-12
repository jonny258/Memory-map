import React, { useEffect } from "react";
import SplideWrapper from "./SplideWrapper";
import UserCard from "./Social/UserCard";
import {
  GET_ALL_USERS,
  GET_USER_BY_ID,
} from "../GraphQL/Queries";
import { useQuery, useLazyQuery } from "@apollo/client";
import Auth from '../utils/auth'

function UserSection({ userButtonHandler }) {
  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useQuery(GET_ALL_USERS);
  const [getUserById, { loading, error, data }] = useLazyQuery(GET_USER_BY_ID);
  
  useEffect(() => {
    const userProfile = Auth.getProfile();
    if (userProfile?.data?._id) {
      getUserById({ variables: { userId: userProfile.data._id } });
    }
  }, []);

  return (
    <>
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
        {data && (
          <div className="w-20vw">
            <h2 className="text-2xl font-bold mb-2">View your memories</h2>
            <UserCard
              user={data.getUserById}
              userButtonHandler={userButtonHandler}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default UserSection;
