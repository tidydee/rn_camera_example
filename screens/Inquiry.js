/**
 * Buckup Mobile App
 *
 * @mschwab
 * PortedOver by dspamer
 */

import React, { Component } from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
//DeviceInfo causes issues with React-Native-Camera
// import DeviceInfo from "react-native-device-info";
import Sound from "react-native-sound";

export default class Home extends Component {
  constructor(props) {
    super(props);

    let { navigate } = this.props.navigation;
    let { params } = this.props.navigation.state;

    this.navigate = this.navigate.bind(this);

    let data = [];

    console.log("params = " + JSON.stringify(params));
    console.log("params.event.data = " + JSON.stringify(params.event.data));
    // console.log("new Date().toISOString() + DeviceInfo.getUniqueID() = " + JSON.stringify(new Date().toISOString() + DeviceInfo.getUniqueID()));
    
    // console.log("DeviceInfo = " + JSON.stringify(DeviceInfo.getUniqueID() ));
    
    //Currently breaking here!!!

    data.controlNumber = params.event.data;
    data.transactionId = new Date().toISOString() + "358023070686357";
    data.deviceInfo1 = "358023070686357";
    data.sysId = 1141;
    data.jurisdiction = "BC";

    ////////////////////////////
    // data.controlNumber = params.event.data;
    // data.transactionId = new Date().toISOString() + DeviceInfo.getUniqueID();
    //creating my own DeviceId due to packe conflict - April 27, 2018 - Adding device IMEI
    ///////////////////////////
    // data.transactionId = new Date().toISOString() + "358023070686357";
    ///////////////////////////
    // data.deviceInfo1 = DeviceInfo.getUniqueID();
    //creating my own DeviceId due to packe conflict - April 27, 2018 - Adding device IMEI
    ///////////////////////////
    // data.deviceInfo1 = "358023070686357";
    // data.sysId = 1141;
    // data.jurisdiction = "BC";

    this.state = { error: false, errorMsg: null, result: null, data: data };

    this.get(data);

    this.win = new Sound("win.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
    });
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <View style={styles.inner}>
            <View style={[styles.buttons]}>
              <Text style={[styles.h1]}>Error!</Text>
              <Text style={[styles.p]}>{this.state.errorMsg}</Text>
              <Button
                onPress={() => {
                  this.navigate("Home");
                }}
                title="Back"
                color="#41b6e6"
                accessibilityLabel="Back to main page"
              />
            </View>
          </View>
        </View>
      );
    } else if (this.state.result) {
      return (
        <View style={styles.container}>
          <View style={styles.inner}>
            <Text style={[styles.h1]}>Results</Text>
            <Text style={[styles.p]}>
              Basket Size: ${this.state.result.basketSize}
            </Text>
            {this.state.result.prize > 0 ? (
              <Text style={[styles.p]}>Prize: ${this.state.result.prize}</Text>
            ) : (
              <Text style={[styles.p, styles.alreadyValidated]}>
                Not a winner
              </Text>
            )}
            {this.state.result.validated && (
              <Text style={[styles.alreadyValidated, styles.p]}>
                Already validated
              </Text>
            )}
            {!this.state.result.validated &&
              this.state.result.prize > 0 && (
                <Text style={[styles.winner, styles.p]}>Not validated</Text>
              )}
            {!this.state.result.validated && this.state.result.prize > 0 ? (
              <View style={styles.row}>
                <Button
                  onPress={() => {
                    this.navigate("Validate", {
                      controlNumber: this.state.data.controlNumber,
                      prize: this.state.result.prize
                    });
                  }}
                  title="Validate Ticket"
                  color="#41b6e6"
                  accessibilityLabel="Validate a Buckup ticket"
                  style={[styles.p]}
                />
                <Button
                  onPress={() => {
                    this.navigate("Home");
                  }}
                  title="Back"
                  color="#41b6e6"
                  accessibilityLabel="Back to main page"
                />
              </View>
            ) : (
              <Button
                onPress={() => {
                  this.navigate("Home");
                }}
                title="Back"
                color="#41b6e6"
                accessibilityLabel="Back to main page"
              />
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View style={[styles.buttons]}>
            <Text>Loading</Text>
          </View>
        </View>
      );
    }
  }

  navigate(id, data) {
    if (!data) {
      data = null;
    }

    this.props.navigator.push({
      id: id,
      data: data
    });
  }

  get(data) {
    let url =
      "https://api.bclc.com/prod/v1/buckup/inquiry/?controlNumber=" +
      data.controlNumber +
      "&sysId=" +
      data.sysId +
      "&jurisdiction=" +
      data.jurisdiction +
      "&transactionId=" +
      data.transactionId +
      "&deviceInfo1=" +
      data.deviceInfo1;
    
      console.log(url);

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        api_key: "BCLCProductionBuckup01"
      }
    })
      .then(response => {
        console.log("-------------------------------------------");
        console.log(response);

        //API disconnected. Currently getting back <h1>596 Service Not Found</h1>
        //Expecting JSON - Either code a catch fo rhtis or wiat till API is live again.
        let responseJson = JSON.parse(response._bodyText);
        if (response.status >= 200 && response.status < 300) {
          if (
            responseJson.validated === false &&
            Number(responseJson.prize) > 0
          ) {
            this.win.play();
          }

          this.state.result = responseJson;
          this.setState(this.state);
        } else {
          
          this.state.error = true;
          if (responseJson.statusText) {
            this.state.errorMsg = responseJson.statusText;
          } else {
            if (response.status === 404) {
              this.state.errorMsg = "Could not find ticket.";
            } else if (response.status === 500) {
              this.state.errorMsg = "API error.";
            } else {
              this.state.errorMsg = response.status;
            }
          }
          this.setState(this.state);
        }
        console.log("-------------------------------------------");
      })
      .catch(error => {
        console.error(error);
        this.state.error = true;
        this.state.errorMsg = "Error connecting to API.";
        this.setState(this.state);
      });
  }
}

let { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#F5FCFF"
  },
  inner: {
    width: width > 480 ? 400 : "100%"
  },
  alreadyValidated: {
    color: "red"
  },
  winner: {
    color: "green"
  },
  h1: {
    fontSize: 36
  },
  p: {
    fontSize: 20,
    marginBottom: 8
  },
  row: { flexDirection: "row", justifyContent: "space-between" }
});
