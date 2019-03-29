import React, {Component} from 'react';

class ChangeElement extends Component {
    constructor(){
        super();
        this.state = {
            valName: true,
            valDateBirth: true,
            valPhone: true,
            valMail: true
        }
    }

    changeDataPerson = () =>{
        let dataForm = document.getElementById('dataForm');

        if(dataForm.namePerson.value === this.props.change.namePerson &&
            dataForm.dateBirth.value === this.props.change.dateBirth.slice(0,10) &&
            +dataForm.phone.value === this.props.change.phone &&
            dataForm.mail.value === this.props.change.mail
        ) {
            alert('Изменения не внесены!');
            this.props.changePerson(false);
            this.props.updateData(true)


        }else {
            if (this.state.valName && this.state.valDateBirth && this.state.valPhone && this.state.valMail) {
                fetch('/api/changePerson', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify([{
                        idCourse: this.props.id
                    }, {
                        id: this.props.change._id,
                        name: dataForm.namePerson.value,
                        dateBirth: dataForm.dateBirth.value,
                        phone: dataForm.phone.value,
                        mail: dataForm.mail.value,
                        dateCreate: this.props.change.dateCreate
                    }])
                })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if (result.msg === 'OK') {
                                alert('Изменение успешно.');
                                this.props.updateData(true);
                                this.props.changePerson(false)
                            } else if (result.msg === 'ERR unique mail') {
                                alert('Почта не уникальна, измените значение.');
                            } else if (result.msg === 'ERR dateBirth') {
                                alert('Дата рождения не корректна, измените значение.');
                            } else if (result.msg === 'ERR phone') {
                                alert('Номер телефона не корректен, измените значение.');
                            } else if (result.msg === 'ERR dateCreate') {
                                alert('Ошибка баз данных."Создание даты".');
                                this.props.updateData(true);
                                this.props.changePerson(false)
                            } else if (result.msg === 'DB Err') {
                                alert('Ошибка баз данных.');
                                this.props.updateData(true);
                                this.props.changePerson(false)
                            }

                        },
                        (error) => {
                            console.log(error);
                            this.props.updateData(true);
                            this.props.changePerson(false)
                        }
                    )

            } else {
                alert('Заполните все поля корректно!')
            }
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
                        <input type="text" style={{borderColor: colorName}} className="form-control" name="namePerson" id="namePerson" onChange={()=>this.onChangeName(namePerson.value)} defaultValue={this.props.change.name}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="dateBirth" className="col-sm-2 col-form-label">Дата рождения</label>
                    <div className="col-sm-10">
                        <input type="date" style={{borderColor: colorDate}} className="form-control" name="dateBirth" id="dateBirth" onChange={()=>this.onChangeDate(dateBirth.value)} defaultValue={this.props.change.dateBirth.slice(0,10)}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="phone" className="col-sm-2 col-form-label">Телефон</label>
                    <div className="col-sm-10">
                        <input type="number" style={{borderColor: colorPhone}} className="form-control" name="phone" id="phone" onChange={()=>this.onChangePhone(phone.value)} defaultValue={this.props.change.phone}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="mail" className="col-sm-2 col-form-label">Почта<span
                        style={{color: 'red'}}>*</span></label>
                    <div className="col-sm-10">
                        <input type="email" style={{borderColor: colorMail}} className="form-control" name="mail" id="mail" onChange={()=>this.onChangeMail(mail.value)} defaultValue={this.props.change.mail}/>
                    </div>
                </div>
                <div id="buttons">
                    <span id="buttonCreate" className="btn btn-sm btn-primary" onClick={()=>this.changeDataPerson()}>Сохранить</span>
                    <span id="buttonCancel" className="btn btn-sm btn-warning" onClick={()=>{this.props.changePerson(false);
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


export default ChangeElement;
