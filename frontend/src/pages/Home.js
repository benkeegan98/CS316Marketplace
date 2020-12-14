import React, { Component, Fragment, useEffect } from 'react';
import { Header, Container, Divider, Pagination, Grid, Icon, Segment, Dropdown } from 'semantic-ui-react';
import NavBar from '../components/NavBar';
import '../styles/General.css'
import ItemBox from '../components/ItemBox';
import ItemCard from '../components/ItemCard';
import configData from "../config.json"
const url = configData['SERVER_URL']

const recDropdowOptions = [
    {
        key: 'major',
        text: 'major',
        value: 'major',
        content: 'Major',
      },
      {
        key: 'purchases',
        text: 'purchases',
        value: 'purchases',
        content: 'Purchases',
      },
]

const categories = [
    { key: 'aa', value: 'All Listings', text: 'All Listings' },
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
    { key: 'sp', value: 'Sports', text: 'Sports' },
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

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listings: [],
            recommendations: [],
            activePage: 1,
            recDropdown: 'major',
            listingsCategory: "All Listings"
        }
        this.getListings = this.getListings.bind(this);
        this.getRecommendations = this.getRecommendations.bind(this);
        this.getFavorites = this.getFavorites.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleRecsChange = this.handleRecsChange.bind(this);
        this.handleListingsChange = this.handleListingsChange.bind(this);
        this.categorySearch = this.categorySearch.bind(this);
        this.generateItemBoxes = this.generateItemBoxes.bind(this);
        this.getListings(0,10)
        this.getRecommendations() 
        this.getFavorites()
        localStorage.setItem('page','Home')
    }

    handleRecsChange = async (e, {value}) => {
        let newState = this.state;
        newState.recDropdown = value;
        console.log("New State: ",newState );
        this.setState(newState);
        await this.getRecommendations();
    }

    getListings = (off, numRows) => {

        // console.log(localStorage.getItem('session_id'));

        let args = {
            "offset": off,
            "rows": numRows,
            "session_id": JSON.parse(localStorage.getItem('session_id'))
        };

        console.log(args);

        fetch(url+"/getlistings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(args)
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("Successfully got listings: ", parsed);
            if(parsed["success"]) {
                console.log(JSON.stringify(parsed["listings"]))
                localStorage.setItem('listings', JSON.stringify(parsed["listings"]))
                this.setState({listings: JSON.parse(localStorage.getItem('listings'))});
            }
            
        })
        .catch(err => {
            console.error("Failed to get listings: ", err);
        })

    }

    getFavorites = async () => {

        let args = {
            "session_id": JSON.parse(localStorage.getItem('session_id'))
        };

        await fetch(url+"/getfavorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(args)
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("Successfully got favorites: ", parsed);
            if(parsed.success) {
                this.setState({ favorites: parsed.favorites})
                localStorage.setItem('favorites', JSON.stringify(this.state.favorites)); // add favorites to storage so we can manipulate and display favorites
            }
        })
        .catch(err => {
            console.error("Failed to get favorites: ", err);
        })

    }

    getRecommendations = async () => {
        console.log("Running getRecommendations...");
        
        let args = {
            "session_id": JSON.parse(localStorage.getItem('session_id'))
        };

        let postUrl = url+`/getrecommendedby${this.state.recDropdown}`;

        await fetch(postUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(args)
        })
        .then(res => res.json())
        .then((parsed) => {
            console.log("Successfully got recommendations: ", parsed);
            if(this.state.recDropdown === 'purchases') {
                for(let i = 0; i < parsed['recommendations'].length; i++) {
                    parsed['recommendations'][i]['id'] = parsed['recommendations'][i]['listing_id'];
                }
                console.log("added id to parsed: ", parsed);
            }
            this.setState({recommendations: parsed.recommendations})
            localStorage.setItem('recs', JSON.stringify(this.state.recommendations))
        })
        .catch(err => {
            console.error("Failed to get recommendations: ", err);
        })
    }

    handlePageChange = (e, { activePage }) => {
        this.setState({ activePage: activePage })
        this.getListings((activePage-1)*10, 10);
    }

    handleListingsChange = (e, {value}) => {
        
        if(value === 'All Listings') {
            this.setState({listingsCategory: 'All Listings'});
            this.getListings(0, 10);
        } else {
            this.setState({listingsCategory: value});
            this.categorySearch(value);
        }
    }

    categorySearch = (category) => {

        fetch(url.concat("/searchbycategory"), {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "session_id": JSON.parse(localStorage.getItem('session_id')),
                "category": category
                })
            })
            .then(response => 
                response.json())
            .then((parsed) => {
                localStorage.setItem('listings', JSON.stringify(parsed.listings))
                console.log(parsed);
                this.setState({ listings: JSON.parse(localStorage.getItem('listings'))});
            })
            .catch(err => {
            console.error(err);
            });
    }

    generateItemBoxes = () => {
        let listings = JSON.parse(localStorage.getItem('listings'))
        if(listings) {
            return listings.map(item => 
                <ItemBox item={item} />
            )
        }
        return [];
    }

    render() {

        let user = JSON.parse(localStorage.getItem('email'));
        let uid = JSON.parse(localStorage.getItem('uid'));
        let session = JSON.parse(localStorage.getItem('session_id'));

        const itemBoxes = this.generateItemBoxes();

        return (
            <Fragment>
                <NavBar />
                <div className="page-content-container">
                    {/* <Header as='h4'>
                            {session}
                        </Header> */}
                    <Divider horizontal>
                        <Header as='h4'>
                            <span>
                                <Icon name='hotjar' />
                                Recommendations by {' '}
                                <Dropdown
                                    inline
                                    name='recDropdown'
                                    header='Get recommendations by'
                                    options={recDropdowOptions}
                                    defaultValue={recDropdowOptions[0].value}
                                    onChange={this.handleRecsChange}
                                />
                            </span>
                        </Header>
                    </Divider>
                    <Container>
                        <Segment  clearing raised>
                            <Grid columns='equal'>
                                <Grid.Row stretched>
                                    {this.state.recommendations.length === 5 ?
                                        <Fragment>
                                            <Grid.Column>
                                                <ItemCard recType={this.state.recDropdown} item={this.state.recommendations[0]} />
                                            </Grid.Column>
                                            <Grid.Column >
                                                <ItemCard recType={this.state.recDropdown} item={this.state.recommendations[1]} />
                                            </Grid.Column>
                                            <Grid.Column >
                                                <ItemCard recType={this.state.recDropdown} item={this.state.recommendations[2]} />
                                            </Grid.Column>
                                            <Grid.Column >
                                                <ItemCard recType={this.state.recDropdown} item={this.state.recommendations[3]} />
                                            </Grid.Column>
                                            <Grid.Column >
                                                <ItemCard recType={this.state.recDropdown} item={this.state.recommendations[4]} />
                                            </Grid.Column>
                                        </Fragment>
                                        :
                                        <Container>
                                            <Header as='h4' textAlign='center'>It doesn't look like you have any recommendations of this kind</Header>
                                            <Header as='h5' textAlign='center'>Try switching to the other recommendations filter</Header>
                                        </Container>
                                    }
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Container>
                    <Divider horizontal>
                        <Header as='h4'>
                            <span>
                                <Icon name='bolt' />
                                {' '}
                                <Dropdown
                                    scrolling
                                    inline
                                    name='listings-dropdown'
                                    header='Get Listings By'
                                    options={categories}
                                    defaultValue={categories[0].value}
                                    onChange={this.handleListingsChange}
                                />
                            </span>
                        </Header>
                    </Divider>

                    <Container>
                        {this.state.listingsCategory === "All Listings" ?
                        <Fragment>
                            {itemBoxes}
                            <Grid>
                                <Grid.Row width={16}>
                                    <Grid.Column width={10} />
                                    <Grid.Column width={6}>
                                        <Pagination 
                                            activePage={this.state.activePage}
                                            onPageChange={this.handlePageChange}
                                            boundaryRange={0}
                                            totalPages={50}
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Fragment>
                        :
                        itemBoxes
                        }
                    </Container>
                    {/* <Container color='black' textAlign='center' >
                        <Grid>
                            <Grid.Row width={16}>
                                <Grid.Column width={10} />
                                <Grid.Column width={6}>
                                    <Pagination 
                                        activePage={this.state.activePage}
                                        onPageChange={this.handlePageChange}
                                        boundaryRange={0}
                                        totalPages={10}
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container> */}
                </div>
            </Fragment>
        )
    }

}