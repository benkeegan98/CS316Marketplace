import React, { Component } from 'react';
import { Header, Container, Grid, Button, Segment, Image } from 'semantic-ui-react';
import { Link } from "react-router-dom";
import "./Account.css";
const logo = "https://res.cloudinary.com/dukemarket316/image/upload/v1605398092/marketplace316/ygkl28yshlm7ugcnhggn.png";

export default class Start extends Component {

  render() {
    return(
      <Container className="start">
        <Container>
          <Image src={logo} size='medium' centered />
        </Container>
        <Container className="start-header" color='black' textAlign='center'>
          <Header as="h3">Welcome to Duke Marketplace</Header>
        </Container>
        <Segment className="sign-up-box" clearing raised>
          <Grid columns={2} textAlign='center'>
            <Grid.Column>
              <Link as={Button} to="/signup">
                <Header.Subheader className='start-button'>Make an Account</Header.Subheader>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <Link as={Button} to="/login">
                <Header.Subheader className='start-button'>Login</Header.Subheader>
              </Link>
            </Grid.Column>
          </Grid>
        </Segment>
      </Container>
    )
  }
}