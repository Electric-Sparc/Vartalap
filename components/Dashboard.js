import React, { Component } from 'react';
import { auth, db } from "../services/Fire";
import { Text, View, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView, Dimensions, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      usergroups: [],
      groups: [],
      content: '',
      readError: null,
      writeError: null,
      loadingGroups: false
    };
    this.scroll = null;
  }

  componentDidMount() {
    this.setState({ readError: null, loadingGroups: true });
    try {
      db.ref("groups").on("value", snapshot => {
        let groups = [];
        let usergroups = [];
        snapshot.forEach((snap) => {
          groups.push(snap.val());
        });
        groups.sort(function (a, b) { return a.timestamp - b.timestamp; });
        groups.map(group => {
          group.users.map(user => {
            if (user === this.state.user.email) {
              usergroups.push(group.name);
            }
          });
        });
        this.setState({ groups });
        this.setState({ usergroups });
        this.setState({ loadingGroups: false });
      });
    } catch (error) {
      this.setState({ readError: error.message, loadingGroups: false });
    }
  }

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <ScrollView>
          {this.state.loadingGroups ? <ActivityIndicator size="large" style={styles.initcontainer} /> : null}
          {this.state.usergroups.map(group => {
            return (
              <View style={styles.groups} key={group} >
                <Image style={styles.groupicon} source={ { uri: "https://ui-avatars.com/api/?uppercase=false&rounded=true&name="+ group.toString() } } />
                <TouchableOpacity onPress={() => { 
                  this.props.navigation.navigate( 'Chat', { title : group });
                  }} >
                  <Text style={styles.groupname}>{group}</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "stretch",
  },
  initcontainer: {
    flex: 1,
    flexDirection: 'column',
  },
  groups: {
    borderBottomColor: '#111',
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flex: 5,
    flexDirection: "row",
  },
  groupname: {
    fontSize: 20,
    marginLeft: 20,
  },
  groupicon: {
    height: 30,
    width: 30,
  }
});