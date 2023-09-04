const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID!
        email: String!
        password: String!
        username: String!
        color: String!
        pfp: String
        markers: [Marker]
        likes: [Like]
    }

    type Marker {
        _id: ID!
        lat: Float!
        lng: Float!
        title: String!
        description: String
        createdAt: String!
        media: String!
        user: User!
        likes: [Like]
    }
    type Like {
        _id: ID!
        user: User!
        marker: Marker!
    }

    type AuthPayload {
        token: String!
        user: User!
      }

    type Query {
        getAllUsers: [User]
        getUserById(userId: ID!): User
        getAllMarkers: [Marker]
        getMarkerById(markerId: ID!): Marker
    }

    type Mutation {
        createUser(input: MakeUserInput!): AuthPayload
        loginUser(email: String!, password: String!): AuthPayload
        editUser(input: EditUserInput!, userId: ID!): AuthPayload
        deleteUser(userId: ID!): User
        createMarker(input: MakeMarkerInput!, userId: ID!): Marker
        editMarker(markerId: ID!, input: EditMarkerInput!): Marker
        deleteMarker(markerId: ID!): Marker
        likeMarker(markerId: String!, userId: String!): Like
        unlikeMarker(markerId: String!, userId: String!): Like
    }

    input MakeMarkerInput {
        lat: Float!
        lng: Float!
        title: String!
        description: String
        media: String!
    }

    input EditMarkerInput {
        title: String
        description: String
        media: String
    }

    #Maybe I should have more then just this one because the user input is more then just that

    input MakeUserInput {
        username: String!
        email: String!
        password: String!
        color: String!
        pfp: String
        #I need to add in how the markers get added
      }

      input EditUserInput {
        username: String
        email: String
        password: String
        color: String
        pfp: String
      }
`

module.exports = typeDefs;