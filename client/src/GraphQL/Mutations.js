import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: MakeUserInput!) {
    createUser(input: $input) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const CREATE_MARKER = gql`
  mutation CreateMarker($userId: String!, $input: MakeMarkerInput!) {
    createMarker(userId: $userId, input: $input) {
      _id
      media
      title
      createdAt
      lat
      lng
      user {
        _id
        username
        email
      }
    }
  }
`;