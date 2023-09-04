const { User } = require("../models")

const resolvers = {
    Query: {
        getAllUsers: async () => {
            return await User.find({})
        }
    },
    Mutation: {

    }
}

module.exports = resolvers;