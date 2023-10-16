const mongoose = require('mongoose');



const studentschema = ({
    name : String,
    CurrMentor : {type : mongoose.Schema.Types.ObjectId,ref :'Mentor'},
    PrevMentor: [{type : mongoose.Schema.Types.ObjectId,ref :'Mentor'}]
});

const Student = mongoose.model('Students',studentschema)

module.exports = Student