import React from 'react';
import { connect } from 'react-redux';
import { 
  StyleSheet, Text, View, ScrollView, Image,
  AppState, TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import {
  createItem, deleteItem
} from '../actions/items';

class FormScreen extends React.Component {

  constructor(props) {
    // init starting state of this screen
    super(props);

    this.state = {
      refreshing: false,
      appState: AppState.currentState
    };
  }

  // componentWillReceiveProps(nextProps) {
  // }

  componentWillMount() {
    DeviceEventEmitter.addListener('goBackListener', (e)=>{
      console.log('event listener');
      // do tsomething when going back to this screen from another screen
    })
  }

  // shouldComponentUpdate() {
  //   return true;
  // }

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    // Remove the alert located on this master page from the manager
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // refresh the app data if neccessary
      // this is for when bringing the app from background
      console.log('App has come to the foreground!')
    }
    this.setState({appState: nextAppState});
  }

  _onBackButton = () => {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection:'row', justifyContent:'center'}}>
          <TouchableOpacity style={styles.closeButton} onPress={this._onBackButton}>
            <Image style={{width:11, height:18}} source={require('../assets/back-arrow.png')} />
          </TouchableOpacity>
          <Text style={styles.title}>New Item</Text>
        </View>

        {/* Add the form here to fill in title, description, and image */}
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  closeButton: {
    position:'absolute',
    left: 20,
    padding: 5,
  },
});

function mapStateToProps(state) {
  // const { items } = state;

  return {}
};

export default connect(mapStateToProps, {
  createItem,
  deleteItem
})(FormScreen);
