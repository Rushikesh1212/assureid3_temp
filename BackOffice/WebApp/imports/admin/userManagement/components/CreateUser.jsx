import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Services} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Location } from '/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js';

class CreateUser extends TrackerReact(Component) {

  constructor(props){
    super(props);
    this.state={
      "roleList"    :[], 
      "service"     :[],
      "userList"    :[],
      "userUniqueData" :[],
      "searchArray" : [],
      "firstname"   : '',
      "lastname"    : '',
      "mobNumber"   : '',
      "signupEmail" : '',
      "servicesRef" : '',
      "roleRef"     : '',
      "reportToRef" : '',
      "state"       : '',
      "country"     : '',
      "area"        : '', 
      "pincode"     : '',
      "serviceError" : '',
      "roleError"    : '',
      "reportToError" : '',
        "subscription"  : {
          "userSubscribe": Meteor.subscribe('userfunction'),
          "location"     : Meteor.subscribe('location'),
        }  
    },
   
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
    const target = event.target;
    const name   = target.name;
    console.log("name",name);
    if (name == "servicesRef") {
      this.setState({
        "serviceError" : '',
      });
    }else if (name == "roleRef") {
       this.setState({
        "roleError" : '',
      });
    }else if (name == "reportToRef") {
      this.setState({
        "reportToError" : '',
      });
    }
    this.setState({
      [name]: event.target.value,

    },()=>{   
        // console.log(this.state.roleRef);
        if (this.state.roleRef == "field expert" || this.state.roleRef == "ba") {
           $('.outerlocationBlock').css({'display' : 'block'});
        }else{
           $('.outerlocationBlock').css({'display' : 'none'});
        }

     });
  }
  componentDidMount() {
   // $("#signUpUser").validate();
    $("html,body").scrollTop(0);
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }

