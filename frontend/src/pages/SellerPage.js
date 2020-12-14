import React, { Component, Fragment } from 'react';
import { Header, Container, Segment, Divider, Button, Grid, Rating } from 'semantic-ui-react';
import NavBar from '../components/NavBar';
import '../styles/General.css'
import '../styles/SellerPage.css'
import ItemBox from '../components/ItemBox';
import PurchaseBox from '../components/PurchaseBox';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import configData from "../config.json"
import WriteReview from './WriteReview';
const url = configData['SERVER_URL']

export default class SellerPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            reviews: [],
            listings: [],
            sellerinfo: {
                class_year: '',
                email: '',
                major: "",
                name: "",
                seller_rating: 0,
                id: 0
            },
            rating: 0,
            displayReviews: []
        }

        this.getSeller = this.getSeller.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.getReviewsDisplay = this.getReviewsDisplay.bind(this);
        this.onReviewPost = this.onReviewPost.bind(this);
        this.getSeller();
        this.getReviews();
        let displayReviews = [];
    }

    getSeller = async () => {
        const sellerid = this.props.location.state.seller_id;
        
        let response = {};
        await fetch(url+"/getseller", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "session_id": JSON.parse(localStorage.getItem('session_id')),
                "seller_id": sellerid
            })
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log(parsed);
            response = parsed;
            if(response['success']){
                this.setState({listings: response['listings'], sellerinfo: response['seller_info'][0]});
                console.log("state set: ", response['seller_info'][0])
            }
        })
        .catch(err => {
            console.error("Failed to get purchase history: ", err);
            toast.error("Failed to retrieve your purchase history");
        })
    }

    getReviews= () => {
        const sellerid = this.props.location.state.seller_id;
        
        let response = {};
        fetch(url+"/getreviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                "session_id": JSON.parse(localStorage.getItem('session_id')),
                "seller_id": sellerid
            })
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log(parsed);
            response = parsed;
            if(response['success']){
                console.log("state set")
                this.setState({reviews: response['reviews']});
                this.setState({displayReviews: this.getReviewsDisplay() })
            }
        })
        .catch(err => {
            console.error("Failed to get purchase history: ", err);
            toast.error("Failed to retrieve your purchase history");
        })

    }

    getReviewsDisplay = () => {
        if(this.state.reviews.length > 0) {
            return this.state.reviews.map(review =>
                <Fragment>
                    <Grid width={16}>
                        <Grid.Column className="reviews-rating-star" width={4}>
                            <Rating
                                icon='star'
                                defaultRating={Math.round(review.score) > 5 ? 5 : Math.round(review.score)}
                                maxRating={5}
                                size='small'
                                disabled
                            />
                        </Grid.Column>
                        <Grid.Column width={12}>
                            Comments:
                            <Segment>
                                {review.comments || "This user left no comments"}
                            </Segment>
                        </Grid.Column>
                    </Grid>
                    <Divider />
                </Fragment>
            );
        } else {
            return [];
        }
    }
    
    onReviewPost = () => {
        console.log("On Review Post: ");
        this.getReviews();
        this.setState({displayReviews: this.getReviewsDisplay() })
    }

    render() {
        const listingID = this.props.location.state.listing_id;
        console.log("Listing ID seller page: ", listingID);

        return(
            <Fragment>
                <NavBar />
                <Container className='page-content-container'>
                    <Segment clearing raised>
                        <Grid columns='equal'>
                            <Grid.Row stretched width={16}>
                                <Grid.Column width={4}>
                                    <Container textAlign='center'>
                                        <Header as='h1'>{this.state.sellerinfo.name}</Header>
                                    </Container>
                                </Grid.Column>
                                <Grid.Column width={4} textAlign='right'>
                                    <Grid.Row>
                                        {`Class of ${this.state.sellerinfo.class_year}`}
                                    </Grid.Row>
                                    <Grid.Row>
                                        {`Major: ${this.state.sellerinfo.major}`}
                                    </Grid.Row>
                                </Grid.Column>

                                <Grid.Column />

                                <Grid.Column textAlign='right'>
                                    <Container>
                                        <Fragment>
                                            <Header.Subheader>Email Seller:</Header.Subheader>
                                            <a href={`mailto:${this.state.sellerinfo.email}`}>{this.state.sellerinfo.email}</a>
                                        </Fragment>
                                    </Container>
                                </Grid.Column>

                            </Grid.Row>
                            <Divider />
                            <Grid.Row stretched >
                                <Grid.Column>
                                    <Segment clearing>
                                        <Fragment>
                                            <Header as='h3' textAlign='center'>Current Listings</Header>
                                            <Divider />
                                            {this.state.listings.length > 0 ?
                                                this.state.listings.map(listing => <ItemBox item={listing} />)
                                                :
                                                <Header as='h4' textAlign='center'>It doesn't look like this seller has any listings right now</Header>
                                            }
                                        </Fragment>
                                    </Segment>
                                </Grid.Column>
                                {/* REVIEWS */}
                                <Grid.Column>
                                    <Segment clearing>
                                        <Fragment>
                                            <Header as='h3' textAlign='center'>Ratings and Reviews</Header>
                                            <Divider />
                                            <Grid columns='equal'>
                                                <Grid.Column textAlign='right'>
                                                    <Header as='h4' textAlign='right'>Average Rating: </Header>
                                                    <Rating
                                                        icon='star'
                                                        rating={this.state.sellerinfo.seller_rating}
                                                        maxRating={5}
                                                        size='large'
                                                        disabled
                                                    />
                                                </Grid.Column>
                                            </Grid>
                                            <Divider />
                                            <Header as='h4' textAlign='left'>Reviews: </Header>
                                            <Segment style={{overflow: 'auto', maxHeight: 200 }}>
                                                {this.state.displayReviews}
                                            </Segment>
                                            <Divider />
                                            <Header as='h4' textAlign='left'>{`If you have bought from ${this.state.sellerinfo.name}, leave a review:`}</Header>
                                            <WriteReview listingID={listingID} seller={this.state.sellerinfo.id} onPost={this.onReviewPost}/>
                                        </Fragment>
                                    </Segment>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>



                    {/* {this.state.purchases ?
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
                    } */}
                </Container>
            </Fragment>    
        )
    }
}