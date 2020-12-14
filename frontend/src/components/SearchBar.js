import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { Search, Dropdown, Header, Input } from 'semantic-ui-react';
import '../styles/SearchBar.css';
import configData from "../config.json"
const url = configData['SERVER_URL']

const searchDropdowOptions = [
    {
        key: 'keyword',
        text: 'keyword',
        value: 'keyword',
        content: 'Keyword',
      },
      {
        key: 'category',
        text: 'category',
        value: 'category',
        content: 'Category',
      }
]

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

// Search Bar component that will live in the NavBar

export default class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchInput: '',
            dropdown: 'keyword',
            category: 'Other',
            redirect: false,
            showHideSearch: true,
            showHideDrop: false
        }
        // this.handleSearch = this.handleSearch.bind(this)
        // this.categorySearch = this.categorySearch.bind(this)
        this.keywordSearch = this.keywordSearch.bind(this)
        this.handleKey = this.handleKey.bind(this)
        // this.handleChange = this.handleChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        // this.handleCategoryChange = this.handleCategoryChange.bind(this)
        // this.hideComponent = this.hideComponent.bind(this)
    }

    
    // // search handler
    // handleSearch = () => {
    //         this.keywordSearch()
    // }

    keywordSearch = () => {
        console.log(this.state.searchInput)
        fetch(url+"/searchbystring", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "session_id" : JSON.parse(localStorage.getItem('session_id')),
                "term": this.state.searchInput
                })
            })
            .then(response => 
                response.json())
            .then((parsed) => {
                localStorage.setItem('listings', JSON.stringify(parsed.listings))
                console.log(parsed);
                if(localStorage.getItem('page')==='SearchResults'){
                    window.location.reload(false);
                }
                else{
                    this.setState({ redirect: true });
                }
            })
            .catch(err => {
            console.error(err);
            });

    }

    // categorySearch = () => {
    //     fetch(url+"/searchbycategory", {
    //         "method": "POST",
    //         "headers": {
    //             "Content-Type": "application/json"
    //         },
    //         "body": JSON.stringify({
    //             "session_id": JSON.parse(localStorage.getItem('session_id')),
    //             "category": this.state.category
    //             })
    //         })
    //         .then(response => 
    //             response.json())
    //         .then((parsed) => {
    //             localStorage.setItem('listings', JSON.stringify(parsed.listings))
    //             console.log(parsed);
    //             if(localStorage.getItem('page')==='SearchResults'){
    //                 window.location.reload(false);
    //             }
    //             else{
    //                 this.setState({ redirect: true });
    //             }
    //         })
    //         .catch(err => {
    //         console.error(err);
    //         });

    // }

    // handleChange = (e, {value}) => {
    //     this.setState({dropdown: value});
    //     this.hideComponent('showHideSearch')
    //     this.hideComponent('showHideDrop')
    // }

    // handleCategoryChange = (e, {value}) => {
    //     console.log(value)
    //     this.setState({category: value}, () => 
    //     this.categorySearch());      
    // }

    // call search handler if enter key is pressed
    handleKey = (event) => {
        if(event.key === "Enter") {
            console.log("KEY PRESSED")
            this.keywordSearch();
        }
    }

    handleInputChange = (event) => {
        console.log(event.target.value)
        this.setState({
            searchInput: event.target.value
        })
       }

    hideComponent(name) {
        switch (name) {
            case "showHideSearch":
                this.setState({ showHideSearch: !this.state.showHideSearch });
                break;
            case "showHideDrop":
                this.setState({ showHideDrop: !this.state.showHideDrop });
                break;
        }
    }

    render() {
        if (this.state.redirect && localStorage.getItem('page')==='Home') {
            return (<Redirect push to="/searchresults"/>)
        }
        
        return(
            <Fragment>
                {this.state.showHideSearch && (<Input
                    icon='search'
                    name ='showHideSearch'
                    iconPosition='left'
                    placeholder='Search...'
                    type = 'text'
                    ref = {input => this.search = input} 
                    onChange={this.handleInputChange}
                    onKeyDown={this.handleKey}
                />)}
                {/* {this.state.showHideDrop && (
                     <Dropdown 
                        icon='search'
                        name='showHideDrop'
                        scrolling
                        button 
                        basic 
                        floating 
                        value={this.state.category}
                        onChange={this.handleCategoryChange}
                        options={categories} 
                />)} */}
                {/* <Dropdown 
                    name='search'
                    button 
                    basic 
                    floating 
                    value={this.state.dropdown}
                    onChange={this.handleChange}
                    options={searchDropdowOptions} 
                    /> */}
            </Fragment>
            
        );
    }
}