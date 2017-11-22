import React from 'react';
import { connect } from 'react-redux';


import HomeScreen from './containers/HomeScreen';
import FormScreen from './containers/FormScreen';
import { StackNavigator } from 'react-navigation';

class MyApp extends React.Component {
    render() {

        const MainNavigator = StackNavigator({
            Home: { screen: HomeScreen },
            Form: { screen: FormScreen }
        });
        
        return (
            <MainNavigator />
        );
    }
}

const mapStateToProps = function(state) {
    // const { user, profile } = state;
    return {
        // isRegistered: user.isRegistered,
        // isAuthenticated: user.isAuthenticated,
        //profileUpdateSuccess: profile.updateSuccess,
    }
};

export default connect(mapStateToProps)(MyApp);