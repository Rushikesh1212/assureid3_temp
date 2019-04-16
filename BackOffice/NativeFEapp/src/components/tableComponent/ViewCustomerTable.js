import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  BackHandler,
  Image,
  BackAndroid,
  findNodeHandle,
  DrawerLayoutAndroid
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Card,
  Button,
  Avatar,
  Icon,
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import Meteor, { createContainer } from "react-native-meteor";
import SideMenu from "react-native-side-menu";
import RNExitApp from "react-native-exit-app";
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

import styles from "./styles.js";
import Loading from "../Loading";
class ViewCustomerTable extends React.Component {
  render() {
    const tableHead = ["Customer Name", "Subscription", "Address", "Notes"];

    const { _id, subscriptionTableData, loading } = this.props;
    if (loading) {
      return <Loading />;
    }
    if (subscriptionTableData.length > 0)
      return (
        <Table style={{ alignContent: "center" }}>
          <Row
            data={tableHead}
            flexArr={[3, 2, 3, 2]}
            style={styles.head}
            textStyle={styles.headText}
          />
          {subscriptionTableData.map((data, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => this.props.navigate('ViewCustomerDetails',{customerId:_id[i]})} >
              <Row
                data={data}
                flexArr={[3, 2, 3, 2]}
                style={[styles.row, i % 2 && { backgroundColor: "#dbdbdb" }]}
                textStyle={styles.text}
              />
            </TouchableOpacity>
          ))}
        </Table>
      );
    return null;
  }
}
export default createContainer(props => {
  const { lineName } = props;
  const customerHandle = Meteor.subscribe("customer");
  const customerData = Meteor.collection("customer").find(
    { lineName: lineName },
    {
      fields: {
        _id: 1,
        firstName: 1,
        lastName: 1,
        mobileNum: 1,
        addressLineOne: 1,
        addressLineTwo: 1,
        extraInfo: 1
      }
    }
  );
  const subscriptionHandle = Meteor.subscribe("subscription");

  var subscriptionTableData = [];
  var _id = [];
  const loading = !subscriptionHandle.ready() || !customerHandle.ready();
  for (i = 0; i < customerData.length; i++) {
    _id.push(customerData[i]._id);
    let customerName =
      customerData[i].firstName + " " + customerData[i].lastName;
    let subscriptionCount = Meteor.collection("subscription").find(
      { customerNumber: customerData[i].mobileNum, vendorId: Meteor.userId() },
      { fields: { _id: 1 } }
    ).length;
    let address = "Not Available";
    if (customerData[i].addressLineOne || customerData[i].addressLineTwo) {
      address =
        customerData[i].addressLineOne + " " + customerData[i].addressLineTwo;
    }
    let notes = " ---- ";
    if (customerData[i].extraInfo) {
      notes = customerData[i].extraInfo;
    }
    subscriptionTableData.push([
      customerName,
      subscriptionCount,
      address,
      notes
    ]);
  }
  console.log(_id);

  return {
    loading,
    subscriptionTableData,
    _id
  };
}, ViewCustomerTable);
