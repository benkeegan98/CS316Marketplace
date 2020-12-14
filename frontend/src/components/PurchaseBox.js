import React, { Component, Fragment } from 'react';
import { Button, Image, Grid, Item, Header, Segment, Modal, Divider, Icon, Container } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/Listing.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dateFormat from 'dateformat';
import configData from "../config.json"
const url = configData['SERVER_URL']

export default class PurchaseBox extends Component {

    // PURCHASE BOX for the LISTINGS PAGE
    // Passed in a purchase object (in array form) --> [buyer_id, date_time, description, id, listing_id, name, retrieval_method, seller_id, total]
    // Also need to make actual component clickable s.t. it brings up the listing page for that item (passing all the information in)

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            favorite: false,
            username: '',
            imageUrl: 'https://react.semantic-ui.com/images/wireframe/image.png'
        }
        this.handleClick = this.handleClick.bind(this);
        this.getImages = this.getImages.bind(this);
        this.getSellerInfo = this.getSellerInfo.bind(this);
        this.getSellerInfo();
    }

    handleClick = () => {
        console.log(this.props.item);
        this.setState({modalOpen: true});
    }

    componentDidMount() {
        this.getImages();
    }

    getImages = async () => {

        let args = {
            "session_id": JSON.parse(localStorage.getItem('session_id')),
            "listing_id": this.props.item.listing_id
        }

        await fetch(url+"/getimages", {
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(args) 
        })
        .then(res => res.json())
        .then((parsed) => {
            // console.log("Successfully got item image(s): ", parsed);
            let imagePath = parsed['images'][0]['image_path'];
            // console.log(imagePath);
            this.setState({imageUrl: imagePath});
        })
        .catch(err => {
            console.error("Failed to get images: ", err);
        })

    }

    getSellerInfo(){
        fetch(url+"/getusername", {
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "session_id": JSON.parse(localStorage.getItem('session_id')),
                "id": this.props.item['seller_id'] 
            }) 
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log(parsed)
            if(parsed && parsed['success']){
                this.setState({username: parsed['name']})
            }
        })
        .catch(err => {
            console.error("Failed to get images: ", err);
        })


    }

    render() {
        console.log(this.props.item);
        const name = this.props.item['name'];
        const description = this.props.item['description'];
        const price = this.props.item['total'];
        const date = dateFormat(this.props.item['date_time'], "mmmm dS, yyyy");
        const seller = this.state.username;
        const sellerid = this.props.item['seller_id'] 
        const retrieval_method = this.props.item['retrieval_method']
        

        return (
            <Fragment>
                
                <div onClick={this.handleClick}>
                    <Segment clearing raised className="item-box-container" > 
                        <Item >
                            <Grid>
                                <Grid.Column textAlign='center' className="item-box-image" width={3} >
                                    <Item.Image  size='small' src={this.state.imageUrl}/> {/* this.props.item.imageUrl */}
                                </Grid.Column>

                                <Grid.Column width={8}>
                                    <Item.Content>
                                        <Item.Header as='h3'>{<a>{name}</a>}</Item.Header>
                                        <Divider />
                                        <Grid>
                                            <Grid.Column width={5}>
                                                <Header as="h5">Description:</Header>
                                                {description}
                                            </Grid.Column>
                                            <Grid.Column width={5}>
                                                <Header as="h5">Sold by:</Header>
                                                <Link 
                                                    as={Button} 
                                                    to= {{
                                                        pathname: "/sellerpage" ,
                                                        state: {
                                                            seller_id: sellerid,
                                                            listing_id: this.props.item['listing_id']
                                                        }
                                                    }}
                                                    floated='left' 
                                                    className="seller-page-button">
                                                    {seller}
                                                </Link>
                                            </Grid.Column>
                                            <Grid.Column width={5}>
                                                <Grid.Row>
                                                    <Header as="h5">Purchased on:</Header>
                                                    {date}
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Header as="h5">Retrived by:</Header>
                                                    {retrieval_method === 'pick-up' ? "Pick Up" : "Shipped"}
                                                </Grid.Row>
                                            </Grid.Column>
                                            
                                        </Grid>
                                        <Item.Extra></Item.Extra>
                                    </Item.Content>
                                </Grid.Column>

                                <Grid.Column centered width={5}className="item-box-details">
                                    <Container className="item-box-price-container">
                                        <Header as='h1' >{`\$${price}`}</Header>
                                    </Container>
                                </Grid.Column>

                            </Grid>
                        </Item>
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
                    <Modal.Header>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={12}>
                                    <Header>{name}</Header>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Header>${price}</Header>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Header>
                    <Modal.Content image>
                        <Image size='medium' src={this.state.imageUrl} wrapped />
                        <Modal.Description>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <Header>{name}</Header>
                                    </Grid.Column>
                                    <Grid.Column width={4}>
                                        <Header>${price}</Header>
                                    </Grid.Column>
                                </Grid.Row>

                                <Divider horizontal/>

                                <Grid.Row>
                                    <Header.Subheader>{description}</Header.Subheader>
                                </Grid.Row>

                            </Grid>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </Fragment>
            
        );
    }

}

PurchaseBox.propTypes = { item: PropTypes.object }