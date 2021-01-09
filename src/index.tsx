import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import MainView from './views/MainView';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import EditView from './views/EditView';

ReactDOM.render(
  <>
    <Router>
      <Switch>
        <Route path="/playlist/:playlistFile">
          <EditView />
        </Route>
        <Route path="/" exact>
          <MainView />
        </Route>
      </Switch>
    </Router>
    
  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
