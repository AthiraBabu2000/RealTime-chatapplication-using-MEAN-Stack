const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const userSchema =new Schema({
 userName:{
    type:String
},
 email:{
    type:String,unique:true
},
 password:{
    type:String,required:true
},
dp:{
    type : String
},
 created_at:{
    type:Number,default:Date.now().valueOf()

},

 updated_at:{
    type:Number,default:Date.now().valueOf()
},

});

module.exports=mongoose.model('Users',userSchema)







