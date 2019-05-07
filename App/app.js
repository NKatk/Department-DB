const express = require('express');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();


// установка схемы
const departmentDataSchema = new Schema({
    courseName: {
        type: String,
        unique: true
    },
    description: String,
    participantsCourse: [{
        name: String,
        dateBirth: Date,
        phone: Number,
        mail: String,
        dateCreate: Date
    }]
}, {versionKey: false});

// подключение
mongoose.connect("mongodb://localhost:27017/departmentData",{useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true},
    (err)=>{
        if(err){
            console.log('Не удалось подключить Базу Данных, включите базу данных и перезапустите программу!')
        }});

const DepartmentData = mongoose.model("DepartmentData", departmentDataSchema);



app.use(express.static('public'));


app.get('/api/takeData', (req, res) => {
    DepartmentData.find({}, (err, result) => {
        if (err) return console.log(err);
        res.end(JSON.stringify(result));
    })
});

app.delete('/api/deleteElement', jsonParser, (req, res)=>{

    DepartmentData.findByIdAndDelete(req.body.id, (err, result)=> {
        if (err) {
            console.log(err);
        } else if (result === null) {
            res.end(JSON.stringify({msg:'ERR deleted'}));
            return console.log('ERR deleted')
        } else {
            res.end(JSON.stringify({msg:'OK'}))
        }
    });
});


app.post('/api/createElement', jsonParser, (req, res)=>{
    const dateCourse = req.body;

    const departmentData = new DepartmentData({
        courseName: dateCourse.courseName,
        description: dateCourse.description,
        participantsCourse: []
    });


    departmentData.save(function(err) {
        if(err) {
            if (err.code === 11000) {
                res.end(JSON.stringify({msg:'Value Not Unique'}))
            } else {
                res.end(JSON.stringify({msg:'DB Err'}))
            }
        }else{
            res.end(JSON.stringify({msg:'OK'}))
        }

    });
});


app.put('/api/changeElement', jsonParser, (req, res)=>{

    const dateCourse = req.body;

    DepartmentData.findOneAndUpdate({_id: dateCourse.id}, dateCourse, (err)=>{
        if (err) {
            if (err.code === 11000) {
                res.end(JSON.stringify({msg:'Value Not Unique'}))
            } else {
                res.end(JSON.stringify({msg:'DB Err'}))
            }
        }else{
            res.end(JSON.stringify({msg:'OK'}))
        }
    });
});


app.delete('/api/deletePerson', jsonParser, (req, res)=>{
    DepartmentData.findByIdAndUpdate(req.body.idCourse,{$pull:{participantsCourse: {_id:req.body.idPerson}}}, (err, result)=>{
        if (err) {
            res.end(JSON.stringify({msg:'DB Err'}));
            return console.log(err);
        } else if (result === null) {
            res.end(JSON.stringify({msg:'ERR deleted'}));
            return console.log('ERR deleted')
        } else {
            res.end(JSON.stringify({msg:'OK'}))
        }

    });
});


app.post('/api/createPerson', jsonParser, (req, res)=>{
    const idDoc = req.body[0].idCourse;
    const obj = req.body[1];

    const createPerson = (idCourse, obj) => {
        const datePerson = obj;

        let dateCreate = new Date();
        datePerson.dateCreate = dateCreate;

        DepartmentData.findOneAndUpdate({_id: idCourse},
            {'$push':{'participantsCourse': datePerson}}, (err, result)=>{
                if (err){
                    if(err.reason.path === 'dateBirth'){
                        res.end(JSON.stringify({msg:'ERR dateBirth'}));
                        return console.log('ERR dateBirth');
                    }else if(err.reason.path === 'phone'){
                        res.end(JSON.stringify({msg:'ERR phone'}));
                        return console.log('ERR phone');
                    }else if(err.reason.path === 'dateCreate'){
                        res.end(JSON.stringify({msg:'ERR dateCreate'}));
                        return console.log('ERR dateCreate');
                    }else{
                        res.end(JSON.stringify({msg:'DB Err'}));
                        return console.log('DB Err');
                    }
                }else{
                    res.end(JSON.stringify({msg:'OK'}))
                }
            })
    };


    DepartmentData.find({}, (err, result) => {

        if (err) return console.log(err);

        let arrUniqueMail = [];
        for(let i = 0; i < result.length; i++){
            if(result[i].participantsCourse.length !== 0){
                for(let j = 0; j < result[i].participantsCourse.length; j++){
                    arrUniqueMail.push(result[i].participantsCourse[j].mail);
                }
            }
        }


        let mailStr = obj.mail + '';
        if (arrUniqueMail.length === 0){
            createPerson(idDoc, obj);
        }else if(arrUniqueMail.indexOf(mailStr) !== -1){
            console.log(JSON.stringify({msg:'ERR unique mail'}));
            res.end(JSON.stringify({msg:'ERR unique mail'}))
        }else{
            createPerson(idDoc, obj);
        }
    })
});


app.put('/api/changePerson', jsonParser, (req, res)=>{
    const idDoc = req.body[0].idCourse;
    const obj = req.body[1];


    const changePerson = (idCourse, obj) => {
        const datePerson = obj;

        DepartmentData.findOneAndUpdate({_id: idCourse},
            {'$set':{'participantsCourse.$[element]': datePerson}},
            {'arrayFilters': [{'element._id': datePerson.id }]},
            (err, result)=>{
                if (err){
                    if(err.reason.path === 'dateBirth'){
                        res.end(JSON.stringify({msg:'ERR dateBirth'}));
                        return console.log('ERR dateBirth');
                    }else if(err.reason.path === 'phone'){
                        res.end(JSON.stringify({msg:'ERR phone'}));
                        return console.log('ERR phone');
                    }else if(err.reason.path === 'dateCreate'){
                        res.end(JSON.stringify({msg:'ERR dateCreate'}));
                        return console.log('ERR dateCreate');
                    }else{
                        res.end(JSON.stringify({msg:'DB Err'}));
                        return console.log('DB Err');
                    }
                }else{
                    res.end(JSON.stringify({msg:'OK'}))
                }

            });
    };


    DepartmentData.find({}, (err, result) => {

        if (err) return console.log(err);

        let arrUniqueMail = [];
        for(let i = 0; i < result.length; i++){
            if(result[i].participantsCourse.length !== 0){
                for(let j = 0; j < result[i].participantsCourse.length; j++){
                    let checkId = result[i].participantsCourse[j]._id + '';
                    if(checkId !== obj.id) {
                        arrUniqueMail.push(result[i].participantsCourse[j].mail);
                    }
                }
            }
        }

        let mailStr = obj.mail + '';
        if(arrUniqueMail.length === 0){
            changePerson(idDoc, obj);
        }else if(arrUniqueMail.indexOf(mailStr) !== -1){
            res.end(JSON.stringify({msg:'ERR unique mail'}))
        } else {
            changePerson(idDoc, obj);
        }
    })

});

app.get('*', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html')
});


app.listen(3000, () => console.log('Listening on port 3000!'));


