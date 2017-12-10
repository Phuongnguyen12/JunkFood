import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  StyleSheet, Text, View, ScrollView, Image,
  AppState, TouchableOpacity, DeviceEventEmitter,
  Keyboard, TouchableWithoutFeedback, Dimensions, TextInput
} from 'react-native';
import { Notifications } from ‘expo’;
import { DatePickerDialog } from 'react-native-datepicker-dialog'
import moment from 'moment';
import * as itemActions from '../actions/items';

const localNotification = {
  title: '',
  body: '', // (string) — body text of the notification.
  ios: { // (optional) (object) — notification configuration specific to iOS.
    sound: true // (optional) (boolean) — if true, play a sound. Default: false.
  },
  android: {// (optional) (object) — notification configuration specific to Android.
    sound: true, // (optional) (boolean) — if true, play a sound. Default: false.
    //icon (optional) (string) — URL of icon to display in notification drawer.
    //color (optional) (string) — color of the notification icon in notification drawer.
    priority: 'high', // (optional) (min | low | high | max) — android may present notifications according to the priority, for example a high priority notification will likely to be shown as a heads-up notification.
    sticky: false, // (optional) (boolean) — if true, the notification will be sticky and not dismissable by user. The notification must be programmatically dismissed. Default: false.
    vibrate: true // (optional) (boolean or array) — if true, vibrate the device. An array can be supplied to specify the vibration pattern, e.g. - [ 0, 500 ].
    // link (optional) (string) — external link to open when notification is selected.
  }
};

var { height, width } = Dimensions.get('window');

class FormScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'New Item',
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
      appState: AppState.currentState,
      name: '',
      date: '',
      dateHolder: null
    };

    this._datePickerCall = this._datePickerCall.bind(this);
    this._onDatePicked = this._onDatePicked.bind(this);
    this._onSaveButton = this._onSaveButton.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  // }

  componentWillMount() {
    DeviceEventEmitter.addListener('goBackListener', (e)=>{
      console.log('event listener');
      // do something when going back to this screen from another screen
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
  };

  _onBackButton = () => {
    this.props.navigation.goBack();
  };

  _datePickerCall = () => {

    let DateHolder = this.state.DateHolder;

    if(!DateHolder || DateHolder == null){

      DateHolder = new Date();
      this.setState({
        DateHolder: DateHolder
      });
    }

    //To open the dialog
    this.refs.datePickerDialog.open({

      date: DateHolder,

    });
  };

  _onDatePicked = (date) => {
    this.setState({
      date: moment(date).format('YYYY-MM-DD')
    });
  };

  _onSaveButton = () => {
    const { itemActions } = this.props;
    const { name, date } = this.state;
    const { navigate } = this.props.navigation;
    const { photo } = this.props.navigation.state.params;

    itemActions.createItem({
      name,
      date,
      image: photo.uri
    }).then(() => {
      let t = moment(date, "YYYY-MM-DD");
      let now = moment();
      t = t.subtract(2, "days");
      if (t < now) { t = now; }
      const schedulingOptions = {
        time: t, // (date or number) — A Date object representing when to fire the notification or a number in Unix epoch time. Example: (new Date()).getTime() + 1000 is one second from now.
        repeat: false
      };
      const noti = Object.assign({}, localNotification, {
        title: name,
        body: 'Expiring soon'
      });
      Notifications.scheduleLocalNotificationAsync(noti, schedulingOptions);
    });

    this.props.navigation.goBack();
  };

  render() {
    const { date, name } = this.state;
    const { photo } = this.props.navigation.state.params;
    return (
      <ScrollView>
        <View style={styles.contentContainer}>

          <Image
            style={styles.imageHolder}
            source={{ uri: photo.uri }}>
          </Image>

          <View style={{ backgroundColor:'white', borderRadius:9, flexDirection:'column', marginLeft:10, marginRight:10, height: 154, marginBottom:10, paddingLeft:2}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.inputContainer}>
                <Text style={{color:'black', fontSize:16, fontWeight:'300'}}>Name:</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType='default'
                  onChangeText={(name) => this.setState({name})}
                  value={name}
                  underlineColorAndroid='rgba(0,0,0,0)'
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={[styles.inputContainer, { borderBottomWidth: 0 }]}>
                <Text style={{color:'black', fontSize:16, fontWeight:'300'}}>Expiry date:</Text>
                <Text style={styles.textInput} onPress={this._datePickerCall}>{date}</Text>
              </View>
            </TouchableWithoutFeedback>
            {/* Place the dialog component at end of your views and assign the references, event handlers to it.*/}
            <DatePickerDialog ref="datePickerDialog" onDatePicked={this._onDatePicked} />
          </View>

          <View style={{flex:1, alignItems:'center', marginTop:15,}}>
            <TouchableOpacity style={styles.button1} onPress={this._onSaveButton}>
              <Text style={{fontSize:20, fontWeight:'bold',color:'white', backgroundColor:'#158ACB'}}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 30,
  },

  title: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },

  imageHolder: {
    width: width-20,
    margin: 10,
    height: 220,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },

  inputContainer: {
    width: width-20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)',
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

  textInput: {
    flex: 1,
    height: 50,
    marginLeft: 30,
    fontSize: (width>320) ? 15 : 12
  },

  closeButton: {
    position:'absolute',
    left: 20,
    padding: 5,
  },

  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#158ACB',
    width: 240,
    height: 60,
    borderRadius: 100,
    zIndex: 100,
  },
});

function mapStateToProps(state) {
  // const { items } = state;

  return {};
};

function mapDispatchToProps(dispatch) {
  return {
    itemActions: bindActionCreators(itemActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormScreen);
