import React, { Component } from "react";
import { ActivityIndicator, Image, StyleSheet } from 'react-native';
import Main from "./components/Main";
import Chat from "./components/Chat";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { auth, db } from "./services/Fire";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

class App extends Component {
    constructor() {
        super();
        this.state = {
            authenticated: false,
            loading: true
        };
    }

    async componentDidMount() {
        await auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    authenticated: true,
                    loading: false
                });
            } else {
                this.setState({
                    authenticated: false,
                    loading: false
                });
            }
        });
    }

    displayMembers(GroupName) {
        try {
            db.ref("groups/"+GroupName+"/users").on("value", snapshot => {
                let users = [];
                snapshot.forEach((snap) => {
                    users.push(snap.val());
                });
            });
        } catch (error) {
        }
    }

    render() {
        return this.state.loading === true ? (<
            ActivityIndicator size="large" style={styles.container} />
        ) : (
                <NavigationContainer>
                    <Stack.Navigator>
                        {this.state.authenticated ?
                            < Stack.Screen name="Dashboard" component={Dashboard}
                                options={({
                                    headerRight: () => (<TouchableOpacity onPress={
                                        () => {
                                            auth().signOut(); { Main }
                                        }
                                    } >
                                        <Image source={
                                            { uri: "https://img.icons8.com/ios/50/000000/hand-right.png" }
                                        }
                                            style={
                                                { width: 35, height: 35, margin: 5, transform: [{ rotate: "315deg" }] }
                                            } />
                                    </TouchableOpacity >
                                    ),
                                    title: "My Dashboard",
                                })
                                }
                            /> : null
                        }
                        {this.state.authenticated ?
                            <Stack.Screen name="Chat" component={Chat}
                                options={
                                    ({ route }) => ({
                                        headerRight: () => (<TouchableOpacity onPress={() => { this.displayMembers(route.params.title); this.setState({ modalVisible: false}) }} >
                                            <Image source={
                                                { uri: "https://img.icons8.com/bubbles/100/000000/conference-call.png" }
                                            }
                                            style={
                                                { width: 50, height: 50, margin: 5 }
                                            } />
                                        </TouchableOpacity >
                                        ),
                                        title: route.params.title,
                                    })
                                }
                            /> : null
                        }
                        < Stack.Screen name="Vartalap" component={Main} />
                        <Stack.Screen name="Signup" component={Signup} />
                        <Stack.Screen name="Login" component={Login} />
                    </Stack.Navigator >
                </NavigationContainer>
            );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});

export default App;