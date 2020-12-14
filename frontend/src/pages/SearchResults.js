import React, { Component, Fragment, useEffect } from 'react';
import { Header, Container, Divider, Pagination, Grid, Icon, Segment, Button, Dropdown } from 'semantic-ui-react';
import NavBar from '../components/NavBar';
import '../styles/General.css'
import ItemBox from '../components/ItemBox';
import ItemCard from '../components/ItemCard';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


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



export default class SearchResults extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listings: [],
            recommendations: [],
            activePage: 1,
            recDropdown: 'major'
        }
        this.handleChange = this.handleChange.bind(this);
        localStorage.setItem('page','SearchResults')
    }

    handleChange = (e, {name, value}) => {
        let newState = this.state;
        newState[name] = value;
        this.setState(newState);
    }
 

    render() {

        let user = JSON.parse(localStorage.getItem('email'));
        let uid = JSON.parse(localStorage.getItem('uid'));
        let session = JSON.parse(localStorage.getItem('session_id'));


        // console.log(this.state.listings)
        // console.log(JSON.parse(localStorage.getItem('listings')))
        // let listings = JSON.parse(localStorage.getItem('listings')) ? JSON.parse(localStorage.getItem('listings')) : this.state.listings;
        let local = JSON.parse(localStorage.getItem('listings')) 
        let listings = []
        if(local.length>0){
            listings = local;
        }
    
        return (
            <Fragment>
                <NavBar />
                <Container className="page-content-container">
                {listings.length?
                    <Container className='search-results-container'>
                        <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='search' />
                                    Search Results
                                </Header>
                            </Divider>

                            <Container>
                            {listings.map(item => <ItemBox item={item} /> )}
                            </Container>
                    </Container>
                    :
                    <Segment className='no-search-results-container' clearing raised>
                        <Container color='black' textAlign='center'>
                            <Header as="h3">It doesn't look like there are any search results</Header>
                        </Container>
                        <Divider />
                        <Container color='black' textAlign='center'>
                            <Header as="h4">Try another keyword or category, or go back to the main listings page</Header>
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