import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import "./styles/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import GApiAuth from './components/gapp'
import Main from './components/main'
import Spreadsheet from './components/spreadsheet'

import {CookiesProvider} from 'react-cookie';


ReactDOM.render(
    <CookiesProvider>
        <BrowserRouter>
            <GApiAuth>
                <Switch>
                    <Route exact path="/"  component={Main}/>
                    <Route path="/spreadsheet/:spreadsheetId" component={Spreadsheet}/>
                    <Route component={Main}/>
                </Switch>
            </GApiAuth>
        </BrowserRouter>
    </CookiesProvider>, document.getElementById('root')
);

serviceWorker.register();
