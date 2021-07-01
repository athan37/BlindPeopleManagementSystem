require('dotenv').config()

import express, { Application } from "express";
import { typeDefs, resolvers } from "./graphql"
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database"



const mount = async (app : Application) => {
    const port = `${process.env.PORT}`;
    const db = await connectDatabase();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({db, req, res }) 
    })

    server.applyMiddleware({ app, path: '/api' });


    app.get('/', (_req, res) => res.send("hello world"))
    console.log("[app]: starting at", port);
    app.listen(port);
}

mount(express());



