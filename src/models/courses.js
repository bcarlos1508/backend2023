import mongoose, { mongo } from "mongoose";

const courseCollection = 'courses';

const courseSchema = mongoose.Schema({
    title: String,
    description: String,
    difficulty: Number,
    topics: {
        type: Array,
        default: []
    },
    professor: String,
    studentes: {
        type:Array,
        default:[]
    }
})

const courseModel = mongoose.model(courseCollection, courseSchema);

export default courseModel;