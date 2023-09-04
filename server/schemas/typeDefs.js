const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        _id: ID!
        name: String!
    }

    type Query {
        getAllUsers: [User]
    }

    type Mutation {
        deleteUser: [User]
    }
`

module.exports = typeDefs;