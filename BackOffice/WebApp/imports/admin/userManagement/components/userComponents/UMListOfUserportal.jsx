import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import UMAddRolRowUser from './UMAddRolRowUser.jsx';
import UMDelRolRowUser from './UMDelRolRowUser.jsx';
import UMSelectRoleUserportal from './UMSelectRoleUserportal.jsx';
import UMUserportal from './UMUserportal.jsx';

export default class UMListOfUserportal extends TrackerReact(Component) {

	constructor(){
		super();
		this.state = {
			subscription : {
				"rolesData" : Meteor.subscribe('rolefunction'),
				"usersData" : Meteor.subscribe('userfunction'),
			}
		}
	}
  'adminUserActions'(event) {
			event.preventDefault(); 

			var selectedValue        = this.refs.userListDropdown.value;
			var keywordSelectedValue = selectedValue.split('$')[0];
			var role                 = selectedValue.split('$')[1];
			var checkedUsersList     = [];

 
			$('input[name=userCheckbox]:checked').each(function() {
				checkedUsersList.push(this.value);
			});



			switch(keywordSelectedValue){
			  case '-':
			    console.log('selectedValue:' + selectedValue);
			    break;

			  case 'block_selected':
			    Meteor.call('blockSelectedUser', checkedUsersList);
			    break;

			  case 'active_selected':
			    Meteor.call('activeSelectedUser', checkedUsersList);
			    break;

			  case 'cancel_selected':
			    // var confirmDelete = window.confirm("Are you sure you want to remove this record?"+ Meteor.users.find({'_id' : checkedUsersList}));
			    // if(confirmDelete) {
			    //   Meteor.call('deleteSelectedUser', checkedUsersList);
			    // }

			    var users = Meteor.users.find({"_id":{ $in: checkedUsersList } }).fetch();

			    if(users){
			    	var userNames = '';
			    	// console.log(JSON.stringify(users,null,4));
			    	for(var k=0;k<users.length;k++){
			    		userNames += users[k].profile.firstname +' '+ users[k].profile.lastname + '\n';
			    	}

					swal({
					            title             : 'Are you sure? You will not be able to recover below users again!',
					            // text              : 'You will not be able to recover this users again!',
					            html              : userNames,
					            type              : 'warning',
					            showCancelButton  : true,
					            confirmButtonColor: '#dd6b55',
					            cancelButtonColor : '#999',
					            confirmButtonText : 'Yes!',
					            cancelButtonText  : 'No',
					            closeOnConfirm    : false
					        }, function() { 
					        				Meteor.call('deleteSelectedUser', checkedUsersList);
					        				swal.closeModal();
					        			  }
					    );

			    }



			    break;

			  case 'add':
			    Meteor.call('addRoleToUser', role, checkedUsersList);
			    break;

			  case 'remove':
			    Meteor.call('removeRoleFromUser', role, checkedUsersList);
			    break;

			}

	}

	rolesListData(){
		var roleSetArray = [];
		var roles =  Meteor.roles.find({"name":{ $nin: ["superAdmin","backofficestaff","companyuser"] }, "insertedFrom":{ $nin: ["backOffice"] } }).fetch();
		if(roles){
			return roles;
		}else{
			return roleSetArray;
		}
	}

	adminRolesListData(){
		var roleSetArray = [];
		var roles =  Meteor.roles.find({"name":{ $in: ["admin"] }, "insertedFrom":{ $nin: ["backOffice"] } }).fetch();
		if(roles){
			return roles;
		}else{
			return roleSetArray;
		}
	}


