import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      username
      email
      password
      color
      pfp
      markers {
        _id
        lat
        lng
        user {
          _id
          username
          email
        }
      }
      likes {
        _id
      }
    }
  }
`;
