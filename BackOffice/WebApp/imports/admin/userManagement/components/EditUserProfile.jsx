import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }      from 'meteor/ostrio:flow-router-extra';
import {Services} from '/imports/admin/adminDashboard/serviceManagement/api/Services.js';
import { Location } from '/imports/admin/adminDashboard/masterData/location/api/ManageLocation.js';

class EditUserProfile extends TrackerReact(Component){
	constructor(props) {
	  super(props);  
	  var userId       =  this.props.post._id;
	  if(this.props.post){
		  if(this.props.post.profile){
			  this.state = {
			    firstname     : this.props.post.profile.firstname,
			    lastname      : this.props.post.profile.lastname,
			    username      : this.props.post.username, 
			    mobNumber     : this.props.post.profile.mobNumber,
			    email         : this.props.post.email,
			    userProfile   : this.props.post.profile.userProfile,
			    servicesName  : this.props.post.profile.servicesName,
          reportToRole  : this.props.post.profile.reportToRole+"("+this.props.post.profile.reportToName+")",
          reportToName  : this.props.post.profile.reportToName,
          state         : this.props.post.profile.state,
			    country       : this.props.post.profile.country,
			    area          : this.props.post.profile.area, 
			    pincode       : this.props.post.profile.pincode,
			    newpassword   : '',
			    reenterpassword : '',
	        searchArray   : [],
			    subscription  : {
									"parkDataSlots" : Meteor.subscribe('parkDataSlots',userId),
									"userAddrData"  : Meteor.subscribe('userAddrData',userId),
									"userParkingSlotsData"  : Meteor.subscribe('userParkingSlotsData'),
									"userAddrData"  : Meteor.subscribe('userAddresses'),
								},
			  };
			}
			if (this.props.post.roles) {
				this.state = {
      	  role : this.props.post.roles[1],
      	};
      }
	  }else{
		  this.state = {
		    data          : '',
		    firstname     : '',
		    lastname      : '',
		    username      : '',
		    mobNumber     : '',
		    email         : '',
		    userProfile   : '',
		    servicesName  : [],
        reportToRole  : '',
        reportToName  : '',
        role          : '',
        state         : '',
	      country       : '',
	      area          : '', 
	      pincode       : '',
	      newpassword   : '',
			  reenterpassword : '',
	      searchArray   : [],
		  };	  	
	  }
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	}

