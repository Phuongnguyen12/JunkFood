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
          <View style={styles.cardview}>
            <Image
              style={{width:200,height:200,margin:5}}
              source={{uri: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?auto=format&fit=crop&w=1225&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D'}}
            />
              <Text style={{fontSize:24, color:'rgba(77,77,77,1)', paddingLeft:20}}>15/12/2017</Text>
          </View>
          <View style={styles.cardview}>
            <Image
              style={{width:200,height:200,margin:5}}
              source={{uri: 'https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=675&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D'}}
            />
              <Text style={{fontSize:24, color:'rgba(77,77,77,1)', paddingLeft:20}}>18/12/2017</Text>
          </View>
          <View style={styles.cardview}>
            <Image
              style={{width:200,height:200,margin:5}}
              source={{uri: 'https://images.unsplash.com/photo-1485921198582-a55119c97421?auto=format&fit=crop&w=700&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D'}}
            />
              <Text style={{fontSize:24, color:'rgba(77,77,77,1)', paddingLeft:20}}>30/12/2017</Text>
          </View>
          <View style={styles.cardview}>
            <Image
              style={{width:200,height:200,margin:5}}
              source={{uri: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=1350&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D'}}
            />
              <Text style={{fontSize:24, color:'rgba(77,77,77,1)', paddingLeft:20}}>31/12/2017</Text>
          </View>
        </ScrollView>
        {/* TODO style the below component as a button for taking picture */}



        <View style={{height: 80, backgroundColor: 'steelblue'}}>
          <TouchableOpacity
            style={styles.inputContainer1}
            onPress={this._onUploadButton}
          >
            <Text style={{fontSize:18, color:'rgba(77,77,77,1)', textAlign:'left', paddingLeft:10}}>Tap to add an item</Text>
            <Image style={{width:30, height:28, position:'absolute', right:12}} source={require('../assets/camera_icon.png')} />
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
    height: 60,
    borderRadius: 30,
    margin: 10,
    //marginLeft: 10,
    //marginRight: 10,
  },
    cardview: {
      flex: 1,
        flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        backgroundColor: '#fff',
        borderRadius:6,
    },
});


function mapStateToProps(state) {
  const { items } = state;

  return {
    items
  }
}

export default connect(mapStateToProps, {
  createItem,
  deleteItem
})(HomeScreen);