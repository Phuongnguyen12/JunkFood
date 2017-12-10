import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  StyleSheet, Text, View, ScrollView, Image,
  AppState, TouchableOpacity, DeviceEventEmitter
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';
import { ImagePicker, Constants, Permissions } from 'expo';
import * as itemActions from '../actions/items';

class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Items',
      headerTitleStyle : {textAlign: 'center',alignSelf:'center'},
      headerStyle:{
          backgroundColor:'white',
      },
  });

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
    let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.listDevice && result.status === 'granted') {
      console.log('Notification permissions granted.');
    }
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
          navigate('Form', { title: 'New Item', photo: result });
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
          navigate('Form', { title: 'New Item', photo: result });
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
        {
          items.filter((x) => {
            return moment(x.date, "YYYY-MM-DD").startOf('day') >= moment().startOf('day');
          }).map((item) => {
            return (
              <View key={item.id} style={styles.cardview}>
                <Image
                  style={{width:200,height:200,margin:5}}
                  source={{uri: item.image}}
                />
                <Text style={{fontSize:24, color:'rgba(77,77,77,1)', paddingLeft:20}}>{item.date}</Text>
              </View>
            );
          })
        }
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

function mapDispatchToProps(dispatch) {
  return {
    itemActions: bindActionCreators(itemActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
