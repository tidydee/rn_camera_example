/**
 * Buckup Mobile App
 *
 * @mschwab
 */

import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
const util = require('util');

export default class Home extends Component {
  static navigationOptions = {
    title: 'Home Screen'
  };

  constructor(props) {
    super(props);

    this.navigate = this.navigate.bind(this);

    this.state = { loading: 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.loading === 1 && this.state.loading === 0) {
      return true;
    }

    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loading === 1) {
      this.setState({ loading: 2 });
      setTimeout(() => {
        // Disable loading of camera so loading icon can load first so it is less confusing for the user.
        this.navigate("Scan");
      }, 125);
    }
  }

  render() {
    console.log("this.props.navigation = " + util.inspect(this.props.navigation, false, null));
    let {navigate} = this.props.navigation;
    if (this.state.loading > 0) {
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
          <View style={styles.inner}>
            <Image source={require("../img/logo.png")} style={[styles.logo]} />
            <Text style={[styles.title]}>Beat the Receipt</Text>
            <Text style={[styles.title]}>Mobile Validation App</Text>
            <View style={[styles.row]}>
              
              <Button
                onPress={() => {
                //   this.setState({ loading: 1 });
                alert("this.navigate SCAN TICKET");
                }}
                title="Scan Ticket"
                color="#41b6e6"
                accessibilityLabel="Scan a Beat the Receipt ticket"
                style={styles.button}
              />
              
              <Button
                onPress={() => navigate("Transactions", {name: "TEST", email: "test@gmail.com"})
                //   this.navigate("Transactions");
                // alert("this.navigate TRANSACTION");
                }
                title="Recent Transactions"
                color="#41b6e6"
                accessibilityLabel="List Previous Transactions"
              />

            </View>
          </View>
        </View>
      );
    }
  }

  navigate(id) {
    this.props.navigator.push({
      id: id
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
  title: {
    fontSize: 24,
    marginBottom: 5,
    alignSelf: "center"
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  button: {
    marginRight: 10
  }
});
