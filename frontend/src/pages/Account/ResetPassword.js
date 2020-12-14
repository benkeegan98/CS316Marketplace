import React, { Component } from 'react';
import {Form, Grid, Header, Segment, Button, Container, Image, Menu} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import "./Account.css";
import configData from "../../config.json"
const url = configData['SERVER_URL']

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            formInfo: {
                email: '',
                securityAnswer: '',
                newPassword: '',
                passwordConfirm: ''
            },
            errors: {
                "email": "",
                "security": "",
                "newPassword": "",
                "passwordConfirm": ""
            },
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkSecurity = this.checkSecurity.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.validate = this.validate.bind(this);
    }
    

    // handles change in a single field (updates states based on changed info)
    handleChange(e, { name, value }) {
        let newState = this.state;
        newState.formInfo[name] = value;
        this.setState(newState);
    }

    handleSubmit() {
        let errors = {}; 
        fetch(url+"/userexists", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "email": this.state.formInfo.email
            })
            })
            .then(response => 
                response.json())
            .then((parsed) => {
                console.log(parsed);
                if(parsed['exists']===false){
                    errors["email"] = "There is no account associated with this email address";
                }
                else{
                    this.checkSecurity()
                }
            });
        this.setState({ errors: errors });
  
    }

    checkSecurity() {
        let errors = {};

        fetch(url+"/confirmSecurity", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "email": this.state.formInfo.email,
                "securityAnswer": this.state.formInfo.securityAnswer
            })
            })
            .then(response => 
                response.json())
            .then((parsed) => {
                console.log(parsed)
                if(parsed['success']===true){
                    if(parsed['match']===true){
                        if(this.validate()){
                            this.resetPassword()
                        }
                    }
                    else{
                        errors['security'] = 'Wrong Response'
                        this.setState({errors: errors})
                    }
                }   
            })
            .catch(err => {
            console.error(err);
            });


    }

    resetPassword(){

        fetch(url+ "/resetpswd", {
            "method": "PATCH",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "email": this.state.formInfo.email,
                "password": this.state.formInfo.newPassword
            })
            })
            .then(response => {
                console.log(response.json())})
            .catch(err => {
                console.error(err);
                });

    }

    validate() {

        let formData = this.state.formInfo;
        let isValid = true;
        let errors = {};

        // check if password is long enough
        if(formData.newPassword.length < 8) {
            isValid = false;
            errors["newPassword"] = "Password must be at least 8 characters long";
        }

        // check if password and confirm password match
        if(formData.newPassword !== formData.passwordConfirm) {
            isValid = false;
            errors["passwordConfirm"] = "Passwords must match";
        }

        this.setState({ errors: errors })

        return isValid;

    }


    render() {

        if (this.state.redirect) {
            return (<Redirect push to="/home"/>)
        }

        return(
            <Container className="resetPassword">
               <Container className="start-header" color='black' textAlign='center'>
                    <Header as="h3">Welcome to Duke Marketplace</Header>
                </Container>
                <Segment clearing raised>
                    <Container className={"login-header"} color='black' textAlign='center'>
                        <Header as="h4">Login</Header>
                    </Container>
                    <Form size='mini' onSubmit={this.handleSubmit}>
                        <Form.Input
                                icon='user'
                                iconPosition='left'
                                fluid
                                label='email'
                                name='email'
                                value={this.state.formInfo.email}
                                onChange={this.handleChange}
                                error={this.state.errors["email"] || null }
                            />
                        <Form.Input
                            fluid
                            label='Security Question: What is your favorite animal?'
                            name='securityAnswer'
                            value={this.state.formInfo.securityAnswer}
                            onChange={this.handleChange}
                            error={this.state.errors["security"] || null }
                        />
                        <Form.Input
                            icon='lock'
                            iconPosition='left'
                            fluid
                            type={"password"}
                            label='New Password'
                            name='newPassword'
                            value={this.state.formInfo.newPassword}
                            onChange={this.handleChange}
                            error={this.state.errors["newPassword"] || null }
                        />
                        <Form.Input
                            icon='lock'
                            iconPosition='left'
                            fluid
                            type={"password"}
                            label='Re-enter Password'
                            name='passwordConfirm'
                            value={this.state.formInfo.passwordConfirm}
                            onChange={this.handleChange}
                            error={this.state.errors["passwordConfirm"] || null }
                        />
                        <Link as={Button} to="/login" floated='left' className="login-button">
                                Go back to Login Page
                        </Link>
                        <Grid padded verticalAlign={"middle"} >
                            <Grid.Row columns={1}>
                                <Grid.Column textAlign={"right"}>
                                    <Form.Button 
                                        disabled={!this.state.formInfo.email
                                            || !this.state.formInfo.securityAnswer
                                            || !this.state.formInfo.newPassword
                                            || !this.state.formInfo.passwordConfirm
                                        }
                                        color='blue' 
                                        size='small'>
                                        Reset Password
                                    </Form.Button>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </Segment>
            </Container> 
        );
        
    }

}