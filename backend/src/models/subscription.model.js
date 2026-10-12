import mongoose ,{Schema} from "mongoose"

const subscriptionSchema=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:"user"

    },
    channel :{
        type:Schema.Types.ObjectId,
        ref:"user"

    } 

},{timetamps:true})
export const Subscription =mongoose.model("Subscription",subscriptionSchema)