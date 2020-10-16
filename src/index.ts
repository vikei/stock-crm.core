import {ApolloServer} from "apollo-server";
import "reflect-metadata";
import {buildSchema} from "type-graphql";
import {Container} from "typedi";

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [__dirname + "/**/*.resolver.js"],
    container: Container,
  });
  const server = new ApolloServer({
    schema,
    playground: true,
  });
  const {url} = await server.listen(PORT);
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap().catch(console.error);
