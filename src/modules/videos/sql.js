const GET_VIDEOS = `
    SELECT 
        video_id,
        video_name,
        video_link,
        user_id,
        video_size,
        video_mimetype,
        video_created_at,
        video_deleted_at
    FROM VIDEOS
    WHERE video_name ILIKE CONCAT('%', $3::VARCHAR, '%')
    OFFSET $1 LIMIT $2
`

const GET_USER_VIDEOS = `
    SELECT 
        video_id,
        video_name,
        video_link,
        user_id,
        video_size,
        video_mimetype,
        video_created_at,
        video_deleted_at
    FROM VIDEOS
    WHERE user_id::VARCHAR = $1
`

const CREATE_VIDEO = `
    INSERT INTO videos 
        (user_id, video_name, video_link, video_size, video_mimetype) values 
        ($1, $2, $3, $4, $5)
`

const CHANGE_VIDEO = `
    UPDATE videos SET video_name = $1 WHERE user_id = $2 AND video_id = $3
`

const DELETE_VIDEO = `
    DELETE FROM videos WHERE user_id = $1 AND video_id = $2
`

export default {
    GET_VIDEOS,
    GET_USER_VIDEOS,
    CREATE_VIDEO,
    CHANGE_VIDEO,
    DELETE_VIDEO
}