import React, { Component, Fragment } from 'react';
import { Header, Container } from 'semantic-ui-react';
import NavBar from '../components/NavBar';
import '../styles/General.css'
import ItemBox from '../components/ItemBox';
import configData from "../config.json"
const url = configData['SERVER_URL']

export default class Favorites extends Component {

    constructor(props) {
        super(props);
        this.state = {
            favorites: []
        }
        this.getFavorites = this.getFavorites.bind(this);
        this.updateFavorites = this.updateFavorites.bind(this);
        this.getFavorites();
    }

    componentDidUpdate() {
        this.getFavorites();
    }

    getFavorites = async () => {

        let args = {
            "session_id": JSON.parse(localStorage.getItem('session_id'))
        };

        let response = {}

        await fetch(url+"/getfavorites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(args)
        })
        .then(res => res.json())
        .then((parsed) => {
            // console.log("Successfully got favorites: ", parsed);
            if(parsed.success) {
                this.setState({ favorites: parsed.favorites })
                localStorage.setItem('favorites', JSON.stringify(this.state.favorites)); // add favorites to storage so we can manipulate and display favorites
                // console.log(localStorage);
            }
            // response = parsed;
        })
        .catch(err => {
            console.error("Failed to get favorites: ", err);
        })

    }

    updateFavorites = () => {
        this.getFavorites();
    }


    render() {

        // this.getFavorites();

        const favorites = this.state.favorites.map(item => <ItemBox onRemoveFromFavorites={this.updateFavorites} item={item} />);

        return (
            <Fragment>
                <NavBar />
                
                <div className="page-content-container">
                    <Header>Favorites</Header>
                </div>
                <Container>
                    {favorites}
                </Container>
            </Fragment>
        )
    }
}