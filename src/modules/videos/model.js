import db from "#pg"
import query from "./sql.js"

async function getVideos({ page, limit, search }) {
    return db(
        query.GET_VIDEOS, (page - 1) * limit, 
        limit,
        search
    )
}

async function getUserVideos({ userId }) {
    return await db(query.GET_USER_VIDEOS, userId)
}

async function createVideo({ userId, video_name, videoLink, size, mimetype }) {
    return await db(query.CREATE_VIDEO, userId, video_name, videoLink, size, mimetype)
}

async function changeVideo({ video_name, userId, video_id }) {
    return await db(query.CHANGE_VIDEO, video_name, userId, video_id)
}

async function deleteVideo({ userId, video_id }) {
    return await db(query.DELETE_VIDEO, userId, video_id)
}

export default {
    getVideos,
    getUserVideos,
    createVideo,
    changeVideo,
    deleteVideo
}