	usersListData(){
    var roleSetArray      = [];
    var roleSetVar        = Session.get('roleSet');
    var activeBlockSetVar = Session.get('activeBlockSet');
    if(roleSetVar || activeBlockSetVar){ 

      if((roleSetVar == "all" && !activeBlockSetVar)       || 
         (roleSetVar == "all" && activeBlockSetVar == '-') || 
         (!roleSetVar && activeBlockSetVar == '-')         ||
         (roleSetVar == '-' && activeBlockSetVar == '-'))
      {
        return Meteor.users.find({"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } });
      }else if((roleSetVar == "all" && activeBlockSetVar) || 
               (roleSetVar == "-" && activeBlockSetVar)   || 
               (!roleSetVar && activeBlockSetVar))
      {
        return Meteor.users.find({"profile.status": activeBlockSetVar,"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } });
      }else if((roleSetVar && activeBlockSetVar == '-') || 
               (roleSetVar && !activeBlockSetVar))
      {
        return Meteor.users.find({"roles":{ $nin: ["superAdmin"], $in: [roleSetVar]} });
      }else if(roleSetVar && activeBlockSetVar){
        return Meteor.users.find({"profile.status": activeBlockSetVar,"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"], $in: [roleSetVar]} });
      }else{
        return Meteor.users.find({"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } });
      }
         
    }else{
    	console.log("users :",Meteor.users.find({"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } }).fetch());
      return Meteor.users.find({"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } }).fetch();
    }
	}
 

	'roleFilter'(event) {
	    event.preventDefault(); 
	    var selectedValue = this.refs.roleListDropdown.value;
	    Session.set("roleSet", selectedValue);
	}

	'activeBlockRoles'(event) {
	    event.preventDefault();
	    var selectedValue = this.refs.blockActive.value;
	    Session.set("activeBlockSet", selectedValue);
	}
	componentDidMount() {

	}
  componentWillUnmount(){
  }
	

  checkAll(event) {
    // event.preventDefault();
    if(event.target.checked){
      $('.userCheckbox').prop('checked',true);
    }else{
      $('.userCheckbox').prop('checked',false);
    }
  }

	render(){
    return(
			<section className="content-wrapper">
	        <div className="content">
	          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
	            <div className="box box-primary">
		            <div className="box-header with-border">
		            <h3 className="box-title">ALL USERS</h3>
		            </div>
		            <div className="box-body"> 
								<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
									
									<label className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Action</label>
									<select className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 userListDropdown actionSelect" ref="userListDropdown" name="userListDropdown" onChange={this.adminUserActions.bind(this)}>
										<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="-" name="userListDDOption">-- Select --</option>	
										<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="block_selected" name="userListDDOption">Block Selected</option>	
										<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="active_selected" name="userListDDOption">Active Selected</option>
										<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="cancel_selected" name="userListDDOption">Cancel Selected Acccounts</option>	
										{ this.rolesListData().map( (rolesData)=>{
											return <UMAddRolRowUser key={rolesData._id} roleDataVales={rolesData}/>
										  }) 
										}	
										{ this.rolesListData().map( (rolesData)=>{
											return <UMDelRolRowUser key={rolesData._id} roleDataVales={rolesData}/>
										  })  
										}
									</select>
								</div> 

								<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
									
									<label className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 selectTitle noLRPad">Select Role</label>
									<select className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 userListDropdown roleFilter noLRPad" ref="roleListDropdown" name="roleListDropdown" onChange={this.roleFilter.bind(this)}>
										<option value="-" name="roleListDDOption">-- Select --</option>
										<option value="all" name="roleListDDOption">Show All</option>		
										{ this.rolesListData().map( (rolesData)=>{
											return <UMSelectRoleUserportal key={rolesData._id} roleDataVales={rolesData}/>
										  }) 
										}	
									</select>
								</div>
								<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">							
									<label className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 selectTitle noLRPad">Select Block & Active Roles</label>
									<select className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 userListDropdown activeBlockRoles noLRPad" ref="blockActive" name="blockActive" onChange={this.activeBlockRoles.bind(this)}>
										<option value="-" name="roleListDDOption">-- Select --</option>	
										<option value="Blocked" name="roleListDDOption">Blocked</option>	
										<option value="Active" name="roleListDDOption">Active </option>	
									</select>
								</div>
						  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive noLRPad outerListOfUsersTable">
								 <table className="table table-bordered table-striped table-hover myTable dataTable no-footer col-lg-10 col-md-10 col-sm-10 col-xs-12">
									<thead className="table-head umtblhdr">
									<tr className="umtableheader info">
										<th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1 "> <input type="checkbox" className="allSelector" name="allSelector" onChange={this.checkAll.bind(this)}/> </th>
										<th className="umHeader col-lg-4 col-md-4 col-sm-6 col-xs-6"> Username </th>
										<th className="umHeader col-lg-2 col-md-2 hidden-xs hidden-sm"> Status </th>
										<th className="umHeader col-lg-2 col-md-2 col-sm-2 col-xs-2"> Roles </th>
										<th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Member for </th>
										<th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Last Access </th>
										<th className="umHeader col-lg-1 col-md-1 col-sm-3 col-xs-3"> Operations </th>
									</tr>
									</thead>
									<tbody className="noLRPad">
								   { this.usersListData().map((usersData,index)=>{
											return <UMUserportal key={index} usersDataValues={usersData}/>
										  }) 
										}
										{/*!this.props.loading ?
											 this.props.userArray.length > 0 ?
											    this.props.userArray.map((usersData,index)=>{
									      		return <UMUserportal key={index} usersDataValues={usersData}/>
											    })
											  :
											  <tr className="col-lg-12">
	                          <div className="col-lg-12">
	                            <label className ="nodata">Nothing To Dispaly</label>
	                          </div>
	                      </tr>
											:
											<tr className="col-lg-12">
                        <div className="col-lg-12">
                          <label className ="nodata">loading..</label>
                        </div>
                    </tr>
                      
										*/}
									</tbody> 
								</table>
							</div>
					</div>
				</div>
			  </div>
			</div>

			</section>
	  );
	} 
}
// UMListOfUserportalContainer = withTracker(({params})=>{   
//     const postHandle = Meteor.subscribe('userfunction');
//     const loading     = !postHandle.ready();
//     var roleSetArray      = [];
//     var roleSetVar        = Session.get('roleSet');
//     var activeBlockSetVar = Session.get('activeBlockSet');
//     var userArray         = [];
//     if(roleSetVar || activeBlockSetVar){ 

//       if((roleSetVar == "all" && !activeBlockSetVar)       || 
//          (roleSetVar == "all" && activeBlockSetVar == '-') || 
//          (!roleSetVar && activeBlockSetVar == '-')         ||
//          (roleSetVar == '-' && activeBlockSetVar == '-'))
//       {
//       	userArray = Meteor.users.find({"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } });
//       }else if((roleSetVar == "all" && activeBlockSetVar) || 
//                (roleSetVar == "-" && activeBlockSetVar)   || 
//                (!roleSetVar && activeBlockSetVar))
//       {
//         userArray = Meteor.users.find({"profile.status": activeBlockSetVar,"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } });
//       }else if((roleSetVar && activeBlockSetVar == '-') || 
//                (roleSetVar && !activeBlockSetVar))
//       {
//         userArray = Meteor.users.find({"roles":{ $nin: ["superAdmin"], $in: [roleSetVar]} });
//       }else if(roleSetVar && activeBlockSetVar){
//         userArray = Meteor.users.find({"profile.status": activeBlockSetVar,"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"], $in: [roleSetVar]} });
//       }else{
//         userArray = Meteor.users.find({"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } });
//       }
         
//     }else{
//     	console.log("users :",Meteor.users.find({"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } }).fetch());
//       userArray = Meteor.users.find({"roles":{ $nin: ["superAdmin","backofficestaff","companyuser"] } }).fetch();
//     }

//     return {
//         loading, 
//         userArray,
//     };   	

  
// })(UMListOfUserportal);

// export default UMListOfUserportalContainer;