import React, { Component } from 'react';
import { Menu, Icon, Container, Dropdown, Image, Header, Grid } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import SearchBar from './SearchBar';
import '../styles/NavBar.css';
import configData from "../config.json"
const url = configData['SERVER_URL']
const logo = "https://res.cloudinary.com/dukemarket316/image/upload/v1605398092/marketplace316/ygkl28yshlm7ugcnhggn.png";


// Navigation Bar that will be at the top of all pages

export default class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
        this.logOut = this.logOut.bind(this);
    }

    logOut = () => {
        fetch(url+"/logout", {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                    "session_id": JSON.parse(localStorage.getItem('session_id'))
                    })
                })
                .then(response => 
                    response.json())
                .then((parsed) => {
                console.log(parsed);
                })
                .catch(err => {
                console.error(err);
                });
        localStorage.clear();
        this.setState({ redirect: true });
    }

    

    render() {

        if (this.state.redirect) {
            return (<Redirect push to="/login"/>)
        }

        return (
            <div>
                <Menu fixed='top'>
                    <Container className="nav-bar-container">
                        <Menu.Item
                            as={Link}
                            name='home'
                            to='/home'
                        >
                            <Image src={logo} size='mini' centered />
                        </Menu.Item>
                        <Menu.Item  
                            as={Link}
                            name='favorites'
                            to='/favorites'
                        >
                            <Icon name='star'></Icon>
                            Favorites
                        </Menu.Item>
                        <Menu.Item className='search-bar'>
                            <SearchBar />
                        </Menu.Item>
                        <Menu.Menu position='right'>
                            <Menu.Item
                                as={Link}
                                name='createlisting'
                                to='/createlisting'
                            >
                                <Icon name='plus'></Icon>
                                List Item
                            </Menu.Item>
                        </Menu.Menu>
                        <Dropdown className="user-menu-item" position='right' icon='user' simple>
                            <Dropdown.Menu>
                                <Dropdown.Header>{JSON.parse(localStorage.getItem('email'))}</Dropdown.Header>
                                <Dropdown.Item
                                    as={Link}
                                    name='editprofile'
                                    to='/editprofile'
                                >
                                    Edit User Profile
                                </Dropdown.Item>
                                <Dropdown.Item
                                    as={Link}
                                    name='purchasehistory'
                                    to='/purchasehistory'
                                >
                                    Purchase History
                                </Dropdown.Item>
                                <Dropdown.Item onClick={this.logOut}>Log Out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        
                    </Container>
                </Menu>
            </div>
            
        );
    }
}