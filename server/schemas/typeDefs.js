const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: String!
        email: String!
        password: String!
        username: String!
        color: String!
        pfp: String
        markers: [Marker]
        likes: [Like]
    }

    type Marker {
        _id: String!
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
        _id: String!
        user: User!
        marker: Marker!
    }

    type AuthPayload {
        token: String!
        user: User!
      }

    type Query {
        getAllUsers: [User]
        getUserById(userId: String!): User
        getAllMarkers: [Marker]
        getMarkerById(markerId: String!): Marker
    }

    type Mutation {
        createUser(input: MakeUserInput!): AuthPayload
        loginUser(email: String!, password: String!): AuthPayload
        editUser(input: EditUserInput!, userId: String!): AuthPayload
        deleteUser(userId: String!): User
        createMarker(input: MakeMarkerInput!, userId: String!): Marker
        editMarker(markerId: String!, input: EditMarkerInput!): Marker
        deleteMarker(markerId: String!): Marker
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