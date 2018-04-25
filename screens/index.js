/**
 * Buckup Mobile App
 *
 * @mschwab
 */

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Button,
  //   Navigator,
  PermissionsAndroid
} from "react-native";

import SplashScreen from "rn-splash-screen";
import Navigator from "react-native-deprecated-custom-components";

import { StackNavigator } from "react-navigation";

// const App = StackNavigator({
//   Home: { screen: Home },
//   Transactions: { screen: Transactions }
// });

import Home from "./Home";
// import Scan from "./pages/scan";
// import Inquiry from "./pages/inquiry";
// import Validate from "./pages/validate";
import Transactions from "./Transactions";

const Navigation = StackNavigator({
  Home: { screen: Home },
  Transactions: { screen: Transactions }
});

// import 
//getVolume,
//   setVolume,
//   getMaxVolume,
//   onVolumeChange
// "react-native-volume";

// export default class buckupmobileapp extends Component {
class buckupmobileapp extends Component {
  constructor(props) {
    super(props);

    this.state = {page: "Home", camera: 0, top: Dimensions.get("window").height};

    // this.navigationRenderScene = this.navigationRenderScene.bind(this);
    // this.navigate = this.navigate.bind(this);

    // Get the maximum value for the media stream
    // const maxVolume = getMaxVolume();
    // setVolume(maxVolume);
    // onVolumeChange(volume => setVolume(maxVolume));
  }

  componentDidMount() {
    // SplashScreen.hide();
    requestCameraPermission();
  }

  render() {
    return <View style={{ flex: 1 }}>
        <Text>HERE</Text>
        {/* {this.navigationRenderScene.bind(this)} */}
        
        <Home navigation={this.props.navigation} />


        {/* <Transactions navigation={this.props.navigation} /> */}
        {/* <Navigator
          initialRoute={{ id: "Home" }}
          renderScene={this.navigationRenderScene}
          ref="navigator"
        /> */}
      </View>;
  }

//   _setNavigatorRef(navigator) {
//     this.navigator = navigator;
//   }

//   navigate(id) {
//     if (id === "Home") {
//       this.refs.navigator.popToTop();
//     } else {
//       this.refs.navigator.push({
//         id: id
//       });
//     }
//   }

//   navigationRenderScene(route, navigator) {
//     this.page = route.id;

//     switch (route.id) {
//         case "Home":        
//         // return <Home navigator={navigator} />;
//         return <Home navigation={this.props.navigation} />;

//       case "Scan":
//         return <Scan navigator={navigator} />;
//       case "Inquiry":
//         return <Inquiry navigator={navigator} event={route.event} />;
//       case "Validate":
//         return (
//           <Validate
//             navigator={navigator}
//             data={route.data}
//             event={route.event}
//           />
//         );
//       case "Transactions":
//         return <Transactions navigator={navigator} />;
//     }
//   }

}

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      requestCameraPermission();
    }
  } catch (err) {
    console.warn(err);
  }
}

const styles = StyleSheet.create({});

export default Navigation;

// AppRegistry.registerComponent('buckupmobileapp', () => buckupmobileapp);
