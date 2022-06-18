import * as jwt from "jsonwebtoken";
require('dotenv').config

export interface AuthTokenPayload {  // 1
    userId: number;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload { // 2
    const token = authHeader.replace("Bearer ", "");  // 3

    if (!token) {
        throw new Error("No token found");
    }
    return jwt.verify(token, `${process.env.ACCESS_SECRET}`) as AuthTokenPayload;  // 4
}