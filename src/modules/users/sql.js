const GET_USERS = `
    SELECT 
        user_id,
        user_name,
        user_profileimg,
        user_created_at,
        user_deleted_at
    FROM USERS
    OFFSET $1 LIMIT $2
`

const GET_USER = `
    SELECT 
        user_id,
        user_name,
        user_profileimg,
        user_created_at,
        user_deleted_at
    FROM USERS
    WHERE user_id::VARCHAR = $1
`

const LOGIN = `
    SELECT
        user_id,
        user_name,
        user_profileimg,
        user_created_at,
        user_deleted_at
    FROM USERS
    WHERE user_name = $1 AND user_password = $2
`

const CHECK_USER = `
    SELECT
        user_name
    FROM USERS
    WHERE user_name = $1
`

const REGISTER = `
INSERT INTO users 
    (user_name, user_password, user_profileimg) values 
    ($1::VARCHAR, $2::VARCHAR, $3::VARCHAR)
`

export default {
    GET_USERS,
    GET_USER,
    LOGIN,
    CHECK_USER,
    REGISTER
}