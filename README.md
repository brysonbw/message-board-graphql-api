#  Message Board Graphql API
- Authentication and authorization with json web token
- Read, create, and delete post and vote on post

## Backend
- Node
- Apollo Server/Express
- Graphql/Nexus
- Typescript

## Database
- PostgreSQL
- Prisma ORM

## Running locally

```
1. clone repo

git clone git@github.com:brysonbw/public-message-board-graphql-api.git

cd public-message-board-graphql-api

2. In project directory (open terminal) -> install dependencies

npm install or yarn install

4. Setup PostgreSQL Database on local machine or heroku

local example: https://www.prisma.io/docs/reference/database-reference/connection-urls

heroku example: https://dev.to/prisma/how-to-setup-a-free-postgresql-database-on-heroku-1dc1

5. ENV variables for .env.example file 

ACCESS_SECRET=<your_jwt_secret>

DATABASE_URL="<your_connection_url_string>"

3. Run app in the development mode

npm run dev

// update schema.graphql and nexus-typegen.ts

npm run generate

open http://localhost:4000/graphql to view api/Apollo Sandbox 
```
