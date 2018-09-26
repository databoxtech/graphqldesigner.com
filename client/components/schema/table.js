import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

// styling
import FlatButton from 'material-ui/FlatButton';
import Delete from 'material-ui/svg-icons/action/delete';
import Close from 'material-ui/svg-icons/navigation/close';
import * as actions from '../../actions/actions.js';

const style = {
  deleteStyle: {
    minWidth: '25px',
    position: 'absolute',
    right: '10px',
  },
  idFiled: {
    width: '100%',
    justifyContent: 'center',
    color: 'white',
    marginTop: '5px',
    cursor: 'pointer',
  },
};

// we use store.data, because of index.js reduce function
const mapStateToProps = store => ({
  tables: store.schema.tables,
  database: store.schema.database
});

const mapDispatchToProps = dispatch => ({
  deleteTable: tableIndex => dispatch(actions.deleteTable(tableIndex)),
  addField: fieldName => dispatch(actions.addFieldClicked(fieldName)),
  deleteField: fieldName => dispatch(actions.deleteField(fieldName)),
  updateField: fieldIndex => dispatch(actions.updateField(fieldIndex)),
  handleFieldsSelect: field => dispatch(actions.handleFieldsSelect(field)),
  handleSelectedTable: tableIndex => dispatch(actions.handleSelectedTable(tableIndex)),
});

class Table extends Component {
  constructor(props) {
    super(props);

    this.handleDeleteTable = this.handleDeleteTable.bind(this);
    this.handleDeleteField = this.handleDeleteField.bind(this);
    this.handleAddField = this.handleAddField.bind(this);
    this.handleUpdateField = this.handleUpdateField.bind(this);
    this.handleSelectedTable = this.handleSelectedTable.bind(this);
  }

  handleDeleteTable(event) {
    this.props.deleteTable(event.currentTarget.value); // need currentTarget because of Material-UI
  }

  handleDeleteField(event){
    const tableIndex = this.props.tableIndex
    const fieldIndex = event.currentTarget.value // need currentTarget because of Material-UI
    this.props.deleteField([tableIndex, fieldIndex])
  }

  handleAddField(event) {
    this.props.addField(this.props.tableIndex);
  }

  handleUpdateField(event) {
    this.props.handleFieldsSelect({
      location: event.currentTarget.value,
      submitUpdate: false
    })
  }

  handleSelectedTable(event) {
    this.props.handleSelectedTable(event.currentTarget.value);
  }

  render() {
    const colors = ['darkcyan', 'dodgerblue', 'crimson', 'orangered', 'darkviolet', 
                    'gold', 'hotpink', 'seagreen', 'darkorange', 'tomato', 'mediumspringgreen',
                    'purple', 'darkkhaki', 'firebrick', 'steelblue', 'limegreen', 'sienna', 
                    'darkslategrey', 'goldenrod', 'deeppink'];

    function checkForArray(position, multipleValues) {
      if (multipleValues) {
        if (position === 'front') return '[ ';
        if (position === 'back') return ' ]';
      } else {
        return '';
      }
    }

    function checkForRequired(value) {
      if (value) {
        return ' !';
      } else {
        return '';
      }
    }

    function checkForUnique(value) {
      if (value) {
        return ' *';
      } else {
        return '';
      }
    }

    let fields = [];
    for (let property in this.props.tableData.fields) {
      const tableIndex = this.props.tableData.fields[property].tableNum;
      const fieldIndex = this.props.tableData.fields[property].fieldNum;
      const fieldName = this.props.tableData.fields[property].name;
      const fieldType = this.props.tableData.fields[property].type;
      const relation = this.props.tableData.fields[property].relation.tableIndex;
      const multipleValues = this.props.tableData.fields[property].multipleValues;
      const required = this.props.tableData.fields[property].required;
      const unique = this.props.tableData.fields[property].unique;
      let buttonDisabled = false
      // if MongoDB is selected, the ID field is no longer clickable
      if(this.props.database === 'MongoDB' && this.props.tableData.fields[property].name === 'id') {
        buttonDisabled = true; 
      }


      fields.push(
        <CSSTransition
        key={property}
        timeout={100}
        classNames="fadeScale"
        >
        <div>
          <div key={property} className='field'>
            <div className='fieldContainer' style={{backgroundColor: `${colors[relation]}`}}>
              <FlatButton
                value={`${tableIndex} ${fieldIndex}`}
                onClick={this.handleUpdateField}
                className='fieldButton'
                disabled={buttonDisabled}
                >
                  <p style={{fontSize: '1.1em'}}>{fieldName} - {checkForArray('front', multipleValues)}{fieldType}{checkForRequired(required)}{checkForUnique(unique)}{checkForArray('back', multipleValues)}</p>
              </FlatButton>
              <FlatButton
                className='delete-button'
                icon={<Close />}
                value={property}
                onClick={this.handleDeleteField}
                style={{minWidth: '25px'}}
                disabled={buttonDisabled}
              />
            </div>
          </div>
          <hr className='fieldBreak'/>
          </div>
        </CSSTransition>,
      );
    }

    return (
        <div className='table' style={{border: `1px solid ${colors[this.props.tableData.tableID]}`}}>
          <div>
            <div className='field'>
              <FlatButton
                backgroundColor={colors[this.props.tableData.tableID]}
                value={this.props.tableIndex}
                onClick={this.handleSelectedTable}
                className='tableButton'
              >
                <h4>{this.props.tableData.type}</h4>
              </FlatButton>
              <FlatButton
                className='delete-button'
                icon={<Delete />}
                value={this.props.tableIndex}
                onClick={this.handleDeleteTable}
                style={style.deleteStyle}
              />
            </div>
          </div>
          <TransitionGroup>
            { fields }
          </TransitionGroup>
          <div onClick={this.handleAddField} className='field addField'>
            <p style={{marginTop: '5px'}}>
              ADD FIELD
            </p>
          </div>
        </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
