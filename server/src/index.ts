require('dotenv').config()
import compression from "compression";

import express, { Application } from "express";
import { typeDefs, resolvers } from "./graphql"
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database"
import cookieParser from "cookie-parser";



const mount = async (app : Application) => {
    const port = `${process.env.PORT}`;
    const db = await connectDatabase();

    app.use(cookieParser(process.env.SECRET));
    app.use(compression());
    //There will be a client file
    app.use(express.static(`${__dirname}/client`))
    //Uncomment line bellow when deploy together with dot env
    // app.get("/*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`))

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