    this.serviceTracker = Tracker.autorun( ()=> {
      var handle = Meteor.subscribe("services");
      if(handle.ready()){
        var services = Services.find({},{field:{'serviceName':1}}).fetch();
       
        this.setState({
          "service": services,
        });
      }
    });

    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    }); 

     $("#signUpUser").validate({ 
        rules: {
          servicesRef: {
            required: true,
          },
          roleRef: {
            required: true,
          }, 
          reportToRef: {
            required: true,
          },  
        }
    });
  }
 
  createUser(event){
    event.preventDefault();
    if( $("#signUpUser").validate()){

      var reportrefValue = this.refs.reportToRef.value;      
      if(reportrefValue!="" && reportrefValue!= "-- Select --"){
        var splitValue   = reportrefValue.split("(");
        var reportToRole = splitValue[0];
        var reportToName = splitValue[1].slice(0, -1);
      }else{ 
        var reportToName = '';
        var reportToRole = ''; 
      }  

      if(this.refs.servicesRef.value !='-- Select --'){
        var serviceNm = this.refs.servicesRef.value;
      }else{
        var serviceNm = "";
      }      
        
      var formValues = {
                        'firstname'        : this.refs.firstname.value,
                        'lastname'         : this.refs.lastname.value,
                        'signupEmail'      : this.refs.signupEmail.value,
                        'mobNumber'        : this.refs.mobNumber.value,
                        'servicesName'     : serviceNm,
                        'area'             : this.refs.area.value,
                        'state'            : this.refs.state.value,
                        'country'          : this.refs.country.value,
                        'pincode'          : this.refs.pincode.value,
                        'reportToRole'     : reportToRole,
                        'reportToName'     : reportToName,
                        'signupPassword'   : "user123",
                      }  

        var defaultRoleWith = ["backofficestaff"];
        if(this.refs.roleRef.value !='-- Select --'){
          var assignedrole = this.refs.roleRef.value; 
          defaultRoleWith.push(assignedrole);
        }else{
          var assignedrole = ""; 
        }
        if (serviceNm) {
          if (assignedrole) {
            if (reportToName && reportToRole) {
              Meteor.call('userCreateAccount', formValues ,(error,result) => {
                if(error){ 
                  swal(error.reason);
                }else{      

                    if(result){
                       // ADD USER ROLE 
                        var newID = result;
                        Meteor.call('addRoles', newID , defaultRoleWith, function(error,result){
                          if(error){
                            swal(error);
                          }else{                
                              swal('Congratulations!! Account Created...');
                          }
                        }); // add role
                           // CLEAR ALL FIELDS
                        this.setState({
                           "firstname"   : '',
                            "lastname"    : '',
                            "mobNumber"   : '',
                            "signupEmail" : '',
                            "servicesRef" : '',
                            "roleRef"     : '',
                            "reportToRef" : '',
                            "state"       : '',
                            "country"     : '',
                            "area"        : '', 
                            "pincode"     : '',
                        });
                        $('select').val('-- Select --');
                  }
                      
                } //end else
              });
            }else{
             this.setState({"reportToError" : "Please select Reporting Person!"});
            }
          }else{
             this.setState({"roleError" : "Please select role!"});
          }
        }else{
          this.setState({"serviceError" : "Please select service!"});
        }

    return 0;   
    }

  }

  
  componentWillMount() {
  }
  componentWillUnmount(){  
     $("script[src='/js/adminLte.js']").remove(); 
  }

  buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
      return "(?=.*" + word + ")";
    });

    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
  }

  getTextValueWhenType(event){
    var textValue= $(event.target).val();
    if(textValue != ""){
      var RegExpBuildValue = this.buildRegExp(textValue); 
      var searchData = Location.find({$or:[{"area":RegExpBuildValue},{"country":RegExpBuildValue},{"state":RegExpBuildValue}]}).fetch();
      if(searchData){
        if($(event.target).hasClass('area')){
          var pluckArea = _.pluck(searchData,"area");
          var uniqueArea = _.uniq(pluckArea);
          this.setState({"searchArray":uniqueArea});
        }else if($(event.target).hasClass('country')){
          var pluckCountry = _.pluck(searchData,"country");
          var uniqueCountry = _.uniq(pluckCountry);
          this.setState({"searchArray":uniqueCountry});
        }else if($(event.target).hasClass('state')){
          var pluckState = _.pluck(searchData,"state");
          var uniqueState = _.uniq(pluckState);
          this.setState({"searchArray":uniqueState});
        }else{
          this.setState({"searchArray":[]});
          $(event.target).val('');
        }
      }else{
         this.setState({"searchArray":[]});
        $(event.target).val('');
      }
    }else{
      this.setState({"searchArray":[]});
      $(event.target).val('');
    }
  }
  render() {
    if(!this.props.loading){      
       return (
        <section className="content-wrapper">
        <div className="content">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="box box-primary">
              <div className="box-header with-border">
               <h2 className="box-title">Add New Staff</h2>
              </div>
           
              <div className="box-body ">
                <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                  <form id="signUpUser" onSubmit={this.createUser.bind(this)}>
                    <div className="signupBody col-lg-12 col-md-8 col-sm-12 col-xs-12">
                     <div className="form-group col-lg-6 col-md-4 col-xs-6 col-sm-6 inputContent">
                        <span className="blocking-span">
                          <label className="floating-label">First Name<span className="astrikReq">*</span></label>
                          <input type="text" className="form-control inputText" ref="firstname" name="firstname" value={this.state.firstname} onChange={this.handleChange} required />
                      </span>
                     </div>

                     <div className="form-group col-lg-6 col-md-4 col-xs-6 col-sm-6 inputContent">
                        <span className="blocking-span">
                           <label className="floating-label">Last Name<span className="astrikReq">*</span></label>
                           <input type="text" className="form-control inputText" ref="lastname" name="lastname" value={this.state.lastname} onChange={this.handleChange} required />
                        </span>
                      </div>

                      <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
                        <span className="blocking-span">
                          <label className="floating-label">Email ID<span className="astrikReq">*</span></label>
                          <input type="email" className="form-control signupsetting inputText" ref="signupEmail" name="signupEmail" value={this.state.signupEmail} onChange={this.handleChange} required />
                      </span>
                      </div>

                      <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
                        <span className="blocking-span">
                          <label className="floating-label">Phone Number<span className="astrikReq">*</span></label>
                          <input type="text" minLength="10" className="form-control inputText" ref="mobNumber" name="mobNumber" value={this.state.mobNumber} onChange={this.handleChange} required />
                      </span>
                      </div>

                      <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
                        <span className="blocking-span">
                          <label className="floating-label">Assign Service<span className="astrikReq">*</span></label>
                           {/* <span className="input-group-addon" id="basic-addon1"><i className="fa fa-gg" aria-hidden="true"></i></span> */}
                              <select className="form-control allProductSubCategories" ref="servicesRef" name="servicesRef"   required="true" onChange={this.handleChange}>
                                  <option disabled="disabled" selected="true">-- Select --</option>
                                  { this.state.service.length > 0 ?
                                      <option value="All Services">All Services</option>
                                    :
                                      ""
                                  }
                                  { this.state.service.length>0 ?
                                    this.state.service.map( (data, index)=>{
                                      return (
                                          <option key={index}>{data.serviceName}</option>
                                      );
                                   })
                                  :
                                  ""
                                  }
                              </select>
                        </span>
                        <label className="error">{this.state.serviceError}</label>
                      </div>
                      <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
                        <span className="blocking-span">
                          <label className="floating-label">Assign Role<span className="astrikReq">*</span></label>
                           <select className="form-control allProductSubCategories" name="roleRef" ref="roleRef" onChange={this.handleChange}  required="true">
                              <option disabled="disabled" selected="true">-- Select --</option>
                              {  
                                // !this.props.loading ?
                                this.props.roleList.length > 0 ?
                                this.props.roleList.map( (data, index)=>{
                                  return (
                                      <option key={index}>{data}</option>
                                  );
                              })
                              :
                              ""
                              // :
                              // ""
                              } 
                           </select>
                        </span>
                        <label className="error">{this.state.roleError}</label>
                      </div>
                      <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
                        <span className="blocking-span">
                          <label className="floating-label">Reporting To<span className="astrikReq">*</span></label>
                           {/* <span className="input-group-addon" id="basic-addon1"><i className="fa fa-gg" aria-hidden="true"></i></span> */}
                           
                              <select className="form-control allProductSubCategories"  ref="reportToRef" name="reportToRef"  required="true" onChange={this.handleChange}>
                                  <option disabled="disabled" selected="true">-- Select --</option>
                                  { 
                                    
                                    this.props.userUniqueData.length>0 ?
                                    this.props.userUniqueData.map((data, index)=>{
                                      return (
                                          <option key={index}>
                                            
                                            {data}
                                          </option>
                                      );
                                    })
                                    : 
                                    ""
                                  }
                              </select>
                        </span>
                        <label className="error">{this.state.reportToError}</label>
                      </div>
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding outerlocationBlock">
                        <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
                          <span className="blocking-span">
                            <label className="floating-label">Area</label> 
                            <input type="text" autoComplete="on" list="autoAreaInUser" className="form-control inputText area" ref="area" name="area"  onInput={this.getTextValueWhenType.bind(this)}/>
                             <datalist className="autocomplete" id="autoAreaInUser">
                                { 
                                  this.state.searchArray.map((searchDetails, index)=>{
                                    return(
                                      <option value={searchDetails} key={searchDetails + '-searchArea'} />                        
                                    );
                                  })
                                }
                              </datalist>
                          </span>
                        </div>
                        <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
                          <span className="blocking-span">
                            <label className="floating-label">State</label>
                            <input type="text" autoComplete="on" list="autoStateInUser" className="form-control inputText state" ref="state" name="state" onInput={this.getTextValueWhenType.bind(this)}/>
                            <datalist className="autocomplete" id="autoStateInUser">
                              { 
                                this.state.searchArray.map((searchDetails, index)=>{
                                  return(
                                    <option value={searchDetails} key={searchDetails + '-searchState'} />                        
                                  );
                                })
                              }
                            </datalist>
                          </span>

                        </div>
                        <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
                          <span className="blocking-span">
                            <label className="floating-label">Country</label>
                            <input type="text" autoComplete="on" list="autoContactInUser" className="form-control inputText country" ref="country" name="country" onInput={this.getTextValueWhenType.bind(this)}/>
                              <datalist className="autocomplete" id="autoContactInUser">
                                { 
                                  this.state.searchArray.map((searchDetails, index)=>{
                                    return(
                                      <option value={searchDetails} key={searchDetails + '-searchState'} />                        
                                    );
                                  })
                                }
                              </datalist>
                          </span>
                        </div>
                        <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
                          <span className="blocking-span">
                            <label className="floating-label">Pincode</label>
                            <input type="text" className="form-control inputText pincode" ref="pincode" name="pincode"/>
                          </span>
                        </div>
                      </div>


                    <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                        <input className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" type="submit" value="REGISTER"/>
                     </div> 

                    </div> 
                  </form>
                </div>  
          </div>
        </div>
       </div>
     </div>
     </section>
      );
    }else{
      return <span>loading</span>
    }

  } 
}
export default CreateUserContainer = withTracker(props => {
  var handle = Meteor.subscribe("services");
  var userSubscribehandle = Meteor.subscribe('userfunction');
  var rolehandle = Meteor.subscribe("rolefunction");
  
  
  var loading = !handle.ready() && !userSubscribehandle.ready() && !rolehandle.ready(); 


  var allusers = Meteor.users.find({"roles":{$nin:["user","superAdmin","admin","companyuser"]}}).fetch();
  var allRoles = Meteor.roles.find({}).fetch();   

  
  if(allusers.length >0){
    var newArr = [];
    // console.log("allusers: ",allusers);
    for(var i=0;i<allusers.length;i++){
      
      var currentText = allusers[i].profile.firstname +" "+ allusers[i].profile.lastname;
      var reportName  = allusers[i].profile.firstname +" "+ allusers[i].profile.lastname;
      var userLen = allusers[i].roles;
      if(userLen){
        if(userLen.length){
          for(k=0;k<userLen.length;k++){
            if(userLen[k]!='backofficestaff'){
              currentText = userLen[k] +"("+currentText+")" ;
            }
          }
        }
      }
     
      newArr.push(currentText);
  }
    var roleArray = [];
    
  } else{
    var roleArray = [];
    newArr = [];
  }

 if(allRoles.length >0){
    for(var j=0;j<allRoles.length;j++){
      if((allRoles[j].name!="superAdmin") && (allRoles[j].name!= "user") && (allRoles[j].name!= "backofficestaff") && (allRoles[j].name!= "companyuser"))  {
        var rolevalue = allRoles[j].name;
        roleArray.push(rolevalue);
      }
    }
  }
    
    var roles =  allRoles;
    var userUniqueData=newArr;
    roleList = roleArray;
    var reporttoName = reportName;
    // console.log("userUniqueData",userUniqueData);
  return{
    loading,
    roles,
    newArr,
    userUniqueData,
    roleList,
    reporttoName
  }
})(CreateUser);