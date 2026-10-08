import mongoose from "mongoose";

const connectionRequest = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SocialUser"
    },
    connectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SocialUser"
    },
    status_accepted:{
        type:Boolean,
        default:null
    }
})
const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequest);
export default ConnectionRequest;