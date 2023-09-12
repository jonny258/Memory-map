import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const HTTP_URI =
  process.env.NODE_ENV === "production"
    ? "https://memory-map-1fd827e00c4d.herokuapp.com/graphql"
    : "http://localhost:5500/graphql";

const httpLink = new HttpLink({
  uri: HTTP_URI,
});

const client = new ApolloClient({
  link: httpLink, 
  cache: new InMemoryCache(),
});

export default client;
