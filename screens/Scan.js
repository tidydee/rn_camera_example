/**
 * Buckup Mobile App
 *
 * @mschwab
 * PortedOver by dspamer
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableOpacity
} from "react-native";
import Camera from "react-native-camera";
const util = require("util");

export default class Scan extends Component {
  constructor(props) {
    super(props);

    this.state = { camera: 0, flash: Camera.constants.TorchMode.off };

    this.navigate = this.navigate.bind(this);
    this._onBarCodeRead = this._onBarCodeRead.bind(this);
    this.toggleFlash = this.toggleFlash.bind(this);
  }

  _onBarCodeRead(e) {
    if (this.state.camera === 0) {
      this.navigate("Inquiry", e);
    }
  }

  toggleFlash() {
    let state = Object.assign({}, this.state);

    if (state.flash === Camera.constants.TorchMode.off) {
      state.flash = Camera.constants.TorchMode.on;
    } else {
      state.flash = Camera.constants.TorchMode.off;
    }

    this.setState(state);
  }

  render() {
    let { navigate } = this.props.navigation;
    if (this.state.camera === 1) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator
            size="large"
            animating={true}
            style={styles.spinner}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Camera
            onBarCodeRead={this._onBarCodeRead}
            barCodeTypes={["pdf417"]}
            keepAwake={true}
            captureQuality="low"
            type="back"
            aspect="fill"
            style={styles.camera}
            torchMode={this.state.flash}
          />
          
          <TouchableOpacity style={styles.flash} onPress={this.toggleFlash}>
            {this.state.flash === Camera.constants.TorchMode.off && (
              <Image source={require("../img/flash-off.png")} />
            )}
            {this.state.flash === Camera.constants.TorchMode.on && (
              <Image source={require("../img/flash-on.png")} />
            )}
          </TouchableOpacity>
          
          <Text style={styles.focusMsg}>Tap on barcode to focus</Text>
          
          <TouchableOpacity
            onPress={() => {
            //   this.navigate("Home");
              navigate("Home");
            }}
            activeOpacity={0.8}
            style={styles.back}
          >
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  navigate(id, event) {
    this.setState({ camera: 1 });

    if (!event) {
      event = null;
    }

    this.props.navigator.push({
      id: id,
      event: event
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  center: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  spinner: {},
  camera: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  back: {
    flex: 0,
    backgroundColor: "#41b6e6",
    padding: 7
  },
  backText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700"
  },
  flash: {
    position: "absolute",
    top: 15,
    left: 15
  },
  focusMsg: {
    position: "absolute",
    top: 15,
    right: 15,
    textAlign: "right",
    color: "#ffffff",
    fontSize: 16
  }
});
