import React, { Component, Fragment } from 'react';
import { Header, Container, Segment, Grid, Form, Button, Image, Checkbox, Dropdown } from 'semantic-ui-react';
import { WithContext as ReactTags } from "react-tag-input";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from '../components/NavBar';
import '../styles/General.css';
import '../styles/Listing.css';
import '../styles/TagInput.css';
import configData from "../config.json"
const url = configData['SERVER_URL']


const categories = [
    { key: 'ac', value: 'Accessories', text: 'Accessories' },
    { key: 'aps', value: 'Apparel set', text: 'Apparel Set' },
    { key: 'ap', value: 'Appliances', text: 'Appliances' },
    { key: 'ba', value: 'Baby', text: 'Baby' },
    { key: 'bg', value: 'Bags', text: 'Bags' },
    { key: 'be', value: 'Beauty', text: 'Beauty' },
    { key: 'bs', value: 'Belts', text: 'Belts' },
    { key: 'bo', value: 'Books', text: 'Books' },
    { key: 'bt', value: 'Bottomwear', text: 'Bottomwear' },
    { key: 'cl', value: 'Clothing', text: 'Clothing' },
    { key: 'dr', value: 'Dress', text: 'Dress' },
    { key: 'el', value: 'Electronics', text: 'Electronics' },
    { key: 'ey', value: 'Eyeware', text: 'Eyeware' },
    { key: 'ff', value: 'Flip Flops', text: 'Flip Flops' },
    { key: 'fr', value: 'Fragrance', text: 'Fragrance' },
    { key: 'fre', value: 'Free Gifts', text: 'Free Gifts' },              
    { key: 'fu', value: 'Furniture', text: 'Furniture' },
    { key: 'he', value: 'Headwear', text: 'Headwear' },
    { key: 'ho', value: 'Home & Kitchen', text: 'Home & Kitchen' },
    { key: 'in', value: 'Innerwear', text: 'Innerwear' },
    { key: 'je', value: 'Jewellery', text: 'Jewelry' },
    { key: 'li', value: 'Lips', text: 'Lips' }, 
    { key: 'lo', value: 'Loungewear and Nightwear', text: 'Loungewear and Nightwear' }, 
    { key: 'ma', value: 'Makeup', text: 'Makeup' },  
    { key: 'mi', value: 'Musical Instruments', text: 'Musical Instruments'},    
    { key: 'mo', value: 'Movies', text: 'Movies' },
    { key: 'mu', value: 'Mufflers', text: 'Mufflers' },
    { key: 'na', value: 'Nails', text: 'Nails' },
    { key: 'ou', value: 'Outdoor & Garden', text: 'Outdoor & Garden' },
    { key: 'pe', value: 'Pet Supplies', text: 'Pet Supplies' },
    { key: 'sa', value: 'Sandal', text: 'Sandal' },
    { key: 'sr', value: 'Saree', text: 'Saree' },
    { key: 'sc', value: 'Scarves', text: 'Scarves' },
    { key: 'sh', value: 'Shoes', text: 'Shoes' },
    { key: 'sac', value: 'Shoe Accessories', text: 'Shoe Accessories' },
    { key: 'sk', value: 'Skin', text: 'Skin' },
    { key: 'skc', value: 'Skin Care', text: 'Skin Care' },
    { key: 'so', value: 'Socks', text: 'Socks' },
    { key: 'spj', value: 'Sports Jerseys', text: 'Sports Jerseys' },
    { key: 'tx', value: 'Textbooks', text: 'Textbooks' },
    { key: 'ti', value: 'Ties', text: 'Ties' },
    { key: 'to', value: 'Topwear', text: 'Topwear' },
    { key: 've', value: 'Vehicles', text: 'Vehicles' },
    { key: 'vi', value: 'Video Games', text: 'Video Games' },
    { key: 'wl', value: 'Wallets', text: 'Wallets' },
    { key: 'wa', value: 'Watches', text: 'Watches' },
    { key: 'ot', value: 'Other', text: 'Other'}
  ]


