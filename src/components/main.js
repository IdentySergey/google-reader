import React from 'react';
import '../styles/main.css'
import {Table} from 'react-bootstrap'

class Main extends React.Component {

    constructor(props) {
        super(props);
        this._request_gdrive_spreadsheets = this._request_gdrive_spreadsheets.bind(this);
        this.state = {
            files: [],
            isReadyLoadsFiles: false,
        }
    }

    componentDidMount() {
        this._request_gdrive_spreadsheets()
    }

    //get files saved in google disk and set state
    _request_gdrive_spreadsheets(){
        let success_gdrive_mount = (resp) => {
            console.log("file get success");
            let files = resp.result.files;
            this.setState({
                files: files,
                isReadyLoadsFiles: true,
            })
        }

        window.gapi.client.drive.files.list({
            "q": "mimeType='application/vnd.google-apps.spreadsheet'",
            //filter by type docs without pagination (TODO: add that)
        }).then(success_gdrive_mount);
    }

    render() {

        if(!this.state.isReadyLoadsFiles){
            return <div className={'main-loading'}>Loading...</div>
        }

        if(this.state.files.length <= 0){
            return <div className={'main-no_file'}>No files</div>
        }

        let fileList = () => {
            let listfiles = this.state.files.map((file,index)=>{
                return <tr key={index}>
                    <td width={'50px'}>{file.id}</td>
                    <td><a href={"/spreadsheet/"+file.id}>{file.name}</a></td>
                </tr>
            });
            return <Table>
                <tbody>
                {listfiles}
                </tbody>
            </Table>
        }

        return <div>
            {fileList()}
        </div>
    }

}

export default Main;

