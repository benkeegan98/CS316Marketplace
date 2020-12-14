import React, { Component, Fragment } from 'react';
import { Header, Container, Divider, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/General.css'
import ItemBox from '../components/ItemBox';
import configData from "../config.json"
const url = configData['SERVER_URL']

export default class PurchaseSuccess extends Component {

    constructor(props) {
        super(props);
        this.addPurchase = this.addPurchase.bind(this);
        this.addPurchase();
    }

    addPurchase = async () => {

        let args = {
            "session_id": JSON.parse(localStorage.getItem("session_id")),
            "listing_id": localStorage.getItem('purchase_listing_id'),
            "total": localStorage.getItem('total_price'),
            "retrieval_method":localStorage.getItem('retrieval_method'),
            "date_time": new Date().toISOString().slice(0, 19).replace('T', ' ')
        }

        await fetch(url+"/newpurchase", {
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(args) 
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("SUCCESSFULLY ADDED to purchase:", parsed);
        })
        .catch(err => {
            console.error("Failed to purchase: ", err);
        })

    }

    render() {
        return(
            <div className='page-content-container'>
                <Fragment>
                    <NavBar />
                    <Container textAlign='center'>
                        <Header as='h2' >Purchase Successful!</Header>
                    </Container>
                    <Divider />
                    <Container textAlign='center'>
                        <Button 
                            as={Link} 
                            to='home' 
                            color='blue'
                        >
                            Return to Home
                        </Button>
                    </Container>
                </Fragment>
            </div>

        )
    }
}