import React from 'react';
import {withRouter} from "react-router-dom";
import '../styles/spreadsheet.css';
import {Button} from 'react-bootstrap'

class Spreadsheet extends React.Component {

    constructor(props) {
        super(props);

        this._convertRowItem = this._convertRowItem.bind(this);
        this._getDataSheet = this._getDataSheet.bind(this);
        this._load_document = this._load_document.bind(this);

        this.state = {
            spreadsheet: null,
            isReadySpreadSheet: false,
            numberSheet: 0, //default 0 for all created docs
            intervalUpdate: 1000,
        }
    }

    componentDidMount() {
        this._load_document()
        this.setState({
            updateInterval: setInterval(() => {
                console.log('update doc')
                this._load_document()
            }, this.state.intervalUpdate)
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.updateInterval);
    }

    _convertRowItem(value) {
        let hexPattern = new
        RegExp("^#([a-fA-F0-9]){3}$|[a-fA-F0-9]{6}$");


        if (hexPattern.test(value)) {
            return <hr className={'spreadsheet-row-hr'} color={value} width={'10px'} />
        }

        let imagePattern = new
        RegExp("^(?:http(s)?:\\/\\/)?[\\w.-]+(?:\\.[\\w\\.-]+)+[\\w\\-\\._~:/?#[\\]@!\\$&'\\(\\)\\*\\+,;=.]+(?:png|jpg|jpeg|gif|svg)+$");

        if (imagePattern.test(value)) {
            return <div className={'spreadsheet-row-image-wrapper'}>
                <img className={'spreadsheet-row-image'} src={value} alt={value} />
            </div>
        }

        return <p className={'spreadsheet-row-text'}>
            {value}
        </p>
    }

    _getDataSheet() {
        const {numberSheet, spreadsheet, isReadySpreadSheet} = this.state
        if (isReadySpreadSheet) {
            return spreadsheet.sheets[numberSheet].data[0].rowData;
        }
        return null;
    }


    _load_document(){
        window.gapi.client.sheets.spreadsheets.get({
            spreadsheetId: this.props.match.params.spreadsheetId,
            ranges: [],
            includeGridData: true,
        }).then((file) => {
            this.setState({
                spreadsheet: file.result,
                isReadySpreadSheet: true,
            });
        }, (error) => {
            console.warn(error);
            this.props.history.push('/');
        });
    }




    render() {
        if (!this.state.isReadySpreadSheet) {
            return <div className={'spreadsheet-loading'}>loading</div>
        }
        const display_column = this._getDataSheet().map((row,index) => {

            let display_value = row.values.map((values,index) => {
                //console.log(values);
                return <div key={index}>{this._convertRowItem(values.formattedValue)}</div>
            });

            return <div key={index} className={'spreadsheet-column'}>
                <div className={'spreadsheet-column-right'}>
                {display_value}
                </div>
                <div className={'spreadsheet-column-left'}>
                    <Button>play</Button>
                </div>
            </div>
        })

        return <div className={'spreadsheet'}>
            {display_column}
        </div>
    }
}

export default withRouter(Spreadsheet);