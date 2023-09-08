import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const HTTP_URI = "http://localhost:5500/graphql";

const httpLink = new HttpLink({
  uri: HTTP_URI,
});

const client = new ApolloClient({
  link: httpLink, 
  cache: new InMemoryCache(),
});

export default client;
