import React, { Component } from 'react';
import logo from './nemlogo.png';
import './App.css';
import Details from './Details.js';


class App extends Component {
    render() {
        return ( 
            <div className="App" >
                <div className="App-header" >
                    <img src={ logo } className="App-logo" alt="logo" />
                    <h2> NEM Offline transaction signer</h2> 
                </div> 
                <Details/>
            </div>
        );
    }
}



export default App;