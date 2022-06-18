import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from 'express';
import http from 'http';
import { context } from "./context";  
import depthLimit from 'graphql-depth-limit'
import { schema } from "./schema";
require('dotenv').config()


async function listen(port: number | string) {
  const app = express();
  const httpServer = http.createServer(app);


  const server = new ApolloServer({
    schema,
    context,
    introspection: process.env.NODE_ENV !== 'production',
    validationRules: [depthLimit(4)],
    csrfPrevention: true,
    formatError: (err): Error => {
        if (err.message.startsWith('Database Error: ')) {
          return new Error('Internal server error');
        }
    
        return err;
      },
    cache: 'bounded',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    
  });


  await server.start();

  server.applyMiddleware({ app });


  return new Promise((resolve, reject) => {
    httpServer.listen(port).once('listening', resolve).once('error', reject)
  })
}

const port = process.env.PORT || 4000 as number;
async function main() {
  try {
    await listen(port)
    console.log(`🚀 Server GOOD & is ready at http://localhost:${port}/graphql`)
  } catch (err) {
    console.error('💀 Error starting server', err)
  }
}

void main()