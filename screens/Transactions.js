/**
 * Buckup Mobile App
 *
 * @mschwab
 */

import React, { Component } from "react";
import { StyleSheet, Text, View, Button, ListView } from "react-native";
const util = require("util");

import DeviceInfo from "react-native-device-info";

export default class Home extends Component {
  static navigationOptions = {
    title: 'Transactions Screen'
  };

  constructor(props) {
    super(props);

    this.navigate = this.navigate.bind(this);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = { error: false, errorMsg: null, result: null };

    this.get();
  }

  render() {
    console.log("this.props.navigation.state = " + util.inspect(this.props.navigation.state, false, null));
    let { navigate } = this.props.navigation;
    let {params} = this.props.navigation.state;

    console.log(params.name + ", " + params.email);
    
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <View style={[styles.buttons]}>
            <Text style={[styles.h1]}>ERROR!</Text>
            <Text style={[styles.p]}>{this.state.errorMsg}</Text>
            <Button
              onPress={() => navigate("Home")
              }
              title="Back"
              color="#41b6e6"
              accessibilityLabel="Back to main page"
            />
          </View>
        </View>
      );
    } else if (this.state.result) {
      return (
        <View style={styles.container}>
          <View>
            <Text style={[styles.h1]}>Recent Transactions</Text>
            <ListView
              renderHeader={() => (
                <View style={styles.row}>
                  <Text style={[styles.col, styles.rowHeader]}>Time</Text>
                  <Text style={[styles.col, styles.rowHeader]}>Lane</Text>
                  <Text style={[styles.col, styles.rowHeader]}>Basket</Text>
                  <Text style={[styles.prize, styles.rowHeader]}>Prize</Text>
                </View>
              )}
              style={styles.list}
              dataSource={this.state.result}
              renderRow={rowData => (
                <View style={styles.row}>
                  <Text style={styles.col}>{rowData.date}</Text>
                  <Text style={styles.col}>{rowData.laneNumber}</Text>
                  <Text style={styles.col}>${rowData.basketSize}</Text>
                  {rowData.win === "true" ? (
                    <Text style={styles.prize}>${rowData.prize}</Text>
                  ) : (
                    <Text style={styles.prize}>Not a winner</Text>
                  )}
                </View>
              )}
            />
            <Button
              onPress={() => {
                this.navigate("Home");
              }}
              activeOpacity={0.8}
              color="#41b6e6"
              style={styles.back}
              title="Back"
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View>
            <Text style={[styles.center]}>Loading</Text>
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

  get() {
    let url = "https://api.bclc.com/prod/v1/buckup/lastTransactions/";

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        api_key: "BCLCProductionBuckup01"
      }
    })
      .then(response => {
        if (response.status === 200) {
          console.log(response);
          let responseJson = JSON.parse(response._bodyText);
          responseJson.forEach(function(item, index) {
            if (item.win === "true") {
              item.prize = parseFloat(
                Math.round(item.prize * 100) / 100
              ).toFixed(2);
            }
            item.basketSize = parseFloat(
              Math.round(item.basketSize * 100) / 100
            ).toFixed(2);
            let date = new Date(Date.parse(item.txTimestamp));

            let month = date.getMonth() + 1;
            if (month < 10) {
              month = "0" + month;
            }

            let day = date.getDate();
            if (day < 10) {
              day = "0" + day;
            }

            let hour = date.getHours();
            if (hour < 10) {
              hour = "0" + hour;
            }

            responseJson[index].date =
              month +
              "/" +
              day +
              " " +
              hour +
              ":" +
              (date.getMinutes() < 10 ? "0" : "") +
              date.getMinutes();
          });

          this.state.result = this.ds.cloneWithRows(responseJson);
          this.setState(this.state);
        } else {
          this.state.error = true;
          if (response.statusText) {
            this.state.errorMsg = response.statusText;
          } else {
            this.state.errorMsg = response.status;
          }
          this.setState(this.state);
        }
      })
      .catch(error => {
        console.error(error);
        this.state.error = true;
        this.state.errorMsg = "Error connecting to API.";
        this.setState(this.state);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5FCFF",
    justifyContent: "center",
    padding: 30,
    flex: 1,
    width: "100%"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  center: {
    textAlign: "center"
  },
  list: {
    marginBottom: 20
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
  back: {
    flex: 0,
    backgroundColor: "#41b6e6",
    padding: 7
  },
  backText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center"
  },
  rowHeader: {
    fontWeight: "700",
    borderColor: "#000033",
    borderBottomWidth: 1
  },
  col: {
    width: "23.3%",
    textAlign: "center"
  },
  prize: {
    width: "30%",
    textAlign: "center"
  }
});
