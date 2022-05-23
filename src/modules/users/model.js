import db from "#pg"
import query from "./sql.js"
import sha256 from "sha256"

async function getUsers({ page, limit }) {
    return db(query.GET_USERS, (page - 1) * limit, limit)
}

async function getUser({ userId }) {
    const [user] = await db(query.GET_USER, userId)
    return user
}

async function login({ username, password }) {
    const [user] = await db(query.LOGIN, username, sha256(password))
    return user
}

async function checkUser({ username }) {
    const [user] = await db(query.CHECK_USER, username)
    return user
}

async function createUser({ username, password, fileName }) {
    const [user] = await db(query.REGISTER, username, sha256(password), fileName)
    return user
}


export default {
    getUsers,
    getUser,
    login,
    checkUser,
    createUser
}