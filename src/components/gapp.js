import React from 'react';
import {withRouter} from "react-router-dom";
import {Button, Navbar, Nav, Form, FormControl} from 'react-bootstrap'
import '../styles/gapiauth.css'


class GApiAuth extends React.Component {

    constructor(props) {
        super(props);
        //initial google library
        this._initial_google_user = this._initial_google_user.bind(this);

        //handler signIn user
        this._clientSignInHander = this._clientSignInHander.bind(this);

        //hander sign
        this._clientSignOutHander = this._clientSignOutHander.bind(this);

        //navbar
        this._navbar = this._navbar.bind(this);

        //event hander load spreedsheet
        this._load_document_by_uri = this._load_document_by_uri.bind(this);

        //initial state app
        this.state = {
            isSign: false,
            isReady: false,
        }
    }

    componentDidMount() {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/client.js";
        script.onload = () => {
            window.gapi.load('client:auth2', this._initial_google_user);
        };
        document.body.appendChild(script);
    }

    _initial_google_user() {

        let _clientSetStatus = (s) => {
            console.log('user state is ' + s)
            this.setState({isSign: s})
        }

        let _checkUserData = () => {
            window.gapi.auth2.getAuthInstance().isSignedIn.listen(_clientSetStatus);
            _clientSetStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
            this.setState({isReady: true})
        }


        window.gapi.client.init({
            api_key: process.env.REACT_APP_API_KEY,
            client_id: process.env.REACT_APP_CLIENT_ID,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4',
                "https://content.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            scope: "https://www.googleapis.com/auth/documents.readonly " +
                " https://www.googleapis.com/auth/drive.readonly" +
                " https://www.googleapis.com/auth/drive" +
                " https://www.googleapis.com/auth/drive.file"
            ,
        }).then(_checkUserData);
    }

    _clientSignInHander() {
        window.gapi.auth2.getAuthInstance().signIn().then(profile => {
            console.log(profile);
        });
    }

    _clientSignOutHander() {
        window.gapi.auth2.getAuthInstance().signOut();
        this.setState({isSign: false})
    }


    _load_document_by_uri(e){
        const parse = e.target.value.split('/');
        if(parse.length >= 5){ //link standart he have 5 arguments where 5 is id document
           //'/spreadsheet/'+parse[5]
            this.props.history.push('/spreadsheet/'+parse[5]);
        }
    }

    _navbar(){
        return <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <FormControl type="text" onChange={this._load_document_by_uri}
                                 placeholder="Spreaddsheet" className="mr-sm-2" />
                </Nav>
                <Form inline>
                    <Button onClick={this._clientSignOutHander}>Sign out</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    }

    render() {

        const {isReady,isSign} = this.state

        if (!isReady) {
            return <div className={'gapi-loading'}>
                <p>loading application</p>
            </div>
        }

        if (!isSign) {
            return <div className={'gapi-signin'}>
                <div className={'gapi-signin-content'}>
                    <h3>Welcome</h3>
                    <Button onClick={this._clientSignInHander}>Sign In</Button>
                </div>
            </div>
        }


        return <div className='gapi-provider'>
            {this._navbar()}
            {this.props.children}
        </div>
    }

}

export default withRouter(GApiAuth);

