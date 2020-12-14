import React, { Component, Fragment } from 'react';
import { Header, Container, Rating, Grid, Form, Button, Image, Checkbox, Dropdown } from 'semantic-ui-react';
import { WithContext as ReactTags } from "react-tag-input";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
import PropTypes from 'prop-types';
import '../styles/General.css';
import '../styles/Listing.css';
import '../styles/TagInput.css';
import configData from "../config.json";
const url = configData['SERVER_URL'];

export default class WriteReview extends Component {

    // This is the Create Listing Page
    // Here we have the form in which a user can list an item on the marketplace

    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.state = {
            comments: '',
            seller_id: props.seller,
            session_id: JSON.parse(localStorage.getItem('session_id')),
            score: '',
            errors: {
                comments: '',
                score: ''
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.postItem = this.postItem.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        console.log(props);
    }
    
    postItem = () => {
        let args = {
            "session_id": JSON.parse(localStorage.getItem('session_id')),
            "seller_id": this.props.seller,
            "score": this.state.score,
            "comments": this.state.comments,
            "listing_id": this.props.listingID
        }

        fetch(url+"/addreview", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(args)
        })
        .then(response => response.json())
        .then((parsed) => {
            console.log("Successfully posted review: ", parsed);
            this.props.onPost();
        })
        .catch(err => {
            console.error("Failed to post review: ", err);
        }); 
    }

    handleChange = (e, {name, value}) => {
        let newState = this.state;
        newState[name] = value;
        this.setState(newState);
    }

    handleRate = (e, { rating }) => {
        let newState = this.state;
        newState.score = rating;
        this.setState(newState);
    }

    validate() {
        let errors = {}
        let args = {
            "session_id": JSON.parse(localStorage.getItem('session_id')),
            "seller_id": this.props.seller,
            "listing_id": this.props.listingID
        }
        console.log("Write review args: ", args);
        fetch(url+"/checkvalidreview", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(args)
        })
        .then(response => response.json())
        .then((parsed) => {
            console.log("Write Review parsed: ", parsed)
            if(parsed && parsed['success'] && parsed['valid']){
                console.log("SUCCESS POSTING ")
                this.postItem()
                toast.success('Successfully posted review');
            }
            else if(parsed && parsed['success']){
                errors['comments'] = 'You have buy from this seller before you can leave a review!'
                this.setState({errors: errors})
            }
        })
        .catch(err => {
            console.error("Failed to post keywords: ", err);
        });

    }


    handleSubmit = () => {
        this.validate()
    }


    render() {

        // necessary for ui display of upload file feature
        // const fileInputRef = React.createRef();

        return (
            <Fragment>
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
                <Container>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            <Grid>
                                <Grid.Row width={16}>
                                    <Grid.Column width={4}>
                                        <Header.Subheader>Rating</Header.Subheader>
                                        <Rating
                                            icon='star'
                                            name="score"
                                            defaultRating={0}
                                            maxRating={5}
                                            size='small'
                                            rating={this.state.score}
                                            onRate={this.handleRate}
                                        />
                                    </Grid.Column>
                                    <Grid.Column width={12}>
                                        <Header.Subheader>Comments</Header.Subheader>
                                        <Form.Input
                                            fluid
                                            placeholder='Add comments for the seller'
                                            name='comments'
                                            value={this.state.comments}
                                            maxLength = {256}
                                            onChange={this.handleChange}
                                            error={this.state.errors["comments"] || null }
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form.Field>
                        <Form.Button 
                            color='blue' 
                            size='small' 
                            floated='right'
                            disabled={!this.state.comments
                                || !this.state.score
                                || this.state.score>5
                                || this.state.score<0
                                || isNaN(this.state.score)
                            }
                        >
                            Post Review
                        </Form.Button>
                    </Form>
                </Container>
            </Fragment>




            // <Fragment>
            //     <div className="page-content-container">
            //         <Container className="wirte-review-page">
            //             <Segment className="write-review-box" clearing raised>
            //                 <Container className="start-header" color='black' textAlign='center' >
            //                     <Header as="h3">Write a Review </Header>
            //                 </Container>
            //                 <Container>
            //                     <Container className="create-listing-form-container">
            //                         <Form onSubmit={this.handleSubmit}>
            //                             <Form.Field>
            //                                 <Grid>
            //                                     <Grid.Row width={16}>
            //                                         <Grid.Column width={12}>
            //                                             <Form.Input
            //                                                 fluid
            //                                                 label='Comments'
            //                                                 placeholder='Add comments for the seller'
            //                                                 name='comments'
            //                                                 value={this.state.comments}
            //                                                 maxLength = {256}
            //                                                 onChange={this.handleChange}
            //                                                 error={this.state.errors["comments"] || null }
            //                                             />
            //                                         </Grid.Column>
            //                                             <Grid.Column width={3}>
            //                                             <Form.Input
            //                                                 fluid
            //                                                 label='Rating'
            //                                                 name='score'
            //                                                 placeholder='Rate your seller out of 5'
            //                                                 value={this.state.score}
            //                                                 onChange={this.handleChange}
            //                                                 error={this.state.errors["score"] || null }
            //                                             />
            //                                         </Grid.Column>
                                                    
            //                                     </Grid.Row>
            //                                 </Grid>
            //                             </Form.Field>
            //                             <Form.Button 
            //                                 color='blue' 
            //                                 size='small' 
            //                                 floated='right'
            //                                 disabled={!this.state.comments
            //                                     || !this.state.score
            //                                     || this.state.score>5
            //                                     || this.state.score<0
            //                                     || isNaN(this.state.score)
            //                                 }
            //                             >
            //                                Post Review
            //                             </Form.Button>
            //                         </Form>
            //                     </Container>
            //                 </Container>
            //             </Segment>
            //         </Container>
            //     </div>
            // </Fragment>
        )
    }

}

WriteReview.propTypes = { seller: PropTypes.number, listingID: PropTypes.number, onPost: PropTypes.func }
