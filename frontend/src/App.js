import React, { Component } from 'react';
import './styles/App.css';
import { Container } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import SignUp from './pages/Account/SignUp';
import Login from './pages/Account/Login';
import Start from './pages/Account/Start';
import CreateListing from './pages/CreateListing';
import ResetPassword from './pages/Account/ResetPassword';
import { PrivateRoute } from './components/PrivateRoute';
import EditProfile from './pages/Account/EditProfile';
import PurchaseHistory from './pages/PurchaseHistory';
import SearchResults from './pages/SearchResults';
import SellerPage from './pages/SellerPage';
import PurchaseSuccess from './pages/PurchaseSuccess';

export default class App extends Component {

  constructor(props) {
    super(props);

  }

  render() {

    return (
      <main>
        <Container>
          <Route exact path="/" component={Start} />
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="/resetpswd" component={ResetPassword} />
          <PrivateRoute path="/home" component={Home} />
          <PrivateRoute path="/favorites" component={Favorites} />
          <PrivateRoute path="/createlisting" component={CreateListing} />
          <PrivateRoute path="/editprofile" component={EditProfile} />
          <PrivateRoute path="/purchasehistory" component={PurchaseHistory} />
          <PrivateRoute path="/searchresults" component={SearchResults} />
          <PrivateRoute path="/sellerpage" component={SellerPage} />
          <PrivateRoute path="/purchasesuccess" component={PurchaseSuccess} />
        </Container>
        
      </main>
    );
  }
}

