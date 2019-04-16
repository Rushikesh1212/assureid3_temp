import React, { Component } from "react";
import PropTypes from "prop-types";
import Meteor, { Accounts, createContainer } from "react-native-meteor";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import { Button, Icon,Avatar } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import DatePicker from "react-native-datepicker";
import { TextField } from "react-native-material-textfield";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from "react-native-table-component";
import Modal from "react-native-modal";

import AddSubscriptionTable from '../tableComponent/AddSubscriptionTable.js';
import styles from "./styles.js";
import Loading from "../Loading";

class ViewCustomerModal extends Component<{}> {
  constructor(props) {
    super(props);
    let username = "";
    if (this.props.username) {
      username = this.props.username;
    }


    this.state = {
      username: username,
      nickName:'',
      mobileNum:'',
      lineName:'',
      firstName:'',
      lastName:'',
      deposit:'',
      previousDue:'',
      previoutAdv:'',
      deliveryCharges:'',
      extraInfo:'',
      cashCustomer:'',
      addressLineOne:'',
      addressLineTwo:'',
      country:'',
      state:'',
      city:'',
      area:'',
      pincode:'',
      error: null
    };
  }
  confirmDeleteCustomer = () => {
    Alert.alert(
      '','Are you sure you want to remove this Customer ?',
      [
        {text: 'Delete',onPress: () => {this.deleteCustomer()}},
        {text: 'Cencel'}
      ]
    );
  }
  deleteCustomer =()=>{
    Meteor.call('deleteCustomer',this.props.customerId,(error,response)=>{
      if (error) {
        Alert.alert("Sorry!, Some error occurred while Deleting Customer");
        console.log(error.reason);
      } else {
        this.props._toggleModal();
        Alert.alert(
          "Success!",
          "Customer Deleted Successfully",
          [{ text: "OK"}],
          { cancelable: false }
        );
        console.log("Customer Deleted Updated Successfully!");
      }
    })
  }
  componentWillMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }
  handleError = error => {
    if (this.mounted) {
      this.setState({ error });
    }
  };

  render() {
    const { customerData } = this.props;
    console.log('render customerData : ', customerData);
    const modalTableHead = ["Type", "Language", "Name", "Quantity"];
    return (
      <Modal
        isVisible={this.props.isModalVisible}
        backdropColor={"black"}
        backdropOpacity={0.9}
      >
      <ScrollView contentContainerStyle={[styles.modalContent]}>
          <View
            style={{
              alignSelf: "flex-end"
            }}
          >
            <TouchableOpacity onPress={()=> this.props.handleEdit()}>
              <Icon
                name="edit"
                type="font-awesome"
                color="#6d6e70"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingHorizontal: 20
            }}
          >
            <View style={{flex:1}}>
              <Text>{customerData.nickName}</Text>
              <Text>{customerData.addressLineOne}</Text>
              <Text>{customerData.mobileNum}</Text>
              <Text>{customerData.firstName + ' '+ customerData.lastName}</Text>
              <Text>{customerData.addressLineTwo+' '+customerData.area}</Text>
              <Text>{customerData.city+', '+customerData.state+', '+customerData.country+' - '+customerData.pincode}</Text>
            </View>
            <Avatar
              overlayContainerStyle={{ flex: 1 }}
              width={100}
              height={100}
              rounded
              source={{
                uri:
                  "https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg"
              }}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
            />
          </View>
          <Text style={{ paddingHorizontal: 20, paddingTop: 15 }}>
            Subscription
          </Text>
          <AddSubscriptionTable customerNumber={customerData.mobileNum} tableHead={modalTableHead}/>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 10,
              paddingBottom: 10
            }}
          >
            <Text style={{ width: "50%", paddingBottom: 5 }}>
              Deposit: $ 200
            </Text>
            <Text style={{ width: "50%", paddingBottom: 5 }}>
              Previous Due: $ 200
            </Text>
            <Text style={{ width: "50%", paddingBottom: 5 }}>
              Previous Advance: $ 200
            </Text>
            <Text style={{ width: "50%", paddingBottom: 5 }}>
              Delivery Charges: $ 200
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around"
            }}
          >
            <Button
              onPress={this.confirmDeleteCustomer}
              textStyle={{ textAlign: "center" }}
              title="DELETE CUSTOMER"
              buttonStyle={styles.buttonDelete}
            />
            <Button
              onPress={() =>
                this.props._toggleModal()
              }
              textStyle={{ textAlign: "center" }}
              title="CANCEL"
              buttonStyle={styles.buttonClose}
            />
          </View>
      </ScrollView>
    </Modal>
    );
  }
}
export default createContainer(props => {
 const {customerId} = props;
 const customerHandle = Meteor.subscribe('customer');
 const customerData = Meteor.collection("customer").findOne({'_id':customerId})||[];
 const loading     = !customerHandle.ready();

 console.log('customerData : ', customerData);
  return{
    loading,
    customerData
  }
},ViewCustomerModal);
