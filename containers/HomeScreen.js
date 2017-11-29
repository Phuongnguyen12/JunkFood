import React from 'react';
import { connect } from 'react-redux';
import { 
  StyleSheet, Text, View, ScrollView, Image,
  AppState, TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { ImagePicker } from 'expo';
import {
  createItem, deleteItem
} from '../actions/items';

class HomeScreen extends React.Component {

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

  _onUploadButton = () => {
    this.ActionSheet.show();
  }

  _handlePress = (i) => {
    if(i==0) { // pick image from gallery
      this._pickImage().then((result) => {
        if(!result.cancelled && result.uri) {
          // image is stored in result.uri
          const { navigate } = this.props.navigation;
          navigate('Form');
        }
      }).catch(err => {
        console.log(err);
      });
    }
    else if(i==1) { // image just taken
      this._takePhoto().then((result) => {
        if(!result.cancelled && result.uri) {
          // image is stored in result.uri
          const { navigate } = this.props.navigation;
          navigate('Form');
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }

  _takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    console.log(result);

    return result;
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
    });

    console.log(result);

    return result;
  };

  render() {
    const options = [ 'Choose a photo', 'Take a photo', 'Cancel' ];
    const CANCEL_INDEX = 2;
    const { items } = this.props;

    return (
      <View style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <ScrollView>
          {/* TODO will need to modify the item inside the ScrollView to set the correct style */}
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Image
              style={{width:200,height:200}}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
            <Text> Hello world! </Text>
          </View>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Image
              style={{width:200,height:200}}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
            <Text> Hello world! </Text>
          </View>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Image
              style={{width:200,height:200}}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
            <Text> Hello world! </Text>
          </View>
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Image
              style={{width:200,height:200}}
              source={{uri: 'https://facebook.github.io/react/img/logo_og.png'}}
            />
            <Text> Hello world! </Text>
          </View>
        </ScrollView>
        {/* TODO style the below component as a button for taking picture */}
        <View style={{height: 50, backgroundColor: 'steelblue'}}>
          <TouchableOpacity
            style={styles.inputContainer1}
            onPress={this._onUploadButton}
          >
            <Text style={{fontSize:16, color:'rgba(77,77,77,1)', textAlign:'left'}}>Take picture</Text>
            <Image style={{width:30, height:28, position:'absolute', right:14}} source={require('../assets/camera_icon.png')} />
          </TouchableOpacity>
          <ActionSheet
            ref={o => this.ActionSheet = o}
            options={options}
            cancelButtonIndex={CANCEL_INDEX}
            onPress={this._handlePress}
          />
        </View>
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
  inputContainer1: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    height: 64,
    borderRadius: 9,
    marginLeft: 10,
    marginRight: 10,
  },
});

function mapStateToProps(state) {
  const { items } = state;

  return {
    items
  }
};

export default connect(mapStateToProps, {
  createItem,
  deleteItem
})(HomeScreen);