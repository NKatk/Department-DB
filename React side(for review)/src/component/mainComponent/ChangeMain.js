import React, {Component} from 'react';

class FormMain extends Component {
    constructor(){
        super();
        this.state = {
            valName: true
        }
    }

    changeDataMain = () =>{
        let dataForm = document.getElementById('dataForm');


        if(dataForm.courseName.value === this.props.change.courseName && dataForm.description.value === this.props.change.description){
            alert('Изменения не внесены!');
            this.props.changeElement(false);
            this.props.updateData(true)

        }else {
            if (this.state.valName) {
                fetch('/api/changeElement', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: this.props.change._id,
                        courseName: dataForm.courseName.value,
                        description: dataForm.description.value  || '-'
                    })
                })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if (result.msg === 'OK') {
                                alert('Изменение успешно.');
                                this.props.updateData(true);
                                this.props.changeElement(false)
                            } else if (result.msg === 'Value Not Unique') {
                                alert('Название не уникально, измените его.');
                            } else if (result.msg === 'DB Err') {
                                alert('Ошибка баз данных.');
                                this.props.updateData(true);
                                this.props.changeElement(false)
                            }

                        },
                        (error) => {
                            console.log(error);
                            this.props.updateData(true);
                            this.props.createElement(false)
                        }
                    )

            } else {
                alert('Заполните название корректно!')
            }
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
                        <input type="text" style={{borderColor: colorName}} className="form-control" name="courseName" id="courseName" onChange={()=>this.onChange(courseName.value)} defaultValue={this.props.change.courseName}/>
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="description" className="col-sm-2 col-form-label">Описание (Опционально)</label>
                    <div className="col-sm-10">
                        <input type="text" style={{borderColor: 'green'}} className="form-control" name="description" id="description"  defaultValue={this.props.change.description}/>
                    </div>
                </div>
                <div id="buttons">
                    <span id="buttonCreate" className="btn btn-sm btn-primary" onClick={()=>this.changeDataMain()}>Сохранить</span>
                    <span id="buttonCancel" className="btn btn-sm btn-warning" onClick={()=>{this.props.changeElement(false);
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


export default FormMain;
