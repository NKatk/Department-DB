import React, {Component} from 'react';

class CreateMain extends Component {
    constructor(){
        super();
        this.state = {
            valName: false
        }
    }

    createDataMain = () =>{
        let dataForm = document.getElementById('dataForm');

        if (this.state.valName) {
            fetch('/api/createElement',  {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    courseName: dataForm.courseName.value,
                    description: dataForm.description.value || '-'
                })
            })
                .then(res => res.json())
                .then(
                    (result) =>{
                        if(result.msg === 'OK'){
                            alert('Создание успешно.');
                            this.props.updateData(true);
                            this.props.createElement(false)
                        }else if(result.msg ==='Value Not Unique'){
                            alert('Название не уникально, измените его.');
                        }else if(result.msg === 'DB Err'){
                            alert('Ошибка баз данных.');
                            this.props.updateData(true);
                            this.props.createElement(false)
                        }

                    },
                    (error)=>{
                        console.log(error);
                        this.props.updateData(true);
                        this.props.createElement(false)
                    }
                )

        }else{
            alert('Заполните название корректно!')
        }
    };


    onChange = (val) =>{
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


    form = () =>{
        let colorName = this.state.valName === true?'green':'red';
        return (
            <form id='dataForm'>
                <div className="form-group row">
                    <label htmlFor="courseName" className="col-sm-2 col-form-label">Название депортамента<span
                        style={{color: 'red'}}>*</span></label>
                    <div className="col-sm-10">
                        <input type="text" style={{borderColor: colorName}} className="form-control" name="courseName" id="courseName" onChange={()=>this.onChange(courseName.value)}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="description" className="col-sm-2 col-form-label">Описание (Опционально)</label>
                    <div className="col-sm-10">
                        <input type="text" style={{borderColor: 'green'}} className="form-control" name="description" id="description"/>
                    </div>
                </div>
                <div id="buttons">
                    <span id="buttonCreate" className="btn btn-sm btn-primary" onClick={()=>this.createDataMain()}>Сохранить</span>
                    <span id="buttonCancel" className="btn btn-sm btn-warning" onClick={()=>{this.props.createElement(false);
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


export default CreateMain;
