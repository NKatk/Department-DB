import React, {Component} from 'react';

class CreateElement extends Component {
    constructor(){
        super();
        this.state = {
            valName: false,
            valDateBirth: false,
            valPhone: false,
            valMail: false
        }
    }

    createDataPerson = () =>{
        let dataForm = document.getElementById('dataForm');

        if (this.state.valName && this.state.valDateBirth && this.state.valPhone && this.state.valMail) {
            fetch('/api/createPerson',  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([{
                    idCourse: this.props.id
                },{
                    name: dataForm.namePerson.value,
                    dateBirth: dataForm.dateBirth.value,
                    phone: dataForm.phone.value,
                    mail: dataForm.mail.value
                }])
            })
                .then(res => res.json())
                .then(
                    (result) =>{
                        if(result.msg === 'OK'){
                            alert('Создание успешно.');
                            this.props.updateData(true);
                            this.props.createPerson(false)
                        }else if(result.msg ==='ERR unique mail'){
                            alert('Почта не уникальна, измените значение.');
                        }else if(result.msg ==='ERR dateBirth'){
                            alert('Дата рождения не корректна, измените значение.');
                        }else if(result.msg ==='ERR phone'){
                            alert('Номер телефона не корректен, измените значение..');
                        }else if(result.msg ==='ERR dateCreate'){
                            alert('Ошибка баз данных."Создание даты".');
                            this.props.updateData(true);
                            this.props.createPerson(false)
                        }else if(result.msg === 'DB Err'){
                            alert('Ошибка баз данных.');
                            this.props.updateData(true);
                            this.props.createPerson(false)
                        }

                    },
                    (error)=>{
                        console.log(error);
                        this.props.updateData(true);
                        this.props.createPerson(false)
                    }
                )

        }else{
            alert('Заполните все поля корректно!')
        }
    };


    onChangeName = (val) =>{
        if(val.length >= 3){
            this.setState({
                valName: true
            })
        }else{
            this.setState({
                valName: false
            })
        }
    };

    onChangeDate = (val) =>{
        if(val){
            this.setState({
                valDateBirth: true
            })
        }else{
            this.setState({
                valDateBirth: false
            })
        }
    };

    onChangePhone = (val) =>{
        if(val.length >= 7){
            this.setState({
                valPhone: true
            })
        }else{
            this.setState({
                valPhone: false
            })
        }
    };

    onChangeMail = (val) =>{
        function checkMail(val) {
            let reg = /\S+@\S+\.\S+/;
            let res = reg.test(val);
            return res;
        }

        if(checkMail(val)){
            this.setState({
                valMail: true
            })
        }else{
            this.setState({
                valMail: false
            })
        }
    };


    form = () =>{
        let colorName = this.state.valName === true?'green':'red';
        let colorDate = this.state.valDateBirth === true?'green':'red';
        let colorPhone = this.state.valPhone === true?'green':'red';
        let colorMail = this.state.valMail === true?'green':'red';
        return (
            <form id='dataForm'>
                <div className="form-group row">
                    <label htmlFor="namePerson" className="col-sm-2 col-form-label">ФИО</label>
                    <div className="col-sm-10">
                        <input type="text" style={{borderColor: colorName}} className="form-control" name="namePerson" id="namePerson" onChange={()=>this.onChangeName(namePerson.value)}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="dateBirth" className="col-sm-2 col-form-label">Дата рождения</label>
                    <div className="col-sm-10">
                        <input type="date" style={{borderColor: colorDate}} className="form-control" name="dateBirth" id="dateBirth" onChange={()=>this.onChangeDate(dateBirth.value)}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="phone" className="col-sm-2 col-form-label">Телефон</label>
                    <div className="col-sm-10">
                        <input type="number" style={{borderColor: colorPhone}} className="form-control" name="phone" id="phone" onChange={()=>this.onChangePhone(phone.value)}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="mail" className="col-sm-2 col-form-label">Почта<span
                        style={{color: 'red'}}>*</span></label>
                    <div className="col-sm-10">
                        <input type="email" style={{borderColor: colorMail}} className="form-control" name="mail" id="mail" onChange={()=>this.onChangeMail(mail.value)}/>
                    </div>
                </div>
                <div id="buttons">
                    <span id="buttonCreate" className="btn btn-sm btn-primary" onClick={()=>this.createDataPerson()}>Сохранить</span>
                    <span id="buttonCancel" className="btn btn-sm btn-warning" onClick={()=>{this.props.createPerson(false);
                                                                                             this.props.updateData(true)}}>Отменить</span>
                </div>
                <div><span style={{color: 'red'}}>*</span> - <i>Уникальное значение</i></div>
            </form>
        )
    };

    render(){
        return(
            this.form()
        )
    }
}


export default CreateElement;
