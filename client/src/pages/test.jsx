import React, { useEffect } from 'react'

import { GET_ALL_USERS } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client";

function Test() {
  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    onCompleted: (data) => {
      console.log('Query completed:', data);
    },
    onError: (error) => {
      console.log('Query error:', error);
    }
  });
    useEffect(() => {
        console.log(data);
        console.log(error);
        console.log(loading)
      }, [data, error, loading]);
  return (
    <div className="bg-gray-600 p-4 m-4 rounded-md">Test</div>
  )
}

export default Test