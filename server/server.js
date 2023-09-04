const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { makeExecutableSchema } = require('@graphql-tools/schema');

const PORT = process.env.PORT || 5500;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  // playground: true, // Enable playground always or you can set based on your condition
});

const app = express();

const startServer = async () => {
  // Ensure MongoDB connection is established
  db.once("open", async () => {
    console.log("Connected to MongoDB");

    // Start Apollo Server before applying middleware
    await server.start();

    // Apply ApolloServer middleware to the Express server
    server.applyMiddleware({ app });

    // Listen on the port
    app.listen(PORT, () => {
      console.log(`Server is live at http://localhost:${PORT}`);
      console.log(`GraphQL server is live at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startServer();
