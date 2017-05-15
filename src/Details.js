import React, { Component } from 'react';
import {
    Col,
    ControlLabel,
    FormControl,
    Button,
    FormGroup,
    Label,
    Modal
} from 'react-bootstrap';
import helpers from './nem-helper';
import QRCode from 'qrcode.react';

class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nemAddress: "",
            nemAmount: 0,
            nemPrvKey: "",
            nemMessage: "",
            nemFee: 0,
            signedTransaction: "",
            showModal: false

        };
    }
    handleInputChange(e) {
        var target = e.target;
        var name = target.name;
        var value = target.value;

        this.setState({ [name]: value });

        //Check validity of a NEM address

        this.updateFee();
    }
    updateFee() {

        var feeString = helpers.updateFee(this.state);
        //Update view with the fee
        this.setState({ nemFee: feeString });
    }
    openModal() {
        var result = helpers.signTransaction(this.state);

        if (result === false) {
            this.setState({ showModal: false });
            return;
        }

        this.setState({
            signedTransaction: JSON.stringify(result),
            showModal: true
        });
    }
    closeModal() {
        this.setState({ showModal: false });
    }

    getValidationState() {
        var isValid = helpers.isValidAddress(this.state.nemAddress);
        if (isValid) return 'success';
        else return 'error';
    }
    render() {
        return (
            <div className="details-container" >
                <Col xs={6} md={6} className="form-container">
                    <form>
                        <FormGroup>
                            <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                                <ControlLabel> Recepient address </ControlLabel>
                                <FormControl name="nemAddress" onChange={this.handleInputChange.bind(this)} type="text" />
                            </FormGroup>

                            <ControlLabel> Amount(XEM) </ControlLabel>
                            <FormControl type="number" name="nemAmount" onChange={this.handleInputChange.bind(this)} defaultValue="0" placeholder="0" />
                            <ControlLabel> Private key </ControlLabel>
                            <FormControl type="password" name="nemPrvKey" onChange={this.handleInputChange.bind(this)} />
                        </FormGroup>

                        {/**/}

                        <FormGroup>
                            <ControlLabel> Message </ControlLabel>
                            <FormControl componentClass="textarea" name="nemMessage" onChange={this.handleInputChange.bind(this)} />
                        </FormGroup>

                        <h3> Fee <Label> {this.state.nemFee} XEM </Label> </h3>
                        <Button bsStyle="success" onClick={this.openModal.bind(this)} >
                            Sign transaction
                        </Button>

                    </form >
                </Col>

                <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)} >
                    <Modal.Header>
                        <Modal.Title > SIGNED TRANSACTION </Modal.Title >
                    </Modal.Header>

                    <Modal.Body>
                        <div className="qr" >
                            <QRCode value={this.state.signedTransaction} size={200} level="M" />
                        </div>
                        <FormGroup controlId="signedtxtextarea" >
                            <ControlLabel> Signed transaction </ControlLabel >
                            < FormControl componentClass="textarea" value={this.state.signedTransaction} />
                        </FormGroup>
                    </Modal.Body >

                    <Modal.Footer>
                        <Button onClick={this.closeModal.bind(this)}> Close </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Details;