import React, { Component, Fragment } from 'react';
import { Button, Image, Grid, Icon, Header, Segment, Modal, Divider, Card, Form, Radio} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/Listing.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadStripe } from "@stripe/stripe-js";
import configData from "../config.json"
const url = configData['SERVER_URL']
const stripePromise = loadStripe("pk_test_51HmmCoFxosqMg9CBtBoF6nyN72XNgMwkiWNuuqQYdIHdhymUVM7HNcu2sQmTC9935j6Htk9ryulSAcIXWtiRR2JG00ffkLyFBC");


export default class ItemCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            favorite: false,
            buttonText: "Add to Favorites",
            stripePromiseString: '', // default image if there is no image loaded
            imageUrl: 'https://react.semantic-ui.com/images/wireframe/image.png',
            retrievalMethod: '',
            item: props.item
        }
        this.handleClick = this.handleClick.bind(this);
        this.checkoutHandler = this.checkoutHandler.bind(this);
        this.addToFavorites = this.addToFavorites.bind(this);
        this.removeFromFavorites = this.removeFromFavorites.bind(this);
        this.handleRetrievalToggle = this.handleRetrievalToggle.bind(this);
        // this.getImages = this.getImages.bind(this);
        // this.getImages();
        console.log("Card Item Prop: ", props.item);
    }

    handleClick = () => {
        console.log(this.props.item);
        this.setState({modalOpen: true});
        let favorites = JSON.parse(localStorage.getItem('favorites'));
        let listingIds = favorites.map(item => item.id);
        if(listingIds.includes(this.props.item.id)) {
            this.setState({favorite: true, buttonText: "Remove from Favorites"});
        } else {
            this.setState({favorite: false, buttonText: "Add to Favorites"});
        }
    }
    
    // Handler for adding item to favorites
    // Need to handle ui for when a user tries to add their own item to their favorites
    addToFavorites = async () => {

        // if(this.isFavorite) {
        //     this.removeFromFavorites();
        if(true) {
            let args = {
                "session_id": JSON.parse(localStorage.getItem('session_id')),
                "listing_id": this.props.item['id'],
                "price": this.props.item['price']
            }
    
            await fetch(url+"/addfavorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(args)
            })
            .then(res => res.json())
            .then((parsed) => {
                console.log("Successfully added to favorites: ", parsed);
                let favorites = JSON.parse(localStorage.getItem('favorites'));
                favorites.push(this.props.item);
                localStorage.setItem('favorites', JSON.stringify(favorites));
                this.setState({favorite: true, buttonText: "Remove from Favorites"})
                toast.success("Successfully added item to your Favorites");

            })
            .catch(err => {
                console.error("Failed to add to favorites: ", err);
                toast.error("Failed to add item to favorites");
            })

        }
        
    }

    removeFromFavorites = async () => {
        let args = {
            "session_id": JSON.parse(localStorage.getItem('session_id')),
            "listing_id": this.props.item['id']
        }

        await fetch(url+"/removefavorites", {
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(args) 
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("Successfully removed from favorites: ", parsed);
            let favorites = JSON.parse(localStorage.getItem('favorites'));
            let listingIds = favorites.map(item => item.id);
            if(listingIds.includes(this.props.item.id)) {
                let index = listingIds.indexOf(this.props.item.id);
                console.log(index);
                favorites.splice(index, 1);
                console.log(favorites);
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
            this.setState({ favorite: false, buttonText: "Add to Favorites" });
            toast.success("Successfully removed item to your Favorites");
        })
        .catch(err => {
            console.error("Failed to remove from favorites: ", err);
            toast.error("Failed to remove from favorites");
        })
    }

    checkoutHandler = async () => {

        let price = this.props.item['price'];

        if(this.state.retrievalMethod === 'ship') {
            price = price + 3*(this.props.item['weight']||0)
        } 

        const stripe = await stripePromise;

        const item = this.props.item;

        console.log(item);

        let ship = (this.state.retrievalMethod==='ship')

        let args = {
            "name": item.name,
            "price": item.price,
            "ship": ship,
            "weight": this.props.item['weight'],
            "image_path": this.props.item.image_path,
            "listing_id": this.props.item['id']
        }

        const response = await fetch(url+"/create-stripe-session", {
            method: "POST",
            header: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(args)
        });

        localStorage.setItem('purchase_listing_id', this.props.item['id']);
        localStorage.setItem('total_price', price);
        localStorage.setItem('retrieval_method', (this.state.retrievalMethod || 'pick-up'));

        const session = await response.json();

        const result = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (result.error) {
            console.error("Stripe Error: ", result.error);
        }
    }

    handleRetrievalToggle = (e, { value }) => {
        let newState = this.state;
        newState.retrievalMethod = value;
        this.setState(newState);
    }
    

    render() {
        // console.log(this.props.item);
        const name = this.props.item.name;
        const category = this.props.item.category;
        const description = this.props.item.description;
        const price = this.props.item.price;
        const choice = (this.props.item['ship'] && this.props.item['pick_up'])
        const sellerid = this.props.item['seller_id'];
        const weight = this.props.item['weight'];
        if(choice===false){
            if(this.props.item['ship'] === 0){
                this.setState({retrievalMethod: "pick-up" })
            }
            else{
                this.setState({retrievalMethod: "ship" })
            }
        }

        return (
            <Fragment>
                <div onClick={this.handleClick}>
                    <Segment clearing raised className="item-card-container" >
                        <Card>
                            <Image className='item-card-image' src={this.props.item.image_path} centered wrapped ui={true} />
                            <Card.Content className='item-card-content'>
                                {/* <Card.Header className='item-card-header'>{name}</Card.Header> */}
                                <Card.Meta>
                                    <span className='item-card-name'>{this.props.item.name}</span>
                                </Card.Meta>
                            </Card.Content>
                            <Card.Content extra>
                                {`\$${this.props.item.price}`}
                            </Card.Content>
                        </Card>
                    </Segment>
                </div>
                <Modal
                    onClose={() => this.setState({modalOpen: false})}
                    onOpen={() => {
                        this.setState({modalOpen: true});
                    }}
                    open={this.state.modalOpen}
                    dimmer='blurring'
                >
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
                    <Modal.Content>
                        <Grid>
                            <Grid.Column width={4}>
                                <Image size='medium' src={this.props.item.image_path} wrapped />
                            </Grid.Column>
                            <Grid.Column width={12}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={11}>
                                            <Header as='h2'>{name}</Header>
                                        </Grid.Column>
                                        <Grid.Column width={5} textAlign='right'>
                                            <Header as='h2'>${price}</Header>
                                        </Grid.Column>
                                        
                                    </Grid.Row>

                                    <Divider />
                                    
                                    <Grid.Row>
                                        <Grid.Column  width={5}>
                                            <Grid.Row>
                                                <Header as="h5">Category:</Header>
                                                {category}
                                            </Grid.Row>
                                        </Grid.Column>

                                        <Grid.Column width={5}>
                                            <Header as="h5">Description:</Header>
                                            {description}
                                        </Grid.Column>

                                        <Grid.Column  width={6} textAlign='right'>
                                            <Button 
                                                content= {this.state.favorite ? "Remove from Favorites" : "Add to Favorites"}
                                                icon={this.state.favorite ? <Icon name="star" color="yellow"/> : <Icon name="star"/>}
                                                color='black' 
                                                onClick={() => { this.state.favorite ? this.removeFromFavorites() : this.addToFavorites()}}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Divider />
                                    <Grid.Row>
                                        {/* <Header as="h5">Sold by:</Header> */}
                                        <Grid.Column>
                                            <Link 
                                                to= {{
                                                    pathname: "/sellerpage" ,
                                                    state: {
                                                        seller_id: sellerid
                                                    }
                                                }}
                                                floated='left' 
                                                className="seller-page-button">
                                                Visit Seller Page
                                            </Link>
                                        </Grid.Column>
                                    </Grid.Row>

                                </Grid>
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    { choice ? 
                                        <Segment>
                                            <Form.Group grouped >
                                                <Grid className='checkbox-grid'>
                                                    <Grid.Row>
                                                        <Header as='h4' style={{padding: '0 10px 0 0'}}>Choose Preferred Retrieval Method: </Header>
                                                        <Form.Field style={{padding: '0 5px'}}>
                                                            <Radio
                                                                label='Ship'
                                                                value='ship'
                                                                checked={this.state.retrievalMethod === 'ship'}
                                                                onChange={this.handleRetrievalToggle}
                                                            />
                                                        </Form.Field>
                                                        <Form.Field style={{padding: '0 5px'}}>
                                                            <Radio
                                                                label='Pick Up'
                                                                value='pick_up'
                                                                checked={this.state.retrievalMethod === 'pick_up'}
                                                                onChange={this.handleRetrievalToggle}
                                                                // error={this.state.errors["pickup"] || null }
                                                            />
                                                        </Form.Field>
                                                    </Grid.Row>
                                                </Grid> 
                                            </Form.Group>
                                        </Segment>
                                        :
                                        <Form>

                                        </Form>
                                    }
                                </Grid.Column>
                                <Grid.Column width={4} >
                                    <Segment>
                                        <Header as="h4">Final Price: </Header>
                                        {this.state.retrievalMethod === 'ship' ? `incl. $${3*weight} for delivery` : ''}
                                        <Header as="h3">${this.state.retrievalMethod === 'ship' ? price + 3*(weight||0) : price}</Header>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Button
                                        content="Purchase Now"
                                        labelPosition='right'
                                        icon='cart'
                                        onClick={() => this.checkoutHandler()}
                                        positive
                                        disabled={
                                            choice? !this.state.retrievalMethod : false
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        
                    </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }


}

ItemCard.propTypes = { item: PropTypes.object, recType: PropTypes.string }