  componentWillReceiveProps(nextProps) {
  	if(!nextProps.loading){	
    	if(nextProps.post){	
	    	if(nextProps.post.profile){	
	    		// console.log("this.props.post.profile",nextProps.post.profile);

	            this.setState({
	                firstname  : nextProps.post.profile.firstname,
	                lastname   : nextProps.post.profile.lastname,
	                userProfile: nextProps.post.profile.userProfile,
	                username   : nextProps.post.username,
	                mobNumber  : nextProps.post.profile.mobNumber,
	                email      : nextProps.post.emails[0].address,
	                servicesName : nextProps.post.profile.servicesName,
                  reportToRole : nextProps.post.profile.reportToRole+"("+nextProps.post.profile.reportToName+")",
                  reportToName: nextProps.post.profile.reportToName,
                  state         : nextProps.post.profile.state,
						      country       : nextProps.post.profile.country,
						      area          : nextProps.post.profile.area, 
						      pincode       : nextProps.post.profile.pincode,
						      searchArray   : [],

	            })
	        }
	        if (nextProps.post.roles) {
	        	 this.setState({
	        	  role : nextProps.post.roles[1],
	        	    })
	        }
        }
      }

          this.handleChange = this.handleChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this)
  }


	handleSubmit(event) {
		if($("#editUserForm").valid()){
		    event.preventDefault();
		    var userId          = this.props.post._id;
		    // console.log("userId",userId);
		    if(userId){
		    	var id            = userId;
		    }else{
		    	var id            = Meteor.userId();
		    }
	      	var reportrefValue = this.refs.reportToRef.value;      
	        if(reportrefValue!="" && reportrefValue!= "-- Select --"){
		        var splitValue   =  reportrefValue.split("(");
		        if(splitValue){
		        	if(splitValue[0]){
				        var reportToRole = splitValue[0];
		        	}
		        	if(splitValue[1]){
				        var reportToName = splitValue[1].slice(0, -1);
		        	}
		        }
	        }else{ 
		        var reportToName = '';
		        var reportToRole = ''; 
		    }

		    if(this.refs.servicesRef.value !='-- Select --'){
	          var serviceNm = this.refs.servicesRef.value;
	        }else{
	          var serviceNm = "";
	        }
	      // console.log("reportrefValue :"+reportrefValue);
	      if(this.state.role == "field expert" || this.state.role == "ba"){
	      	    var formValues = {
	                firstname  : this.refs.editFirstName.value,
	                lastname   : this.refs.editLastName.value,
	                mobNumber  : this.refs.editContactNum.value,
	                servicesName     : serviceNm,
	                area             : this.refs.area.value,
	                state            : this.refs.state.value,
	                country          : this.refs.country.value,
	                pincode          : this.refs.pincode.value,
	                reportToRole     : reportToRole,
	                reportToName     : reportToName,
		        }
	        }else{
	      	    var formValues = {
	                firstname  : this.refs.editFirstName.value,
	                lastname   : this.refs.editLastName.value,
	                mobNumber  : this.refs.editContactNum.value,
	                servicesName     : serviceNm,
	                area             : '',
	                state            : '',
	                country          : '',
	                pincode          : '',
	                reportToRole     : reportToRole,
	                reportToName     : reportToName,
		        }
	        }

	        if(this.refs.roleRef.value !='-- Select --'){
	        	var assignedrole = this.refs.roleRef.value; 
	        }else{
	        	var assignedrole = '';
	        }
		    var password        = this.refs.newpassword.value;
		    var passwordConfirm = this.refs.reenterpassword.value;
		   if (password) {
		   	// console.log("password :"+password+" passwordConfirm: "+passwordConfirm);
	      //Check password is at least 6 chars long
	      var isValidPassword = function(password, passwordConfirm) {
	        if (password === passwordConfirm) {
	          return password.length >= 6 ? true : swal({
	            title: "Password should be at least 6 characters long. ",
	            text: "Please try again!",
	            timer: 1700,
	            showConfirmButton: false,
	            type: "error"
	          });
	        }else{
	          return swal({
	            title: "Password does not match.",
	            text: 'Please try again!',
	            showConfirmButton: true,
	            type: 'error'
	          }); //End of error swal
	        } //End of else
	      }
	      if (isValidPassword(password, passwordConfirm)) { 
		        Meteor.call("resetPasswordUsingotp",id,password,(err,result)=> {
		          if (err) {
		            console.log('We are sorry but something went wrong.');
		          }else {	
		            // console.log("Password Changes Successfully");	 
						    Meteor.call('editMyProfileData',formValues, id,assignedrole, function(error,result){
						    	if(error){
						    		console.log("error"+error);
						    	}else{
						    		 swal('Profile updated Successfully!');
							    		var path = "/admin/UMListOfUsers";
						          FlowRouter.go(path);
						    	}
						    });          
		          }
		        });
		      }
		   }else{
		   	Meteor.call('editMyProfileData',formValues, id,assignedrole, function(error,result){
		    	if(error){
		    		console.log("error"+error);
		    	}else{
		    		 swal('Profile updated Successfully!');
			    		var path = "/admin/UMListOfUsers";
		          FlowRouter.go(path);
		    	}
		    });
		   }
		    
		}else{
			if($(event.target).parent().parent().find('.error').val() == ''){
			  $(event.target).parent().parent().find('.error').siblings('label.error').text('This field is required.');
			}
			$(event.target).parent().parent().find('.error:first').focus();
		}
	}

	handleChange(event){
	  	const target = event.target;
	  	const name   = target.name;
	  	this.setState({
	  		[name]: event.target.value,
	  	});
	}


	componentDidMount(){
		$.validator.addMethod("regCS1", function(value, element, regexpr) {          
	        return regexpr.test(value);
		}, "It should only contain letters.");
		$.validator.addMethod("regCS2", function(value, element, regexpr) {          
			return regexpr.test(value);
		}, "Please enter a valid email id.");
		$.validator.addMethod("regCS3", function(value, element, regexpr) {          
			return regexpr.test(value);
		}, "Please enter a valid mobile number.");

		$("#signUpUser").validate({
			rules: {
			  firstname: {
			    required: true,
			    regCS1: /^[a-zA-Z ]+$/,
			  },
			  lastname: {
			    required: true,
			    regCS1: /^[a-zA-Z ]+$/,
			  },
			  username: {
			    required: true,
			    regCS2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
			  },
			  mobNumber: {
			    required: true,
			    regCS3: /^\+?\d+$/,
			  }
			}
		});

	    $("html,body").scrollTop(0);
			$('.uneditable').prop('disabled', true);
			if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
	     var adminLte = document.createElement("script");  
	     adminLte.type="text/javascript";  
	     adminLte.src = "/js/adminLte.js";  
	     $("body").append(adminLte);  
	    }
	}
 componentWillMount() {
    // if (!!!$("link[href='/css/dashboard.css']").length > 0) {
    //   var dashboardCss = document.createElement("link");
    //   dashboardCss.type = "text/css"; 
    //   dashboardCss.rel = "stylesheet";
    //   dashboardCss.href = "/css/dashboard.css"; 
    //   document.head.append(dashboardCss);
    // }
  }
  componentWillUnmount(){  
     $("script[src='/js/adminLte.js']").remove(); 
     // $("link[href='/css/dashboard.css']").remove(); 
  }

  onInput(event){
	  this.setState({firstname: event.target.value})
	}

	uploadProfileImg(event){  
	    event.preventDefault();
	    let self = this;
	     this.setState({isUploading: true});
	     //  this.calculateProgress();
	    if (event.currentTarget.files && event.currentTarget.files[0]) {
	        var file = event.currentTarget.files[0];
	         // console.log("file",file);
          var userId = this.props.post._id;
          // console.log("userId",userId);
	        if (file) {
	        	var userFileName = file.name;
            var userFileExt  = userFileName.split('.').pop();
            var fileSize     = file.size; 
            var size         = 1073741824;

            if (userFileExt == "png" || userFileExt == "jpg" || userFileExt == "jpeg") {
              if (fileSize < size) {
	              addUserToS3Function(userId,file,self);
	            }else{
	              swal("File not uploaded!","Document size limit is upto 1gb.","error");
	            }
            }else{
            	swal("Invalid file type!","Please upload .png,.jpeg,.jpg files","error");
            }
	        }
	    }
	}

	uploadProfileClick(event){
		event.preventDefault();
		$('.useruploadImg').click();	
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
			   	if(this.props.post){       
				   	if(this.props.post.profile){       
					   	return (
						  	<section className="content-wrapper">
						        <div className="content">
						          <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 ">
						            <div className="box box-primary">
							            <div className="box-header with-border">
							            	<h4 className="box-title">EDIT PROFILE</h4>
							            </div>
										<div className="box-body">
											<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
												<form id="editUserForm">
													<div className="col-lg-10 col-sm-10 col-xs-10 col-md-10">
														<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
															<label className="floating-label">First Name<span className="astrikReq">*</span></label>
															<span className="blocking-span">	
																<input type="text" value={this.state.firstname} onChange={this.handleChange} className="inputMaterial form-control inputText required" ref="editFirstName" name="firstname" pattern="[a-zA-Z][a-zA-Z ]+" title="Only alphabets are allowed!"/>
															</span>	
														</div>
														<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
														  <label className="floating-label">Last Name<span className="astrikReq">*</span></label>
															<span className="blocking-span">
																<input type="text" value={this.state.lastname} onChange={this.handleChange} className="inputMaterial form-control inputText required" ref="editLastName" name="lastname" pattern="[A-Za-z]+" title="Only alphabets are allowed!"/>
															</span>								
														</div>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">	
															<label className="disableLabel">Username/Email<span className="astrikReq">*</span></label>
															{/*<span className="blocking-span">	*/}									
																<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="disableInput inputMaterial form-control inputText required" ref="editUsername" name="username" title="Please enter a valid Email Id!" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"/>
																{/*<span className="floating-label">Username/Email</span>*/}
															{/*</span>*/}
															
														</div>
															
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">
														  <label className="floating-label">Mobile Number<span className="astrikReq">*</span></label>
															<span className="blocking-span">
																<input type="text" value={this.state.mobNumber} onChange={this.handleChange} className="inputMaterial form-control inputText required" ref="editContactNum" name="mobNumber" pattern="^\+?\d+$" minLength="10" title="Please enter numbers only!"/>
															</span>
																							
														</div> 
														<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
												   			<span className="blocking-span">
												   			<label className="floating-label">Assign Service</label>
                								<select className="form-control allProductSubCategories" aria-describedby="basic-addon1" name="servicesName" onChange={this.handleChange.bind(this)} ref="servicesRef" value={this.state.servicesName != "" ? this.state.servicesName : "-- Select --" }>
                                    <option disabled="disabled" selected={true}>-- Select --</option>
		                                   { this.props.services.length > 0 ?
											                      <option value="All Services">All Services</option>
											                    :
											                      ""
											                  }
			                                  { this.props.services.length>0 ?
			                                    this.props.services.map( (data, index)=>{
			                                      return (
			                                          <option key={index}>{data.serviceName}</option>
			                                      );
			                                  })
			                                  :
	                                  ""
	                                  }
		                            </select>
															</span>
													    </div>
				                      <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
												   			<span className="blocking-span">
												   			  <label className="floating-label">Assign Role</label>
				                           <select className="form-control allProductSubCategories" aria-describedby="basic-addon1" name="role" onChange={this.handleChange.bind(this)} ref="roleRef" value={this.state.role != "" ? this.state.role : "-- Select --" }>
                                            <option disabled="disabled" selected={true}>-- Select --</option>
				                                  { 
				                                    this.props.roleList.length > 0 ?
				                                    this.props.roleList.map( (data, index)=>{
				                                      return (
				                                          <option key={index}>{data}</option>
				                                      );
				                                  })
				                                  :
				                                  ""				                              
				                                  }
				                           </select>
															</span>
													    </div>
								              <div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
														    <span className="blocking-span">
															  <label className="floating-label">Reporting To</label>
                                <select className="form-control allProductSubCategories" aria-describedby="basic-addon1" name="reportToRole" ref="reportToRef" onChange={this.handleChange} value={this.state.reportToRole != "()" ? this.state.reportToRole : "-- Select --"}>
                                  <option disabled="disabled" selected={true}>-- Select --</option>
                                  { 
                                    this.props.userUniqueData.length>0 ?
                                    this.props.userUniqueData.map( (data, index)=>{
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
													    </div>
													    <div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
														    <label className="floating-label">New Password</label>
														  	<span className="blocking-span">
															  	<input type="password" value={this.state.newpassword} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="newpassword" name="newpassword" />
															  </span>								
														  </div>
															<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
															  <label className="floating-label">Re-enter Password</label>
																<span className="blocking-span">
																	<input type="password" value={this.state.reenterpassword} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="reenterpassword" name="reenterpassword" />
																</span>								
															</div>
													    {this.state.role == "field expert" || this.state.role == "ba" ?
							                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding ">
				                        	<div className="form-group col-lg-4 col-md-4 col-xs-12 col-sm-12 inputContent">
			                            		<span className="blocking-span">
				                            		<label className="floating-label">Area</label> 
				                            		<input type="text" autoComplete="off" list="autoAreaInUser" className="form-control inputText area" ref="area" name="area" value={this.state.area} onChange={this.handleChange.bind(this)}  onInput={this.getTextValueWhenType.bind(this)}/>
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
					                            <input type="text" autoComplete="off" list="autoStateInUser" className="form-control inputText state" ref="state" name="state" value={this.state.state} onChange={this.handleChange.bind(this)}  onInput={this.getTextValueWhenType.bind(this)}/>
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
					                            <input type="text" autoComplete="off" list="autoContactInUser" className="form-control inputText country" ref="country" name="country" value={this.state.country} onChange={this.handleChange.bind(this)}  onInput={this.getTextValueWhenType.bind(this)}/>
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
					                            <input type="text" className="form-control inputText pincode" ref="pincode" name="pincode" value={this.state.pincode} onChange={this.handleChange.bind(this)} />
					                          </span>
							                  </div>
									              </div>
									              :
																	""
														  }

													</div>

													<div className="col-lg-2 col-sm-2 col-xs-2 col-md-2">
														<img src={this.state.userProfile} className="img-responsive"/>
														<input name="userPic" ref="userPic" onChange={this.uploadProfileImg.bind(this)} className="useruploadImg col-lg-12 col-md-12 col-sm-12 col-xs-12" type="file" />
														<button onClick={this.uploadProfileClick.bind(this)} className="uploaduserPic col-lg-12 col-md-12 btn btn-default">Update Photo</button>
													</div>
													<br/>
												</form>
											</div>
											<br/>
											<div className="col-lg-4 col-sm-12 col-xs-12 col-md-12 pull-right userProfileEditBtn">
												<button onClick={this.handleSubmit.bind(this)} className="btn btn-primary pull-right">Update Profile</button>
											</div>
										</div>	
									</div>
								</div>
							</div>
						</section>
					);
				}
			}
		}else{
			return (<div className="col-sm-12 col-xs-12 loadingImg"><img src="images/loading.gif" alt="loading"/></div>);
		}
	} 
}

EditUserContainer = withTracker(({params})=>{
    var userId       = FlowRouter.getParam('id');
    if(userId){
    	var id       = userId;
    }else{
    	var id       = Meteor.userId();
    }
    const postHandle = Meteor.subscribe('userData',id);
    var handle       = Meteor.subscribe("services");
	  var rolehandle   = Meteor.subscribe("rolefunction");
	  var userSubscribehandle = Meteor.subscribe('userfunction');
    const post       = Meteor.users.findOne({ '_id': id })||{};
    
    var services     = Services.find({}).fetch(); 
    var allusers     = Meteor.users.find({"roles":{$nin:["user","superAdmin","admin","companyuser"]}}).fetch();
    // console.log("allusers",allusers);
	  var allRoles     = Meteor.roles.find({}).fetch();
	  const loading    = !postHandle.ready() && !handle.ready()  && !rolehandle.ready() && !userSubscribehandle.ready();
         
  	if (allusers) {
		  if(allusers.length >0){
		    var newArr = [];
		    // console.log("allusers: ",allusers);
		    for(var i=0;i<allusers.length;i++){
		      
		      var currentText = allusers[i].profile.firstname +" "+ allusers[i].profile.lastname;
		      var reportName  = allusers[i].profile.firstname +" "+ allusers[i].profile.lastname;
		      var userLen = allusers[i].roles;
		      if(allusers[i]._id!=FlowRouter.getParam('id')){
			      if(userLen.length){
			        for(k=0;k<userLen.length;k++){
			        	if(userLen[k]!='backofficestaff'){
			            	currentText = userLen[k] +"("+currentText+")" ;
			        	}
			        }
			      }
			     
			      newArr.push(currentText);
		      }
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
   	}
    // console.log("userUniqueData",userUniqueData);
    if(post){
	    return {
	        loading,
	        services, 
	        post,
	        roles,
			    newArr,
			    userUniqueData,
			    roleList,
			    reporttoName
	    };   	
    } 
  
})(EditUserProfile);

export default EditUserContainer;
