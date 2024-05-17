import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import {events, locations, users, participants} from './data.js'

const typeDefs = `#graphql
  type Event {
    id:ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id:ID!
    user_id:ID!
    user: User!
    participants: [Participant!]!
    location: Location!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: String!
    lng: String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
    user: User!
    username: String!
  }


  type Query {
    events: [Event!]!
    event(id:ID!): Event!

    locations: [Location!]!
    location(id:ID!): Location!

    users: [User!]!
    user(id:ID!): User!

    participants: [Participant!]!
    participant(id:ID!): Participant!
  }
`;

const resolvers = {
    Query: {
      events: () => events,
      event: (parent,args) => events.find((event) => event.id === Number(args.id)),

      locations: () => locations,
      location: (parent, args) => locations.find((location) => location.id === Number(args.id)),

      users: () => users, 
      user: (parent, args) => users.find((user) => user.id === Number(args.id)),

      participants: () => participants,
      participant: (parent, args) => participants.find((participant) => participant.id === Number(args.id)),
    },

    Event:{
      user: (parent,args) => users.find((user) => user.id === parent.user_id),
      location: (parent, args) => locations.find((location) => location.id === parent.location_id),
      participants:(parent, args) => participants.filter((participant) => participant.event_id === parent.id)
    },

    User:{
      events: (parent,args) => events.filter((event) => event.user_id === parent.id )
    },
    
    Participant:{
      user: (parent, args) =>users.find((user) =>user.id === parent.user_id),
      username: (parent, args) => {
        const user = users.find((user) =>user.id === parent.user_id);
        return user ? user.username : null;
      }
    }
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);