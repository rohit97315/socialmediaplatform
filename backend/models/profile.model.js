import mongoose from "mongoose";

const educationSchema = mongoose.Schema({
    school:{
        type:String,
        default:''
    },
    degree:{
        type:String,
        default:''
    },
    fieldOfStudy:{
        type:String,
        default:''
    }
})


const workSchema = mongoose.Schema({
    company:{
        type:String,
        defualt:''
    },
    position:{
        type:String,
        defualt:''
    },
    years:{
        type:String,
        defualt:''
    }
})


const ProfileSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SocialUser"
    },
    bio:{
        type:String,
        default:''
    },
    currentPost:{
        type:String,
        defualt:''
    },
    pastWork:{
        type:[workSchema],
        default:[]
    },
    education:{
        type:[educationSchema],
        default:[]
    }
})


const Profile = mongoose.model('Profile',ProfileSchema);
export default Profile;