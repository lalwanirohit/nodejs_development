import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import dotenv from "dotenv";
dotenv.config();


const port = process.env.PORT_NUMBER;
const app = express();

app.use(express.json());

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Query {
            events: [String!]!
        }

        type Mutation {
            createEvent(name: String): String
        }
    `),
    rootValue: {
        events: () => {
            return ['birthday celebration', 'engagement ceremony', 'weddin ceremony'];
        },
        createEvent: (args) => {
            return args.name;
        }
    },
    graphiql: true
}));

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});