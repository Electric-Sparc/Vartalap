import React, { Component } from "react";
import { signin } from "../helpers/auth";
import { View, Text, TextInput, StyleSheet, Platform, Dimensions, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      email: "",
      password: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange = (email) => this.setState({ email });

  handlePasswordChange = (password) => this.setState({ password });

  showToast = (message) => {
    return Platform.OS === "web" ? (<Text style={styles.subtext}>{message}</Text>) : ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  async handleSubmit() {
    this.setState({ error: "" });
    try {
      await signin(this.state.email, this.state.password);
      this.showToast("Login Successful!!!");
      this.props.navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>Login to</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Vartalap')}>
            <Text style={styles.MainButton}>Vartalap</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtext}>Fill in the form below to login to your account.</Text>
        <TextInput
          style={styles.InputText}
          placeholder="Email"
          name="email"
          type="email"
          onChangeText={this.handleEmailChange}
          value={this.state.email}
        />
        <TextInput
          style={styles.InputText}
          placeholder="Password"
          name="password"
          onChangeText={this.handlePasswordChange}
          value={this.state.password}
          type="password"
          secureTextEntry={true}
        />
        <View>{this.state.error ? (this.showToast(this.state.error)) : null}</View>
        <TouchableOpacity onPress={this.handleSubmit}>
          <Text style={styles.button}>Login</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.subtext}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.replace('Signup')}>
            <Text style={styles.button}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    alignSelf: "center",
  },
  subtext: {
    fontSize: 15,
  },
  InputText: {
    height: 40,
    margin: 10,
    paddingHorizontal: 24,
    borderColor: '#111111',
    borderWidth: 1,
    fontSize: 24,
    borderRadius: 5,
    width: Platform.OS === 'web' ? null : Dimensions.get('window').width - 100,
  },
  MainButton: {
    marginLeft: 10,
    fontSize: 25,
  },
  button: {
    fontSize: 21,
    textAlignVertical: "center",
    textAlign: "center",
  }
});