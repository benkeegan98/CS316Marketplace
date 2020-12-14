import React, { Component, Fragment } from 'react';
import { Header, Container, Segment, Divider, Button } from 'semantic-ui-react';
import NavBar from '../components/NavBar';
import '../styles/General.css'
import ItemBox from '../components/ItemBox';
import PurchaseBox from '../components/PurchaseBox';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import configData from "../config.json"
const url = configData['SERVER_URL']

export default class PurchaseHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            purchases: []
        }
        this.getPurchaseHistory = this.getPurchaseHistory.bind(this);
        this.getPurchaseHistory();
    }

    getPurchaseHistory = () => {

        let args = {
            "session_id": JSON.parse(localStorage.getItem('session_id'))
        };

        let response = {}

        fetch(url+"/getpurchases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(args)
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("Successfully got purchase history: ", parsed);
            response = parsed;
            if(response['success']){
                console.log("state set")
                this.setState({purchases: response['purchases']});
            }
        })
        .catch(err => {
            console.error("Failed to get purchase history: ", err);
            toast.error("Failed to retrieve your purchase history");
        })

    }

    render() {

        return(
            <Fragment>
            <NavBar />
                <Container className='page-content-container'>
                    {this.state.purchases.length !== 0 ?
                        <Container className='purchase-history-container'>
                            {this.state.purchases.map(purchase => <PurchaseBox item={purchase} /> )}
                        </Container>
                        :
                        <Segment className='no-purchase-history-container' clearing raised>
                            <Container color='black' textAlign='center'>
                                <Header as="h3">It doesn't look like you have any past purchases</Header>
                            </Container>
                            <Divider />
                            <Container color='black' textAlign='center'>
                                <Header as="h4">Head back to the main page and search for items to buy</Header>
                            </Container>
                            <Container className='no-purchase-history-button'>
                                <Button 
                                    as={Link} 
                                    to='home' 
                                    color='blue'
                                >
                                    Back to Home
                                </Button>
                            </Container>  
                        </Segment>
                    }
                </Container>
            </Fragment>    
        )
    }
}