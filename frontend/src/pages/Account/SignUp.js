import React, { Component, Fragment } from 'react';
import { Header, Container, Segment, Form, Grid, Button, Image } from 'semantic-ui-react';
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import "./Account.css";
import configData from "../../config.json"

const logo = "https://res.cloudinary.com/dukemarket316/image/upload/v1605398092/marketplace316/ygkl28yshlm7ugcnhggn.png";
const url = configData['SERVER_URL']

export default class SignUp extends Component {

    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            formInfo: {
                password: '',
                passwordConfirm: '',
                firstName: '',
                lastName: '',
                email: '',
                security: ''
            },
            errors: {
                "password": "",
                "passwordConfirm": "",
                "email": ""
            },
            validEmail: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.validate = this.validate.bind(this);
        this.postUser = this.postUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

     // handles change in a single field (updates states based on changed info)
    handleChange(e, { name, value }) {
        let newState = this.state;
        newState.formInfo[name] = value;
        this.setState(newState);
    }

    handleSubmit = () => {

        if(this.validate()) {
            fetch(url+ "/userexists", {
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
                        this.postUser();
                    }
                    else{
                        let errors = {};
                        errors["email"] = "There is already an account associated with this email";
                        this.setState({ errors: errors })
                    }
                })
                .catch(err => {
                console.error(err);
                });             
            
        }
    }

    postUser(){
        let options = {
            headers: {
                'Content_Type': 'multipart/form-data'
            },
            method: 'POST',
            body: JSON.stringify(this.state.formInfo)
        };

        fetch(url+'/signup', options)
        .then(response => {
          console.log(response);
          this.setState({ redirect: true });
        })
        .catch(error => console.error(error));
    }

    
    validate() {

        let formData = this.state.formInfo;
        let isValid = true;
        let errors = {};

        // check if password is long enough
        if(formData.password.length < 8) {
            isValid = false;
            errors["password"] = "Password must be at least 8 characters long";
        }

        // check if password and confirm password match
        if(formData.password !== formData.passwordConfirm) {
            isValid = false;
            errors["passwordConfirm"] = "Passwords must match";
        }

        // check if email has @duke.edu extension -- will implement this with proper validation later
        if(!formData.email.includes("@duke.edu")) {
            isValid = false;
            errors["email"] = "Please enter valid Duke email";
        }

        // check if email had account already
        // if(this.state.emailData.includes(formData.email)){
        //     isValid = false;
        //     errors["email"] = "There is already an account associated with this email";
        // }

        this.setState({ errors: errors })

        return isValid;

    }
   

    render() {

        if (this.state.redirect) {
            return (<Redirect push to="/login"/>)
        }

        return(
            <Container className="sign-up">
                <Container>
                    <Image src={logo} size='small' centered />
                </Container>
                <Container className="start-header" color='black' textAlign='center'>
                    <Header as="h3">Welcome to Duke Marketplace</Header>
                </Container>
                <Container>
                    <Segment className="sign-up-box" clearing raised>
                        <Container className="sign-up-header" color='black' textAlign='center'>
                            <Header as="h4">Sign Up</Header>
                        </Container>
                        <Form size='small' onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Grid>
                                    <Grid.Row width={16}>
                                        <Grid.Column width={8}>
                                            <Form.Input
                                                fluid
                                                placeholder='Coach'
                                                label='First name'
                                                name='firstName'
                                                value={this.state.formInfo.firstName}
                                                onChange={this.handleChange}
                                                error={this.state.errors["firstName"] || null }
                                            />
                                        </Grid.Column>
                                        <Grid.Column width={8}>
                                            <Form.Input
                                                fluid
                                                placeholder='K'
                                                label='Last name'
                                                name='lastName'
                                                value={this.state.formInfo.lastName}
                                                onChange={this.handleChange}
                                                error={this.state.errors["lastName"] || null }
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form.Field>
                            <Form.Input
                                fluid
                                placeholder='netid@duke.edu'
                                type='email'
                                label='Duke Email'
                                name='email'
                                value={this.state.formInfo.email}
                                onChange={this.handleChange}
                                error={this.state.errors["email"] || null }
                            />
                            <Form.Input
                                fluid
                                type={"password"}
                                label='Password'
                                name='password'
                                value={this.state.formInfo.password}
                                onChange={this.handleChange}
                                error={this.state.errors["password"] || null }
                            />
                            <Form.Input
                                fluid
                                type={"password"}
                                label='Re-enter password'
                                name='passwordConfirm'
                                value={this.state.formInfo.passwordConfirm}
                                onChange={this.handleChange}
                                error={this.state.errors["passwordConfirm"] || null }
                            />
                            <Form.Input
                                fluid
                                placeholder='animal'
                                label='What is your favorite animal? (Security Question)'
                                name='security'
                                value={this.state.formInfo.security}
                                onChange={this.handleChange}
                            />
                            

                            <Grid padded verticalAlign={"middle"} >
                                <Grid.Row columns={2}>
                                    <Grid.Column>
                                        <Link as={Button} to="/login" floated='left' className="make-account-button">
                                            Already have an account?
                                        </Link>
                                    </Grid.Column>
                                    <Grid.Column textAlign={"right"}>
                                        <Form.Button 
                                            color='blue' 
                                            size='small' 
                                            floated='right'
                                            disabled={!this.state.formInfo.firstName
                                                || !this.state.formInfo.lastName
                                                || !this.state.formInfo.password
                                                || !this.state.formInfo.passwordConfirm
                                                || !this.state.formInfo.email
                                                || !this.state.formInfo.security
                                            }
                                        >
                                            Sign Up
                                        </Form.Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form>
                    </Segment>
                </Container>
            </Container>
        );


    }

}
