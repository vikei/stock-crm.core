import {ApolloServer} from "apollo-server";
import "reflect-metadata";
import {buildSchema} from "type-graphql";
import {Container} from "typedi";
import {createConnection, useContainer} from "typeorm/index";
import {PostgresConnectionOptions} from "typeorm/driver/postgres/PostgresConnectionOptions";

const PORT = process.env.PORT ?? 4000;
const PG_URL = process.env.PG_URL ?? "postgres://user:user@localhost:5432/crm";

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

  useContainer(Container);
  await createConnection({
    url: PG_URL,
    type: "postgres",
    synchronize: true,
    entities: [__dirname + "/**/*.entity.js"],
    logging: ["query"],
  } as PostgresConnectionOptions);
}

bootstrap().catch(console.error);
