import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";

import MyHeader from "../components/MyHeader";
import { BookSearch } from "react-native-google-books";

export default class BookRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      bookName: "",
      subject: "",
      assignmentDetails: "",
      IsBookRequestActive: "",
      requestedBookName: "",
      bookStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      Imagelink: "#",
      assignment: "",
      dataSource: "",
      requestedImageLink: "",
      showFlatlist: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addAssignment = async (subject, assignment, assignmentDetails) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection("assignment_details").add({
      user_id: userId,
      subject_name: subject,
      assignment_name: assignment,
      assignmentDetails: assignmentDetails,
      request_id: randomRequestId,
      assignment_status: "assigned",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await this.getBookRequest();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
             IsAssignemntActive: true
          });
        });
      });

    this.setState({
      bookName: "",
      reasonToRequest: "",
      requestId: randomRequestId,
    });

    return alert("Assignment Added Successfully");
  };

  receivedBooks = (bookName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_books").add({
      user_id: userId,
      book_name: bookName,
      request_id: requestId,
      bookStatus: "received",
    });
  };

  getIsBookRequestActive() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsBookRequestActive: doc.data().IsBookRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getAssignmentDetails = () => {
    // getting the requested book
    var bookRequest = db
      .collection("requested_books")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().book_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedBookName: doc.data().book_name,
              bookStatus: doc.data().book_status,
              requestedImageLink: doc.data().image_link,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          // to get the donor id and book nam
          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var bookName = doc.data().book_name;

                //targert user id is the donor id to send notification to the user
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    name + " " + lastName + " received the book " + bookName,
                  notification_status: "unread",
                  book_name: bookName,
                });
              });
            });
        });
      });
  };

 /* componentDidMount() {
    this.getAssignmentDetails();
    this.getIsAssignmentActive();
  }
*/
  updateBookRequestStatus = () => {
    //updating the book status after receiving the book
    db.collection("requested_books").doc(this.state.docId).update({
      book_status: "received",
    });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsBookRequestActive: false,
          });
        });
      });
  };

  async getBooksFromApi(bookName) {
    this.setState({ bookName: bookName });
    if (bookName.length > 2) {
      var books = await BookSearch.searchbook(
        bookName,
        "AIzaSyASyOjOtJla-X-b3io2eLoaUc_bIRFSIIc"
      );
      this.setState({
        dataSource: books.data,
        showFlatlist: true,
      });
    }
  }

  //render Items  functionto render the books from api
  renderItem = ({ item, i }) => {


    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };

    return (
      <TouchableHighlight
        style={styles.touchableopacity}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => {
          this.setState({
            showFlatlist: false,
            bookName: item.volumeInfo.title,
          });
        }}
        bottomDivider
      >
        <Text> {item.volumeInfo.title} </Text>
      </TouchableHighlight>
    );
  };

  render() {
    if (this.state.IsBookRequestActive === true) {
      return (
        <View style={{ flex: 1}}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Add Assignment" navigation={this.props.navigation} />
          </View>
          <View
            style={styles.ImageView}
          >
            <Image
              source={{ uri: this.state.requestedImageLink }}
              style={styles.imageStyle}
            />
          </View>
          <View
            style={styles.bookstatus}
          >
            <Text
              style={{
                fontSize: RFValue(20),

              }}
            >
              Name of the book
            </Text>
            <Text
              style={styles.requestedbookName}
            >
              {this.state.requestedBookName}
            </Text>
            <Text
              style={styles.status}
            >
              Status
            </Text>
            <Text
              style={styles.bookStatus}
            >
              {this.state.bookStatus}
            </Text>
          </View>
          <View
            style={styles.buttonView}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateBookRequestStatus();
                this.receivedBooks(this.state.requestedBookName);
              }}
            >
              <Text
                style={styles.buttontxt}
              >
                Book Recived
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Add Assignment" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput}
            label={"Subject Name :-"}
            placeholder={"Name Of The Subject"}
            containerStyle={{ marginTop: RFValue(20) }}
            onChangeText={(text) => {
              this.setState({subject:text})
            }}
            value={this.state.subject}
          />
           <Input
            style={styles.formTextInput}
            label={"Assignment Name :-"}
            placeholder={"Name Of The Assignment"}
            containerStyle={{ marginTop: RFValue(30) }}
             onChangeText={(text) => {
              this.setState({assignment:text})
            }}
            value={this.state.assignment}
          />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(20) }}
                multiline
                numberOfLines={6}
                label={"Details :-"}
                placeholder={"Details Of The Assignment"}
                onChangeText={(text) => {
                  this.setState({
                   assignmentDetails: text,
                  });
                }}
                value={this.state.assignmentDetails}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(10) }]}
                onPress={() => {
                  this.addAssignment(
                    this.state.subject,
                    this.state.assignment,
                    this.state.assignmentDetails
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Add Assignment
                </Text>
              </TouchableOpacity>
            </View>
          
        </View>
    );
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: "75%",
    height: RFValue(35),
    borderWidth: 1,
    padding: 10,
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
  },
  bookstatus:{
    flex: 0.4,
    alignItems: "center",

  },
  requestedbookName:{
    fontSize: RFValue(30),
    fontWeight: "500",
    padding: RFValue(10),
    alignItems:'center',
    marginLeft:RFValue(60)
  },
  status:{
    fontSize: RFValue(20),
    marginTop: RFValue(30),
  },
  bookStatus:{
    fontSize: RFValue(30),
    fontWeight: "bold",
    marginTop: RFValue(10),
  },
  buttonView:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});
