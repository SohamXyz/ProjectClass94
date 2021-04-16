import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class BookDonateScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      assignmentList: [],
    };
    this.requestRef = null;
  }

  getAssignmentList = () => {
    this.requestRef = db
      .collection("assignment_details")
      .onSnapshot((snapshot) => {
        var assignmentList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          assignmentList: assignmentList,
        });
      });
  };

  componentDidMount() {
    this.getAssignmentList();
  }

  componentWillUnmount() {
  this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.subject_name}
        subtitle={item.assignment, item.assignmentDetails}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        leftElement={
          <Image
            style={{ height: 50, width: 50 }}
            source={{
              uri: item.image_link,
            }}
          />
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MyHeader title="Assignments" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.assignmentList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Assignments</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.assignmentList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  view:{
    flex: 1,
    backgroundColor: "#fff"
  }
});
