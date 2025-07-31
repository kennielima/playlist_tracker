import express, { Request, Response } from "express";
import { generateRandomString } from "../lib/utils";
import queryString from "query-string";
import prisma from "../lib/prisma";
import jwt from 'jsonwebtoken';

async function login(req: Request, res: Response) {
    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read user-follow-read user-read-recently-played';

    const params = queryString.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
        state: state
    })
    res.redirect(`${process.env.SPOTIFY_AUTH_URI}?${params}`);
};

async function callback(req: Request, res: Response) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        return res.status(500).json({ error: 'state_mismatch' })
    }
    if (!code) {
        return res.status(500).json({ error: 'no_code' })
    }

    try {
        const tokenResponse = await fetch(`${process.env.TOKEN_API}`, {
            method: 'POST',
            body: queryString.stringify({
                code: code as string,
                redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
                grant_type: 'authorization_code'
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
            }
        })

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.text();
            console.error('Token exchange failed:', errorData);
            return res.status(400).json({ error: 'token_exchange_failed' + errorData });
        }
        const tokenData = await tokenResponse.json();

        const userResponse = await fetch(`${process.env.SPOTIFY_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        })
        const userData = await userResponse.json();
        console.log('spotifyuser-token', userData, tokenResponse);

        const existingUser = await prisma.user.findUnique({
            where: {
                spotifyId: userData.id,
                email: userData.email
            }
        })
        let newUser;
        if (!existingUser) {
            newUser = await prisma.user.create({
                data: {
                    spotifyId: userData.id,
                    name: userData.display_name,
                    email: userData.email,
                    spotifyaccessToken: tokenData.access_token,
                    spotifyrefreshToken: tokenData.refresh_token,
                    tokenExpiry: tokenData.expires_in
                }
            })
        }
        let user = existingUser || newUser;
        const token = jwt.sign({
            id: user?.id,
        },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        )
        console.log('user', user, 'jwttoken', token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'PRODUCTION',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.redirect(`${process.env.BASE_URL}/spotify/callback`);
    } catch (error) {
        console.error("Error fetching Spotify token:", error);
        return res.status(500).json({ error: "Internal server error while fetching Spotify token" });
    }
};

export { login, callback }