import React, { useEffect, useState } from "react";
import SplideWrapper from "./SplideWrapper";
import MarkerCard from "./MarkerCard";
import UserCard from "./Social/UserCard";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_ALL_MARKERS,
  GET_ALL_USERS,
  GET_USER_BY_ID,
} from "../GraphQL/Queries";
import { userDataVar } from "../main";
import { useReactiveVar } from "@apollo/client";

function MemorySection({
  userId,
  viewAllButtonHandler,
  viewPointInMapHandler,
}) {
  const loggedInUserData = useReactiveVar(userDataVar);
  const { loading, error, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId },
  });

  const [isMyProfile, setIsMyProfile] = useState();
  // useEffect(() => {
  //   console.log(data.getUserById);
  // }, [data]);

  console.log(loggedInUserData);

  useEffect(() => {
    if (loggedInUserData && data) {
      if (data.getUserById._id === loggedInUserData._id) {
        setIsMyProfile(true);
      } else {
        setIsMyProfile(false);
      }
    }
  }, []);

  return (
    <section className="flex">
      {data && (
        <>
          <div className="w-[20vw]">
            <UserCard
              user={isMyProfile ? loggedInUserData : data.getUserById}
              userButtonHandler={() => {
                console.log("asdfasfdasfasf");
              }}
            />
          </div>

          <div className="w-[60vw]">
            <SplideWrapper>
              {isMyProfile ? (
                <>
                  {loggedInUserData.markers.map((point, index) => {
                    return (
                      <MarkerCard
                        viewPointInMapHandler={viewPointInMapHandler}
                        key={index}
                        point={point}
                        isMyProfile={isMyProfile}
                      />
                    );
                  })}
                </>
              ) : (
                <>
                  {data.getUserById.markers.map((point, index) => {
                    return (
                      <MarkerCard
                        key={index}
                        point={point}
                        isMyProfile={isMyProfile}
                        viewPointInMapHandler={viewPointInMapHandler}
                      />
                    );
                  })}
                </>
              )}
            </SplideWrapper>
          </div>
          <button
            className="btn w-[20vw] h-[400px]"
            onClick={viewAllButtonHandler}
          >
            <h2>View All</h2>
          </button>
        </>
      )}
    </section>
  );
}

export default MemorySection;
