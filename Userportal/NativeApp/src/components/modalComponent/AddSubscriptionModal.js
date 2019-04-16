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
import { Button, Icon } from "react-native-elements";
import { Dropdown } from "react-native-material-dropdown";
import DatePicker from "react-native-datepicker";
import { TextField } from "react-native-material-textfield";
import Modal from "react-native-modal";


import styles from "./styles.js";
import Loading from "../Loading";

class AddSubscriptionModal extends Component<{}> {
  constructor(props) {
    super(props);
    let deliveryCost = "";
    if (this.props.vendorProducts) {
      deliveryCost = this.props.vendorProducts.deliveryCharge;
    }
    this.state = {
      username: "",
      quantity:0,
      deliveryCost:deliveryCost,
      fromDate:'',
      toDate:'',
      sunday: true,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      typeData: [],
      subData: [],
      languageValue: '',
      typeValue: '',
      productValue:'',
      error: null
    };
  }
  _goBack = () =>{
    this.props._toggleModal();
  }
  addSubscription = () => {
    const {languageValue,typeValue,productValue,quantity,sunday,monday,tuesday,wednesday,thursday,friday,saturday,fromDate,toDate,deliveryCost } = this.state;
    const { mobileNumber, lineName } = this.props;
    Meteor.call('addSubscription',languageValue,typeValue,productValue,quantity,sunday,monday,tuesday,wednesday,thursday,friday,saturday,fromDate,toDate,deliveryCost,mobileNumber, lineName,(error,res)=>{
      if (error) {
        Alert.alert("Sorry!, Some error occurred while adding subscription!");
        console.log(error.reason);
      } else {
        Alert.alert(
          "Success!",
          "Customer Subscription Added Successfully",
          [{ text: "OK", onPress: this._goBack}],
          { cancelable: false }
        );
        console.log("Customer Subscription Added Successfully!");
      }
    });
  }
  handleLangChange(langValue,vendorProducts) {

    console.log("langValue = ",langValue);
    // console.log("vendorProducts = ",vendorProducts);

    var result = vendorProducts.filter(x=> {
      return x.productLanguage === langValue;
    }).map(x=> {
      return ({'value': x.productType});
    });

    // var typeData = result.map(x=> {
    //   return ({'value': x.newspaperType});
    // });

    result = result.filter((obj,index,array)=>{
      return index === array.findIndex((t)=>(
          t.value === obj.value
        ));
    });

    // this.setState({typeData: []});
    this.setState({typeData: result, languageValue: langValue});
    // console.log("result = ",result);
    // console.log("lang: typeValue = ",this.state.typeValue);
    // this.typeDropdown.clear();
    // console.log("typeData = ",typeData);
  }
  handleTypeChange(typeValue,vendorProducts) {
    var langValue = this.state.languageValue;
    // console.log("typeValue = ",typeValue);
    // console.log("vendorProducts = ",vendorProducts);
    // console.log("langValue = ",langValue);

    // console.log("product data = ",vendorProducts);

    var result = vendorProducts.filter(x=> {
      return ((x.productLanguage === langValue) && (x.productType === typeValue ));
    }).map(x=> {
      return ({'value': x.productTitle});
    });

    this.setState({subData: result, typeValue: typeValue});
    // console.log("prod result = ",result);
  }
  handleSubscriptionChange(productValue,vendorProducts){
    this.setState({productValue});
    console.log("businessId : ",Meteor.user().profile.activeServiceId);
    console.log("languageValue : ",this.state.languageValue);
    console.log("typeValue : ", this.state.typeValue);
    console.log("productValue : ", productValue);
    Meteor.call('deliveryCharge',Meteor.user().profile.activeServiceId,this.state.languageValue,this.state.typeValue,productValue,(err,res)=>{
      if(err){
        console.log('err : ',err.reason);
      }
      if(res){
        console.log("deliveryCharge : ",res);
          this.setState({deliveryCost:res.deliveryCharge});
      }

    })
  }
  increment = () => {
    this.setState({
      quantity:this.state.quantity+1
    });

  }

