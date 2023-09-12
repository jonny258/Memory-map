import React,{ useEffect } from 'react'
import SplideWrapper from './SplideWrapper';
import MarkerCard from './MarkerCard';
import UserCard from './Social/UserCard';
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_MARKERS, GET_ALL_USERS, GET_USER_BY_ID } from "../GraphQL/Queries";


function MemorySection({userId, viewAllButtonHandler}) {
    const { loading, error, data } = useQuery(GET_USER_BY_ID, {
        variables: { userId: userId  }
      });
      useEffect(()=> {
        console.log(data.getUserById)
      }, [data])

  return (
    <section className="flex">
    <div className="w-[20vw]">
      <UserCard
        user={data.getUserById}
        userButtonHandler={()=> {console.log("asdfasfdasfasf")}}
      />
    </div>

    <div className="w-[60vw]">
      <SplideWrapper>
        {data.getUserById.markers.map((point, index) => {
          return <MarkerCard key={index} point={point} />;
        })}
      </SplideWrapper>
    </div>
    <button
      className="btn w-[20vw] h-[400px]"
      onClick={viewAllButtonHandler}
    >
      <h2>View All</h2>
    </button>
  </section>
  )
}

export default MemorySection