import React, { Component } from 'react';
import {Form, Grid, Header, Segment, Button, Container, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import "./Account.css";
import configData from "../../config.json"
const logo = "https://res.cloudinary.com/dukemarket316/image/upload/v1605398092/marketplace316/ygkl28yshlm7ugcnhggn.png";
const url = configData['SERVER_URL']

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            formInfo: {
                email: '',
                password: ''
            },
            errors: {
                "password": "",
                "email": ""
            },
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    

    // handles change in a single field (updates states based on changed info)
    handleChange = (e, { name, value }) => {
        let newState = this.state;
        newState.formInfo[name] = value;
        this.setState(newState);
    }

    handleSubmit = () => { 
        fetch(url+ "/login", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "email": this.state.formInfo.email,
                "password": this.state.formInfo.password
            })
        })
        .then(response => 
            response.json())
        .then((parsed) => {
                if(parsed["exists"]===true){
                    if(parsed["valid"]===true){
                        localStorage.setItem('session_id', JSON.stringify(parsed['session_id']));
                        localStorage.setItem('email', JSON.stringify(this.state.formInfo.email));
                        this.setState({ redirect: true })

                    }
                    else{
                        let errors = {};
                        errors["password"] = "This password is incorrect";
                        this.setState({errors: errors})
                    }
                }
                else{
                    let errors = {};
                    errors["email"] = "There is no account associated with this email";
                    this.setState({ errors: errors })
                }            
        })
        .catch(err => {
            console.error("Login failed: ", err);
        });   
    }


    render() {

        if (this.state.redirect) {
            return (<Redirect push to="/home"/>)
        }

        return(

           <Container className="login">
               <Container>
                    <Image src={logo} size='small' centered />
                </Container>
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
                            label='Duke Email'
                            name='email'
                            value={this.state.formInfo.email}
                            onChange={this.handleChange}
                            error={this.state.errors["email"] || null }
                        />
                        <Form.Input
                            icon='lock'
                            iconPosition='left'
                            fluid
                            type={"password"}
                            label='Password'
                            name='password'
                            value={this.state.formInfo.password}
                            onChange={this.handleChange}
                            error={this.state.errors["password"] || null }
                        />
                        <Link as={Button} to="/resetpswd" floated='left' className="reset-password-button">
                                        Forgot your password?
                            </Link>
                        <Grid padded verticalAlign={"middle"} >
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Link as={Button} to="/signup" floated='left' className="make-account-button">
                                        Make an Account
                                    </Link>
                                </Grid.Column>
                                <Grid.Column textAlign={"right"}>
                                    <Form.Button color='blue' size='small'>
                                        Log in
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