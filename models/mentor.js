
const mongoose = require('mongoose');

const mentorschema = ({
    name : String,
    students : [{type : mongoose.Schema.Types.ObjectId,ref :'Students'}]
});

const Mentor = mongoose.model('Mentor',mentorschema)

module.exports = Mentor
