import React from "react";
import SplideWrapper from "./SplideWrapper";
import UserCard from "./Social/UserCard";
import {
  GET_ALL_MARKERS,
  GET_ALL_USERS,
  GET_USER_BY_ID,
} from "../GraphQL/Queries";
import { useQuery, useLazyQuery } from "@apollo/client";

function UserSection({ userButtonHandler}) {
  const {
    loading: userLoading, 
    error: userError,
    data: userData,
  } = useQuery(GET_ALL_USERS);

  return (
    <>
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
    </>
  );
}

export default UserSection;
