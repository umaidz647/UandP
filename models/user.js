let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let User = mongoose.Schema({
    username:
    {
        type:String,
        defult:"",
        trim:true,
        required:"Username is required"
    },
    /*
    password:
    {
        type:String,
        defult:"",
        trim:true,
        required:"Password is required"
    } 
    */
   created:
   {
        type:Date,
        default:Date.now
   },
   update:
   {
        type:Date,
        default:Date.now
   },
},
{
    collection: "user"
}
)

//configure options for user model
let options = ({MissingPasswordError: 'Wrong/Missing Password'});
User.plugin(passportLocalMongoose, options);
module.exports.User = mongoose.model('User', User);