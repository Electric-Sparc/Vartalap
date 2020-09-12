import React, { Component } from 'react';
import { auth, db } from "../services/Fire";
import { Text, View, ActivityIndicator, StyleSheet, TextInput, ScrollView, SafeAreaView, Dimensions, Image, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Hyperlink from 'react-native-hyperlink';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      chats: [],
      content: '',
      readError: null,
      writeError: null,
      loadingChats: false,
      groupname: this.props.route.params.title
    };
    this.scroll = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (content) => this.setState({ content });

  componentDidMount() {
    this.setState({ readError: null, loadingChats: true });
    try {
      db.ref(this.state.groupname).on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        chats.sort(function (a, b) { return a.timestamp - b.timestamp; });
        this.setState({ chats });
        this.setState({ loadingChats: false });
      });
    } catch (error) {
      this.setState({ readError: error.message, loadingChats: false });
    }
  }

  handleSubmit() {
    this.setState({ writeError: null });
    if (this.state.content.trim() !== "") {
      try {
        db.ref(this.state.groupname).push({
          content: this.state.content,
          timestamp: Date.now(),
          uid: this.state.user.uid,
          email: this.state.user.email,
        });
        this.setState({ content: '' });
      } catch (error) {
        this.setState({ writeError: error.message });
      }
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

        <ScrollView style={styles.Messages} ref={(ref) => { this.scroll = ref; }} onContentSizeChange={() => { this.scroll.scrollToEnd({ animated: true, index: -1 }, 200); }}>
          {this.state.loadingChats ? <ActivityIndicator size="large"/> : null}
          {this.state.chats.map(chat => {
            return (
              <View style={this.state.user.uid === chat.uid ? styles.sent : styles.received} key={chat.timestamp} >
                <View style={this.state.user.uid === chat.uid ? styles.rightmessageBubble : styles.leftmessageBubble}>
                  <Text style={styles.sender}>{chat.email}</Text>
                  <Hyperlink linkStyle={{ color: '#2980b9', fontSize: 16 }}
                    onPress={async (url) => {
                      const supported = await Linking.canOpenURL(url);

                      if (supported) {
                        await Linking.openURL(url);
                      } else {
                        // Alert.alert(`Don't know how to open this URL: ${url}`);
                        Alert.alert(
                          "Unknown URL",
                          `Don't know how to open this URL: ${url}`,
                          [
                            {
                              text: "Cancel",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel"
                            },
                            { text: "OK", onPress: () => console.log("OK Pressed") }
                          ],
                          { cancelable: false }
                        );
                      }
                    }}>
                    <Text>{chat.content + "\n" + this.formatTime(chat.timestamp)}</Text>
                  </Hyperlink>
                </View>

              </View>
            );
          })}
        </ScrollView>
        <View style={{ flex: 0.1, flexDirection: "row" }}>
          <TextInput style={styles.message} name="content" onChangeText={this.handleChange} value={this.state.content} placeholder="Enter message here." />
          <Text>{this.state.error ? <Text style={styles.subtext}>{this.state.error}</Text> : null}</Text>
          <TouchableOpacity onPress={this.handleSubmit}>
            <Image source={{ uri: "https://img.icons8.com/ios/100/000000/sneeze.png" }} style={{ width: 35, height: 35, marginVertical: 10, }} />
          </TouchableOpacity>
        </View>
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
  subtext: {
    fontSize: 18,
  },
  Messages: {
    flex: 0.9,
    flexDirection: "column",
  },
  message: {
    borderColor: '#111111',
    borderWidth: 1,
    borderRadius: 5,
    width: Dimensions.get('window').width - 50,
    margin: 5,
    padding: 5,
    height: 40,
  },
  sent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  received: {
    flexDirection: 'row',
  },
  leftmessageBubble: {
    margin: 5,
    padding: 10,
    borderColor: '#111111',
    borderRadius: 15,
    borderWidth: 1,
    borderBottomStartRadius: 0,
  },
  rightmessageBubble: {
    margin: 5,
    padding: 10,
    borderColor: '#111111',
    borderRadius: 15,
    borderWidth: 1,
    borderBottomEndRadius: 0,
  },
  sender: {
    paddingBottom: 5,
    fontSize: 15,
    fontWeight: "bold",
  }
});