import { objectType, extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ApolloError } from "apollo-server-express";
require('dotenv').config


// AuthPayload TYPE
export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type: "User",
        });
    },
});


// AuthPayload MUTATION
export const AuthMutation = extendType({
    type: "Mutation",
    definition(t) {


        // login
        t.nonNull.field("login", { 
            type: 'AuthPayload',
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
             // login input validation
            validate: ({ string }) => ({
                email: string().email().trim().required(),
                password: string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, 'Password must have 1 uppercase, 1 lowercase letter and 1 number').min(3).max(20).required()
            }),
            async resolve(parent, args, context) {
                // 1
                const user = await context.prisma.user.findUnique({
                    where: { email: args.email },
                });
                if (!user) {
                    throw new ApolloError("Sorry, user does not exist", '400');
                }

                // compare hash with password input
                const valid = await bcrypt.compare(
                    args.password,
                    user.password,
                );
                if (!valid) {
                    throw new ApolloError("Invalid password", '400');
                }

                // sign/create jwt
                const token = jwt.sign({ userId: user.id }, `${process.env.ACCESS_SECRET},  {expiresIn: '10m'}`);

                
                return {
                    token,
                    user,
                };
            },
        });

        // signup
        t.nonNull.field("signup", {
            type: "AuthPayload",
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
                name: nonNull(stringArg()),
            },
            // signup input validation
            validate: ({ string }) => ({
                email: string().email().trim().required(),
               name: string().min(2).max(50).trim().required(),
                password: string().matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).*$/, 'Password must have 1 uppercase, 1 lowercase letter and 1 number').min(3).max(20).required()
            }),
            async resolve(parent, args, context) {
                const { email, name } = args;

                // hash password
                const password = await bcrypt.hash(args.password, 10);

                const user = await context.prisma.user.create({
                    data: { email, name, password },
                });

                 // sign/create jwt
                const token = jwt.sign({ userId: user.id }, `${process.env.ACCESS_SECRET}`, {expiresIn: '10m'});

                return {
                    token,
                    user,
                };
            },
        });
    },
});