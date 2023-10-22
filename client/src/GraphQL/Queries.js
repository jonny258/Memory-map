import { gql } from "@apollo/client";

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

export const GET_ALL_MARKERS = gql`
  query {
    getAllMarkers {
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

export const GET_USER_BY_ID = gql`
  query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      _id
      username
      email
      pfp
      color
      markers {
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
  }
`;

export const GET_MARKER_BY_ID = gql`
  query GetMarkerById($markerId: String!) {
    getMarkerById(markerId: $markerId) {
      _id
      title
      media
      description
      lat
      lng
      createdAt
      user {
        _id
        username
        email
        pfp
      }
      likes {
        _id
      }
    }
  }
`;
