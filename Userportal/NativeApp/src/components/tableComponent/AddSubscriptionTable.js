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
  Header,
  Card,
  Button,
  Avatar,
  Icon,
  SearchBar,
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

class AddSubscriptionTable extends React.Component{

  render(){
    const { subscriptionTableData, tableHead,_id, _editModal } = this.props;
    if(subscriptionTableData.length>0)
      return(
        <Table style={{ alignContent: "center", margin: 10 }}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
          />
          {
            subscriptionTableData.map((data, i) => (
              <TouchableOpacity key={i} onPress={()=>_editModal(_id[i])}>
                    <Row data={data} style={[styles.row, i%2 && {backgroundColor: '#dbdbdb'}]}  textStyle={styles.text}/>
              </TouchableOpacity>
            ))
          }
        </Table>
      );
    return(null);
  }
}
export default createContainer(props => {
  const { customerNumber } =  props;
  const subscriptionHandle = Meteor.subscribe("subscription");
  const subscriptionData = Meteor.collection('subscription').find({'customerNumber': customerNumber, 'vendorId': Meteor.userId()});
  var subscriptionTableData = [];
  var _id = [];
  const loading = !subscriptionHandle.ready() ;

  for(i=0;i<subscriptionData.length;i++){
    _id.push(subscriptionData[i]._id);
    subscriptionTableData.push([subscriptionData[i].type,subscriptionData[i].language,subscriptionData[i].subscriptionName,subscriptionData[i].quantity]);
  }
  console.log('_id sub : ',_id);

  return {
    loading,
    subscriptionTableData,
    _id
  };
}, AddSubscriptionTable);

AddSubscriptionTable.propTypes = {
  _editModal: PropTypes.func,
};