export default class CreateListing extends Component {

    // This is the Create Listing Page
    // Here we have the form in which a user can list an item on the marketplace

    constructor(props) {
        super(props);
        this.fileInputRef = React.createRef();
        this.state = {
            redirect: false,
            tags: [],
            item: {
                seller_id: '', // populate this automatically with seller id that is currently logged in
                name: '',
                price: '', 
                description: '',
                sold: false,
                ship: false, // boolean in form
                pick_up: false, // boolean in form
                category: '',
                weight: '',
                zipcode: '',
                listing_id: ''
            },
            errors: {
                "zipcode": '',
                "retrieval": ''
            },
            isEditingPrice: false,
            imageFile: null,
            imageUrl: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.postItem = this.postItem.bind(this);
        this.toCurrency = this.toCurrency.bind(this);
        this.handleCheckboxToggle = this.handleCheckboxToggle.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.postKeywords = this.postKeywords.bind(this);
        this.saveImage = this.saveImage.bind(this);
    }
    

    handleChange = (e, {name, value}) => {
        let newState = this.state;
        newState.item[name] = value;
        this.setState(newState);
    }

    handleDelete = i => {
        let newState = this.state;
        newState.tags.splice(i, 1);
        this.setState({ newState });
    }

    handleDrag = (tag, currPos, newPos) => {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
 
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
 
        // re-render
        this.setState({ tags: newTags });
    }
    
    handleAddition = (tag) => {
        console.log(JSON.stringify(tag))
        let newState = this.state;
        tag.id=(this.state.tags.length+1).toString();
        newState.tags.push(tag);
        this.setState({ newState });
        console.log(JSON.stringify(this.state.tags))
    }


    postKeywords = async () => {
        const tags_array = this.state.tags.map(object => {return object['text']})

        fetch(url+"/addkeywords", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "listing_id": this.state.item.listing_id,
                "keywords": tags_array
            })
        })
        .then(response => response.json())
        .then((parsed) => {
            console.log("Successfully posted keywords: ", parsed);
        })
        .catch(err => {
            console.error("Failed to post keywords: ", err);
        }); 
    }

    // post item to backend api to add listing to database
    postItem = async () => {

        // add seller id to item in state and turn strings into number format
        let listing = this.state.item;
        listing.price = parseInt(this.state.item.price);
        listing.weight = parseInt(this.state.item.weight);
        listing.zipcode = parseInt(this.state.item.zipcode);
        listing.pick_up = listing.pick_up ? 1 : 0;
        listing.ship = listing.ship ? 1 : 0;
        listing.sold = listing.sold ? 1 : 0;
        listing.session_id = JSON.parse(localStorage.getItem('session_id'));

        let response = {}

        await fetch(url+"/newlisting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(listing)
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("Successful new listing post ", parsed);
            
            let newState = this.state.item;
            newState.listing_id = parsed.listing_id;
            this.setState({item: newState});
            console.log("Listing ID: ", this.state.item.listing_id);

            this.postKeywords();
            if(this.state.imageUrl) {
                this.saveImage(this.state.item.listing_id, this.state.imageUrl);
            }

            toast.success("Listing Posted Successfully");
        })
        .catch(err => {
            console.error("Failed to post new listing: ", err);
            toast.error("Failed to post new listing");
        });
        
    }

    toCurrency = number => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        return formatter.format(number);
    }

    togglePriceEditing = () => {
        this.setState({ isEditingPrice: !this.state.isEditingPrice });
    }

    handleCheckboxToggle = (e, { name, checked }) => {
        let newState = this.state;
        newState.item[name] = checked ? true : false;
        // newState.item[name]=!this.state.item[name];
        this.setState(newState);
    }

    onTagChange = data => {
        // e.preventDefault();
        console.log(data);
    }
    
    // necessary for ui display of upload file feature
    // fileInputRef = React.createRef();

    // uploads chosen file image to cloudinary and sets imageUrl in state to hold the link to this image
    imageUpload = async e => {
        e.preventDefault();

        let file = e.target.files[0];
        let formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", 'marketplace316');

        await fetch('https://api.cloudinary.com/v1_1/dukemarket316/image/upload', {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("Successfully uploaded image to Cloudinary", parsed);
            this.setState({ imageUrl: parsed.secure_url });
        })
        .catch(err => {
            console.error("Failed to upload image to Cloudinary", err);
            toast.error("Failed to upload image");
        })

    };

    // METHOD to upload keywords to the db
    tagUpload = async () => {
        let args = {
            keywords: this.state.tags
        }

        const res = await fetch(url+"/addkeywords", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(args)
        })
        .catch(err => {
            console.error("Failed to post keywords: ", err);
        });

        console.log("Successfully uploaded keywords to db: ", res);

        const responseData = await res.json();
        console.log("Response json: ", responseData);

    }

    validate() {

        let formData = this.state.item;
        let isValid = true;
        let errors = {};

        // checks for valid zipcode
        if(formData.zipcode.length !== 5) {
            isValid = false;
            errors["zipcode"] = "Invalid zipcode";
        }

        this.setState({ errors: errors })

        return isValid;

    }

    onTagsChanged(tags) {
        let newState = this.state;
        newState.item['tags'] = tags;
        this.setState(newState);
    }
    

    handleSubmit = () => {
        if(this.validate()){
            this.postItem()
        }
    }

    handleClick = (event) => {
        if (event.detail === 0) {
          return
        }
      
        this.fileInputRef.current.click()
    };

    saveImage = async ( listingNum, imageUrl ) => {
    
        let imageData = {
            'listing_id': listingNum,
            'image_path': imageUrl,
            'session_id': JSON.parse(localStorage.getItem('session_id'))
        }
        let response = {}

        await fetch(url+"/addimage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(imageData)
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("Successfully posted image: ", parsed);
            response = parsed;
        })
        .catch(err => {
            console.error("Failed to post image: ", err);
            toast.error("Failed to post image");
        })
    }

    render() {

        // necessary for ui display of upload file feature
        // const fileInputRef = React.createRef();

        return (
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
                    <Container className="create-listing-page">
                        <Segment className="create-listing-box" clearing raised>
                            <Container className="start-header" color='black' textAlign='center' >
                                <Header as="h3">Create Listing </Header>
                            </Container>
                            <Container>
                                <Container className="sign-up-header" color='black' >
                                    <Header as="h4">Add details of your item below</Header>
                                </Container>
                                <Container className="create-listing-form-container">
                                    <Form onSubmit={this.handleSubmit}>
                                        <Form.Field>
                                            <Grid>
                                                <Grid.Row width={16}>
                                                    <Grid.Column width={12}>
                                                        <Form.Input
                                                            fluid
                                                            label='Item Name'
                                                            placeholder='Duke Basketball Kyrie Jersey'
                                                            name='name'
                                                            value={this.state.item.name}
                                                            onChange={this.handleChange}
                                                            // error={this.state.errors["name"] || null }
                                                        />
                                                    </Grid.Column>
                                                    <Grid.Column width={4}>
                                                    {this.state.isEditingPrice ? (
                                                        <Form.Input
                                                            fluid
                                                            type='number'
                                                            placeholder='9.99'
                                                            label='Price'
                                                            name='price'
                                                            value={this.state.item.price}
                                                            onChange={this.handleChange}
                                                            onBlur={this.togglePriceEditing.bind(this)}
                                                            // error={this.state.errors["price"] || null }
                                                        />
                                                        ) : (
                                                        <Form.Input
                                                            fluid
                                                            type='text'
                                                            placeholder='9.99'
                                                            label='Price'
                                                            name='price'
                                                            value={this.toCurrency(this.state.item.price)}
                                                            onFocus={this.togglePriceEditing.bind(this)}
                                                            // error={this.state.errors["price"] || null }
                                                        />
                                                    )}
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Form.Field>
                                        <Form.TextArea
                                            fluid
                                            placeholder='Add a description for your item...'
                                            label='Item Description'
                                            name='description'
                                            value={this.state.item.description}
                                            onChange={this.handleChange}
                                            // error={this.state.errors["email"] || null }
                                        />
                                        <Container>
                                            <Form.Field>
                                                <label>Upload Item Image</label>
                                                <Button
                                                    content="Choose Image"
                                                    labelPosition="left"
                                                    icon="file"
                                                    onClick={this.handleClick}
                                                    type="button"
                                                />
                                                <input
                                                    ref={this.fileInputRef}
                                                    type="file"
                                                    hidden
                                                    onChange={this.imageUpload}
                                                />
                                            </Form.Field>
                                            <Image src={this.state.imageUrl} size='medium' />
                                        </Container>

                                        <Grid className='create-listing-grid'>
                                            <Grid.Row width={16}>
                                                <Grid.Column width={10}>
                                                    <label className='create-listing-category-dropdown-label' >Category</label>
                                                    <Dropdown
                                                        fluid
                                                        selection
                                                        options={categories}
                                                        placeholder = 'Choose Category'
                                                        label='Category'
                                                        name='category'
                                                        value={this.state.item.category}
                                                        onChange={this.handleChange}
                                                    />
                                                </Grid.Column>
                                                <Grid.Column width={3}>
                                                    <Form.Input
                                                        fluid
                                                        label='Item Weight'
                                                        name='weight'
                                                        placeholder='Weight in lbs'
                                                        value={this.state.item.weight}
                                                        onChange={this.handleChange}
                                                        // error={this.state.errors["passwordConfirm"] || null }
                                                    />
                                                </Grid.Column>
                                                <Grid.Column width={3}>
                                                    <Form.Input
                                                        fluid
                                                        label='Zip Code'
                                                        name='zipcode'
                                                        placeholder='27708'
                                                        value={this.state.item.zipcode}
                                                        onChange={this.handleChange}
                                                        error={this.state.errors["zipcode"] || null }
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <div className="tags-container">
                                                    <label className='create-listing-category-dropdown-label' >Add Keywords</label>
                                                    <ReactTags
                                                        inline
                                                        placeholder = "Enter keyword and press enter"
                                                        tags={this.state.tags}
                                                        handleDelete={this.handleDelete}
                                                        handleAddition = {this.handleAddition}
                                                        handleTagClick={this.handleTagClick}
                                                        handleDrag={this.handleDrag}
                                                        delimiters = {[188,9,13]}
                                                        onChange = {this.onTagsChanged}
                                                    />
                                                </div>
                                            </Grid.Row>
                                        </Grid>
                                        <Form.Group grouped >
                                            <label>Will your item be shipped or picked up?</label>
                                            <Grid className='checkbox-grid'>
                                                <Grid.Row>
                                                    <Checkbox
                                                        label='Ship'
                                                        name='ship'
                                                        // checked={this.state.item.ship === true}// if checked, ship should be true
                                                        onChange={this.handleCheckboxToggle}
                                                    />
                                                </Grid.Row>
                                                <Grid.Row>
                                                    <Checkbox
                                                        label='Pick Up'
                                                        name='pick_up'
                                                        // checked={this.state.item.pickUp === true}
                                                        onChange={this.handleCheckboxToggle}
                                                        error={this.state.errors["retrieval"] || null }
                                                    />
                                                </Grid.Row>
                                            </Grid>
                                        </Form.Group>
                                        {/* <Form.Field>
                                            <TagInput onChange={this.onTagChange} />
                                        </Form.Field> */}
                                        <Form.Button 
                                            color='blue' 
                                            size='small' 
                                            floated='right'
                                            disabled={!this.state.item.name
                                                || !this.state.item.price
                                                || !this.state.item.description
                                                || !this.state.item.category
                                                || !this.state.item.weight
                                                || !this.state.item.zipcode
                                                || (!this.state.item.ship && !this.state.item.pick_up)
                                            }
                                        >
                                            List Item
                                        </Form.Button>
                                    </Form>
                                </Container>
                            </Container>
                        </Segment>
                    </Container>
                </div>
            </Fragment>
        )
    }

}
