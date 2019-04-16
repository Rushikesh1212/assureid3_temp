import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data'; 
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

export default class EditCompanyEmpData extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={ 
      "subscription" : {
      } 
    };
  }
  componentWillReceiveProps() {
  }
  componentDidMount() {
  }
  empVerifDelete(event){
    event.preventDefault();
    var id = $(event.currentTarget).attr('data-id');
    var index = parseInt($(event.currentTarget).attr('data-index'));
    Meteor.call("deleteUserFromComapnyDetails",id,index,function(error,result){
        if(error){
          console.log(error.reason);
        }else{
          $('#deleteSelEmpVerif-'+index).modal('hide');
          // $('#deleteselectedUser-'+index).modal('hide');
          // swal("Done","Deleted successfully!"); 
        }
    });
    $('.modal-backdrop').hide();
    $('.modal-open').css('overflow','auto');
  }
  
  openEmpVerifModal(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $(event.target).parent().siblings('#'+idVal).addClass('in');
    $(event.target).parent().siblings('#'+idVal).css('display','block');
  }
  closeEmpVerifModal(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $(event.target).parent().parent().parent().parent().parent('#'+idVal).removeClass('in');
    $(event.target).parent().parent().parent().parent().parent('#'+idVal).css('display','none');
    $('.modal-backdrop').hide();
    $('.modal-open').css('overflow','auto');

  }
  render() {
    return (
      <div className="paddingLeftVerif">
        <td>
          <i className="fa fa-trash text-danger uniqueCursorPointer" title="Delete Record" data-toggle="modal" data-target={"deleteSelEmpVerif-"+this.props.arrayIndex} onClick={this.openEmpVerifModal.bind(this)}></i>
        </td>
       
        <div className="modal fade" id={"deleteSelEmpVerif-"+this.props.arrayIndex} role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <button type="button" className="close text-right" data-target={"deleteSelEmpVerif-"+this.props.arrayIndex} onClick={this.closeEmpVerifModal.bind(this)}>&times;</button>
                </div>
                <p className="text-left">Do you want to delete this data?</p>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" onClick={this.empVerifDelete.bind(this)} data-index={this.props.arrayIndex} data-id={this.props.tempOrderId}>Yes</button>
                  &nbsp;&nbsp;
                  <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-target={"deleteSelEmpVerif-"+this.props.arrayIndex} onClick={this.closeEmpVerifModal.bind(this)}>No</button>
                </div>
              </div>
              <div className="modal-footer">
              </div>
            </div>  
          </div>
        </div>
      </div> 
    );
  }
}