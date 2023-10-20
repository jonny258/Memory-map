import { gql } from "@apollo/client";

export const CREATE_USER = gql`
  mutation CreateUser($input: MakeUserInput!) {
    createUser(input: $input) {
      token
      user {
        _id
        username
        email
        pfp
        color
        markers {
          _id
        }
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
        pfp
        color
        markers {
          _id
        }
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
        color
      }
    }
  }
`;

export const EDIT_MARKER = gql`
mutation EditMarker($markerId: String!, $input: EditMarkerInput!) {
  editMarker(markerId: $markerId, input: $input) {
    _id
    media
    title
    createdAt
    lat
    lng
    user {
      _id
      username
      color
    }
  }
}
`;


export const DELETE_MARKER = gql`
  mutation DeleteMarker($markerId: String!) {
    deleteMarker(markerId: $markerId) {
      _id
      title
    }
  }
`;

export const EDIT_USER = gql`
  mutation EditUser($input: EditUserInput!, $userId: String!) {
    editUser(input: $input, userId: $userId) {
      user {
        _id
        username
        email
        pfp
        color
        markers {
          _id
        }
      }
      token
    }
  }
`;