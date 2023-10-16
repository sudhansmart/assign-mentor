const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// importing models
const Mentor = require('./models/mentor');
const Student = require('./models/student')
const app = express();
const port = process.env.PORT;
const DB = process.env.DB_URL
// const PORT = 3000 ;
// const DB_URL = ""
app.use(bodyParser.json())
// connecting mongoDB
mongoose
.connect(DB,{})
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log("MongoDB Not Connected :",err.message))
// Create- Adding Mentors
app.post('/mentor',async(req,res)=>{
    try {
        const mentor = new Mentor(req.body);
        await mentor.save()
        res.status(200).send(mentor)
    } catch (err) {
        res.status(404).send(err.message)
    }
});
// Create- Adding Students  
app.post('/student',async(req,res)=>{
    try {
        const student = new Student(req.body);
        await student.save()
        res.status(201).send(student)
    } catch (err) {
        res.status(404).send(err.message)
    }
})

//  Assigning a students to Mentor
app.post('/mentor/:mentorid/assign',async(req,res)=>{
      const mentor = await Mentor.findById(req.params.mentorid);
      const students= await Student.find({_id :{$in :req.body.students}})
      try {
        students.forEach(student =>{
            student.CurrMentor = mentor._id;
            student.save();
        })
        mentor.students =[...mentor.students,...students.map(student=>student._id)]
        await mentor.save()
        res.send(mentor)
      } catch (error) {
        res.status(404).send(error.message)
      }
})
// changing the mentor for specific student 
app.put('/student/:studentid/assignmentor/:mentorid',async(req,res)=>{
  try {
    const student = await Student.findById(req.params.studentid);
    const mentor = await Mentor.findById(req.params.mentorid)
    if(student.CurrMentor){
        student.PrevMentor.push(student.CurrMentor)
    }
    student.CurrMentor = mentor._id
    await student.save()
    res.send(student)
    mentor.students = [...mentor.students,student._id] 
    await mentor.save()
   
  } catch (error) {
    res.status(404).send(error.message)
  }
})

// Api TO Show students in particular Mentor
app.get ('/mentors/:mentorId/students',async(req,res)=>{
    try {
        const mentor = await Mentor.findById(req.params.mentorId).populate('students')
        res.send(mentor);
    } catch (error) {
        res.status(404).send(error.message)
    }
}) 
// Api To show previousMentor for particular student
app.get ('/pmentors/:studentid/prevmentors',async(req,res)=>{
    try {
        const pmentor = await Student.findById(req.params.studentid).populate('PrevMentor')
        res.send(pmentor);
    } catch (error) {
        res.status(404).send(error.message)
    }
}) 



app.listen(port,()=>{
    console.log("Server is running at PORT:",port)
})