  decrement = () => {
    if(this.state.quantity >=1){
      this.setState({
        quantity:this.state.quantity-1
      });
    }
  }
  addProduct = () => {
    var formValues = {
      'language'      : this.state.languageValue,
      'type'          : this.state.typeValue,
      'productTitle'  : this.state.productValue,
    }
    // console.log("formValues = ",formValues);

    Meteor.call('insertVendorProduct',formValues,(error,result) =>{
      if(error){
        Alert.alert(
          'Error',
        )
      }else{
        // console.log("modal state :::: ",this.state.isModalVisible);
        console.log("product id =::::: ",result);
        this.props.navigation.navigate('EditProduct',{productId:result});
      }
    });
    // this.setState({ isModalVisible: !this.state.isModalVisible });
    this._toggleModal();
  }
  sundayToggle = () => {
    let sunday = !this.state.sunday;
    this.setState({ sunday });
  };
  mondayToggle = () => {
    let monday = !this.state.monday;
    this.setState({ monday });
  };
  tuesdayToggle = () => {
    let tuesday = !this.state.tuesday;
    this.setState({ tuesday });
  };
  wednesdayToggle = () => {
    let wednesday = !this.state.wednesday;
    this.setState({ wednesday });
  };
  thursdayToggle = () => {
    let thursday = !this.state.thursday;
    this.setState({ thursday });
  };
  fridayToggle = () => {
    let friday = !this.state.friday;
    this.setState({ friday });
  };
  saturdayToggle = () => {
    let saturday = !this.state.saturday;
    this.setState({ saturday });
  };

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
  validInput = () => {
    const { username } = this.state;
    let valid = true;

    if (username.length === 0) {
      this.handleError("Moblie number field cannot be empty.");
      valid = false;
    }
    if (valid) {
      this.handleError(null);
    }
    return valid;
  };
  render() {
    let linedata = this.props.lineData;
      const { vendorProducts }  = this.props;
      // console.log('vendor Products : ',vendorProducts);
          let langData = [];
          for(i=0;i<vendorProducts.length;i++){
            langData.push({
              'value':  vendorProducts[i].productLanguage
            });
          }

          langData = langData.filter((obj,index,array)=>{
            return index === array.findIndex((t)=>(
                t.value === obj.value
              ));
          });

    return (
      <Modal
        isVisible={this.props.isModalVisible}
        backdropColor={"black"}
        backdropOpacity={0.9}
        onBackdropPress={() => this.props._closeModal()}
      >
      <ScrollView contentContainerStyle={styles.modalContent}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>Add Subscription</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around"
          }}
        >
          <Dropdown
            baseColor="#aaa"
            containerStyle={styles.halfDropdown}
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: "#aaa"
            }}
            label="Language"
            labelHeight={20}
            rippleInsets={{ bottom: -25, top: 0 }}
            labelTextStyle={{ textAlign: "center", paddingLeft: 15 }}
            data={langData}
            value={this.state.languageValue}
            onChangeText  = {(value) => this.handleLangChange(value,vendorProducts)}
          />
          <Dropdown
            baseColor="#aaa"
            containerStyle={styles.halfDropdown}
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: "#aaa"
            }}
            label="Type"
            labelHeight={20}
            rippleInsets={{ bottom: -25, top: 0 }}
            labelTextStyle={{ textAlign: "center", paddingLeft: 15 }}
            data={this.state.typeData}
            onChangeText  = {(value) => this.handleTypeChange(value,vendorProducts)}
            value={this.state.typeValue}
          />
        </View>
        <Dropdown
          baseColor="#aaa"
          inputContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: "#aaa"
          }}
          label="Subsription Name"
          labelHeight={20}
          rippleInsets={{ bottom: -25, top: 0 }}
          labelTextStyle={{ textAlign: "center", paddingLeft: 15 }}
          data={this.state.subData}
          onChangeText ={(value) => this.handleSubscriptionChange(value,vendorProducts)}
        />
        <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:15,marginBottom:20}}>
          <Text style={{flex:1}}>Quantity</Text>
          <View style={{flex:2,flexDirection:'row',alignItems:'center'}}>
            <TouchableOpacity onPress={this.decrement}>
                <Icon size={40} name="minus-box" type="material-community" color="#f7bc79" />
            </TouchableOpacity>
            <Text style={{paddingHorizontal:25}}>{this.state.quantity}</Text>
            <TouchableOpacity onPress={this.increment}>
                <Icon size={40} name="plus-box" type="material-community" color="#f7bc79" />
            </TouchableOpacity>
          </View>
        </View>
        <Text>Days of Service</Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            paddingVertical: 10
          }}
        >
          {this.state.sunday ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.sundayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/greenRight.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#f7ac57",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>S</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.sundayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/redCross.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#333",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>S</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {this.state.monday ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.mondayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/greenRight.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#f7ac57",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>M</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.mondayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/redCross.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#333",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>M</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {this.state.tuesday ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.tuesdayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/greenRight.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#f7ac57",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>T</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.tuesdayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/redCross.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#333",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>T</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {this.state.wednesday ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.wednesdayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/greenRight.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#f7ac57",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>W</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.wednesdayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/redCross.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#333",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>W</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {this.state.thursday ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.thursdayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/greenRight.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#f7ac57",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>T</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.thursdayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/redCross.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#333",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>T</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {this.state.friday ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.fridayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/greenRight.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#f7ac57",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>F</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.fridayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/redCross.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#333",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>F</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {this.state.saturday ? (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.saturdayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/greenRight.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#f7ac57",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>S</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={{ justifyContent: "center", alignItems: "center" }}
                onPress={this.saturdayToggle}
              >
                <Image
                  style={{ width: 25, height: 25, marginVertical: 2 }}
                  source={require("../../images/redCross.png")}
                />
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#333",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 25
                  }}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>S</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around"
          }}
        >
          <TouchableOpacity onPress={() => console.log("Pressed!")}>
            <View style={[styles.inputViewHalf, { marginBottom: 10 }]}>
              <DatePicker
                style                 = {{borderBottomWidth:1,borderColor: 'gray',width:'100%'}}
                date                  = {this.state.fromDate}
                mode                  = "date"
                placeholder           = "From Date"
                format                = "dddd, Do MMM YYYY"
                minDate               = "01-10-2018"
                confirmBtnText        = "Confirm"
                cancelBtnText         = "Cancel"
                customStyles          = {{
                                         dateInput: {
                                          borderWidth: 0
                                         }
                                        }}
                onDateChange          = {(date) => {this.setState({fromDate: date})}}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log("Pressed!")}>
            <View style={[styles.inputViewHalf, { marginBottom: 10 }]}>
              <DatePicker
                style                 = {{borderBottomWidth:1,borderColor: 'gray',width:'100%'}}
                date                  = {this.state.toDate}
                mode                  = "date"
                placeholder           = "To Date"
                format                = "dddd, Do MMM YYYY"
                minDate               = "01-10-2018"
                confirmBtnText        = "Confirm"
                cancelBtnText         = "Cancel"
                customStyles          = {{
                                         dateInput: {
                                          borderWidth: 0
                                         }
                                        }}
                onDateChange          = {(date) => {this.setState({toDate: date})}}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.formInputViewHalf}>
          <TextField
            label="Delivery Charges"
            value={this.state.deliveryCost}
            onChangeText={deliveryCost => this.setState({ deliveryCost })}
            lineWidth={1}
            tintColor="#f7ac57"
            inputContainerPadding={4}
            labelHeight={16}
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: "#aaa"
            }}
            labelTextStyle={{ textAlign: "center", paddingLeft: 15 }}
            keyboardType="default"
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around"
          }}
        >
          <Button
            onPress={() => this.props._toggleModal()}
            textStyle={{ textAlign: "center" }}
            title="CANCEL"
            buttonStyle={styles.buttonDelete}
          />
          <Button
            onPress={this.addSubscription}
            textStyle={{ textAlign: "center" }}
            title="SUBMIT"
            buttonStyle={styles.buttonClose}
          />
        </View>
      </ScrollView>
    </Modal>
    );
  }
}
export default createContainer(props => {
  const vendorProductsHandle = Meteor.subscribe('vendorProductDetails');
  var businessId       = Meteor.user().profile.activeServiceId;
  return{
    handleReady        : vendorProductsHandle.ready(),
    vendorProducts     : Meteor.collection('VendorProduct').find({'businessId':businessId}) || [],
    loading            : !vendorProductsHandle.ready(),
  }
},AddSubscriptionModal);
