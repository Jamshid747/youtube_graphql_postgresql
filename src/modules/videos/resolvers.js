import { USER_CONFIG } from "../../config/index.js"
import { finished } from 'stream/promises'
import model from "./model.js"
import path from 'path'
import fs from 'fs'


export default {
    Mutation: {
        addVideo: async (_, {video_name, video}, { userId }) => {

            const { createReadStream, filename, mimetype } = await video

            if(mimetype != 'video/mp4') {
                throw new Error("Wrong format vide!")
            }

            const fileName = Date.now() + filename.replace(/\s/g, "")
            video_name = video_name.trim()

            if(!video_name) {
                throw new Error('Video name required!')
            }

            const out = fs.createWriteStream(path.join(process.cwd(), 'uploads', fileName));
            createReadStream().pipe(out)
            await finished(out)
            const size = Math.round(out.bytesWritten / 1024 / 1024)

            await model.createVideo({
                userId,
                video_name,
                videoLink: '/videos/' + fileName,
                size,
                mimetype
            })

            const videos = await model.getUserVideos({ userId })
            const addedVideo = videos.find(vd => vd.video_name == video_name)

            return {
                status: 200,
                message: "Video writed successfully!",
                data: addedVideo
            }
        },

        changeVideo: async (_, {video_name, video_id }, { userId }) => {

            video_name = video_name.trim()

            if(!video_name) {
                throw new Error('Video name required!')
            }

            await model.changeVideo({
                video_name,
                userId,
                video_id
            })

            const videos = await model.getUserVideos({ userId })
            const changedVideo = videos.find(vd => vd.video_id == video_id)

            return {
                status: 200,
                message: "Video name changed successfully!",
                data: changedVideo
            }
        },

        deleteVideo: async (_, { video_id }, { userId }) => {

            const videos = await model.getUserVideos({ userId })
            const deletedVideo = videos.find(vd => vd.video_id == video_id)

            if(!deletedVideo) {
                throw new Error('There is no such video!')
            }

            await model.deleteVideo({
                userId,
                video_id
            })

            return {
                status: 200,
                message: "Video deleted successfully!",
                data: deletedVideo
            }
        }
    },

    Query: {
        videos: async (_, { pagination, search }) => {
            return await model.getVideos({
                page: pagination?.page || USER_CONFIG.PAGINATION.PAGE,
                limit: pagination?.limit || USER_CONFIG.PAGINATION.LIMIT,
                search
            })
        },

        userVideos: async (_, args) => {
            return await model.getUserVideos(args)
        },

        adminVideos: async (_, args) => {
            return await model.getUserVideos(args)
        }
    },

}