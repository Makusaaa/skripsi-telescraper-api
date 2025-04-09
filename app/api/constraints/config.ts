import 'dotenv/config';

if(!process.env.APP_API_PORT)
    throw new Error("APP_API_PORT is not found on .env")
if(!process.env.JWT_SECRET_KEY)
    throw new Error("JWT_SECRET_KEY is not found on .env")
if(!process.env.TELEGRAM_API_ID)
    throw new Error("TELEGRAM_API_ID is not found on .env")
if(!process.env.TELEGRAM_API_HASH)
    throw new Error("TELEGRAM_API_HASH is not found on .env")
if(!process.env.TELEGRAM_PHONE_NUMBER)
    throw new Error("TELEGRAM_PHONE_NUMBER is not found on .env")
if(!process.env.POSTGRESQL_DATABASE_URL)
    throw new Error("POSTGRESQL_DATABASE_URL is not found on .env")
if(!process.env.GOOGLE_CLIENT_ID)
    throw new Error("GOOGLE_CLIENT_ID is not found on .env")
if(!process.env.GOOGLE_CLIENT_SECRET)
    throw new Error("GOOGLE_CLIENT_SECRET is not found on .env")

export default {
    APP_API_PORT: process.env.APP_API_PORT,
    POSTGRESQL_DATABASE_URL: process.env.POSTGRESQL_DATABASE_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    TELEGRAM_API_ID: process.env.TELEGRAM_API_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TELEGRAM_API_HASH: process.env.TELEGRAM_API_HASH,
    TELEGRAM_PHONE_NUMBER: process.env.TELEGRAM_PHONE_NUMBER,
}