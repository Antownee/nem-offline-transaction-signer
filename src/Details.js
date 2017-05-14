import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Col, ControlLabel, FormControl, Button, FormGroup, Label} from 'react-bootstrap';
import helpers from './nem-helper'


class Details extends Component {
    constructor(props){
        super(props);
        this.state = {
            nemAddress: "",
            nemAmount: 0,
            nemPrvKey: "",
            nemMessage: "",
            nemFee: 0,
            signedTransaction: ""
        };
    }
    handleInputChange(e){
        var target = e.target;
        var name = target.name;
        var value = target.value;

        this.setState({
            [name]: value
        });
        
        this.updateFee();
    }
    updateFee() {
        
        var feeString = helpers.updateFee(this.state);
        
        //Update view with the fee
        this.setState({
            nemFee: feeString
        });
	}
    signTransaction(event) {
        event.preventDefault();
        
        var result = helpers.updateFee(this.state);
        
        //Update view with the transaction
        this.setState({
            signedTransaction: JSON.stringify(result)
        });
    }
    render() {
        return (
            <div className="details-container">
                <Col xs={6} md={6} className="form-container">
                    <form onSubmit={this.signTransaction.bind(this)}>
                        <FormGroup>
                            <ControlLabel>Recepient address</ControlLabel>
                            <FormControl name="nemAddress" onChange={this.handleInputChange.bind(this)} type="text"/>
                            <ControlLabel>Amount (XEM)</ControlLabel>
                            <FormControl type="number" name="nemAmount" onChange={this.handleInputChange.bind(this)} defaultValue="0" placeholder="0"/>
                            <ControlLabel>Private key</ControlLabel>
                            <FormControl type="password" name="nemPrvKey" onChange={this.handleInputChange.bind(this)}/>
                        </FormGroup>

                        {/**/}

                        <FormGroup>
                            <ControlLabel>Message</ControlLabel>
                            <FormControl componentClass="textarea" name="nemMessage" onChange={this.handleInputChange.bind(this)}/>
                        </FormGroup>

                        <h3>Fee <Label>{this.state.nemFee} XEM</Label></h3> 

                        <Button type="submit" bsStyle="success">
                            Sign transaction
                        </Button>

                        <FormGroup controlId="formControlsTextarea">
                            <ControlLabel>Signed transaction</ControlLabel>
                            <FormControl componentClass="textarea" value={this.state.signedTransaction}/>
                        </FormGroup>
                    </form>
                </Col>
            </div>
        );
    }
}

export default Details;