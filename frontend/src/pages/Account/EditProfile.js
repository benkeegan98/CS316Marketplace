import React, { Component, Fragment } from 'react';
import { Header, Container, Segment, Form, Grid, Divider } from 'semantic-ui-react';
import NavBar from '../../components/NavBar';
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import '../../styles/General.css';
import "./Account.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import configData from "../../config.json"
const url = configData['SERVER_URL']

export default class EditProfile extends Component {

    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            profileInfo: {
                name: '',
                email: '',
                password: '',
                passwordConfirm: '',
                class: '',
                major: ''
            },
            errors: {
                "password": "",
                "passwordConfirm": "",
                "classYear": "",
                "major": "",
                "name": ""
            },
            validEmail: null,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validate = this.validate.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.validatePassword =this.validatePassword.bind(this);
    }

    // initToast() {
    //     // const { addToast } = useToasts();
    //     return addToast;
    // }

    handleChange = (e, {name, value}) => {
        let newState = this.state;
        newState.profileInfo[name] = value;
        this.setState(newState);
    }

    // SUBMIT HANDLER --> SEND PROFILE EDITS TO PATCH DB
    handleSubmit = async () => {

        if(this.validate()) {

            let updates = [];
            if(this.state.profileInfo.name) {
                updates.push({ "key": "name", "value": this.state.profileInfo.name });
            }
            if(this.state.profileInfo.major) {
                updates.push({ "key": "major", "value": this.state.profileInfo.major });
            }
            if(this.state.profileInfo.class) {
                updates.push({ "key": "class_year", "value": this.state.profileInfo.class });
            }

            let updatedInfo = {
                "session_id": JSON.parse(localStorage.getItem('session_id')),
                "updates": updates
            }

            let response = {}

            await fetch(url+ "/editprofile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedInfo)
            })
            .then(res => res.json())
            .then((parsed) => {
                console.log("Successfully updated profile: ", parsed);
                response = parsed;
                toast.success("Successfully updated profile");
            })
            .catch(err => {
                console.error("Failed to update profile: ", err);
                toast.error("Failed to update profile");
            })

            if(response && response['success']) {
                // handle success message
                this.setState({ profileInfo: {
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirm: '',
                    class: '',
                    major: ''
                }});
            }
            
        }

    }

    changePassword = () => {  
        
        if(this.validatePassword()){
            let updates = [];
            updates.push({ "key": "password", "value": this.state.profileInfo.password });
    
            let updatedInfo = {
                "session_id": JSON.parse(localStorage.getItem('session_id')),
                "updates": updates
            }

            fetch(url+"/editprofile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedInfo)
            })
            .then(res => res.json())
            .then((parsed) => {
                console.log("Successfully updated profile: ", parsed);
                toast.success("Successfully updated profile");
            })
            .catch(err => {
                console.error("Failed to update profile: ", err);
                toast.error("Failed to update profile");
            })

        }      
       

    }

    validatePassword = () => {
        let profile = this.state.profileInfo;
        let isValid = true;
        let errors = {};
         
        // check if password is long enough
        if(profile.password.length < 8) {
            isValid = false;
            errors["password"] = "Password must be at least 8 characters long";
        }

        // check if password and confirm password match
        if(profile.password !== profile.passwordConfirm) {
            isValid = false;
            errors["passwordConfirm"] = "Passwords must match";
        }
        
        this.setState({ errors: errors });

        return isValid;
    }

    validate = () => {
        let profile = this.state.profileInfo;
        let isValid = true;
        let errors = {};

       
        if(profile.class.length > 4) {
            isValid = false;
            errors["classYear"] = "Enter a valid graduation year";
        }

        if(isNaN(profile.class)) {
            isValid = false;
            errors["classYear"] = "Please only use numbers";
        }

        if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(profile.major)){
            isValid = false;
            errors["major"] = "Do not use invalid charactors in the your major declaration"
        }
        
        if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(profile.name)){
            isValid = false;
            errors["name"] = "Do not use invalid charactors in your name"
        }

        this.setState({ errors: errors });

        return isValid;
    }

    render() {

        return(
            <Fragment>
                <NavBar />
                <ToastContainer 
                    position="top-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <div className="page-content-container">
                    <Container className="edit-profile">
                        <Segment clearing raised>
                            <Container className='edit-profile-header' color='black' textAlign='center' >
                                <Header as="h3">Edit Profile</Header>
                            </Container>
                            <Divider />
                            <Container>
                                <Header className='edit-profile-header' as="h4">Edit details of your profile below</Header>
                            </Container>

                            {/* <Divider /> */}

                            <Container>
                                <Form onSubmit={this.handleSubmit}>
                                    <Grid>
                                        <Grid.Row width={16}>
                                            <Grid.Column width={16}>
                                                <Form.Input
                                                    fluid
                                                    label="Name"
                                                    // placeholder={}
                                                    value={this.state.profileInfo.name}
                                                    name="name"
                                                    onChange={this.handleChange}
                                                    error={this.state.errors["name"] || null }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row width={16}>
                                            <Grid.Column width={8}>
                                                <Form.Input
                                                    fluid
                                                    label='Major'
                                                    name="major"
                                                    value={this.state.profileInfo.major}
                                                    onChange={this.handleChange}
                                                    error={this.state.errors["major"] || null }
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <Form.Input
                                                    fluid
                                                    label='Class Year'
                                                    name='class'
                                                    value={this.state.profileInfo.class}
                                                    onChange={this.handleChange}
                                                    error={this.state.errors["classYear"] || null }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column textAlign={"right"}>
                                                <Form.Button 
                                                    color='blue' 
                                                    size='small' 
                                                    floated='right'
                                                    disabled={!this.state.profileInfo.name
                                                        && !this.state.profileInfo.class
                                                        && !this.state.profileInfo.major
                                                    }
                                                >
                                                    Update Profile
                                                </Form.Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form>

                                <Divider />

                                <Container>
                                    <Header className='edit-profile-header' as="h4">Change Your Password</Header>
                                </Container>

                                {/* <Divider /> */}

                                <Form onSubmit={this.changePassword}>
                                    <Grid>
                                        <Grid.Row width={16}>
                                            <Grid.Column width={8}>
                                                <Form.Input
                                                    fluid
                                                    type={"password"}
                                                    label='Reset Password'
                                                    name='password'
                                                    // value={this.state.formInfo.password}
                                                    onChange={this.handleChange}
                                                    error={this.state.errors["password"] || null }
                                                />
                                            </Grid.Column>
                                            <Grid.Column width={8}>
                                                <Form.Input
                                                    fluid
                                                    type={"password"}
                                                    label='Confirm New Password'
                                                    name='passwordConfirm'
                                                    // value={this.state.formInfo.passwordConfirm}
                                                    onChange={this.handleChange}
                                                    error={this.state.errors["passwordConfirm"] || null }
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column textAlign={"right"}>
                                                <Form.Button 
                                                    color='blue' 
                                                    size='small' 
                                                    floated='right'
                                                    disabled={
                                                        !this.state.profileInfo.password
                                                        || !this.state.profileInfo.passwordConfirm
                                                    }
                                                >
                                                    Update Password
                                                </Form.Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form>
                            </Container>
                        </Segment>
                    </Container>
                </div>
            </Fragment>

        );
    }


}

