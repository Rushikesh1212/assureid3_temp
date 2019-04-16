import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }  from 'meteor/ostrio:flow-router-extra';
export default class OtherInfoForm extends TrackerReact(React.Component){
  constructor(props){
    super(props);
    this.state ={
      'otherBusinessInvolving' : this.props.basicValues.otherBusinessInvolving,
      'dismissedFromService'   : this.props.basicValues.dismissedFromService,
      'criminalOffence'        : this.props.basicValues.criminalOffence,
      'civilJudgments'         : this.props.basicValues.civilJudgments,
      "subscription" : {
      }
    };
     this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount(){
  } 
  componentWillUnmount(){
  }
  handleChange(event){
   event.preventDefault();
   const target = event.target;
   const name   = target.name;
   this.setState({
    [name]: event.target.value,
   });
  }
  submitOtherInfo(event){
    event.preventDefault(); 
    var id   = Meteor.userId();
    var otherInformation = {
      "otherBusinessInvolving"  : this.refs.otherBusinessInvolving.value,
      "dismissedFromService"    : this.refs.dismissedFromService.value,
      "criminalOffence"         : this.refs.criminalOffence.value,
      "civilJudgments"          : this.refs.civilJudgments.value,
    }

    if($('.noButton').hasClass('noDataButton') && !this.refs.otherBusinessInvolving.value){
      $('.noButton').parent().parent().siblings().find('textarea').addClass('error has-content');
      swal('Please fill the reason field.');
    }else{
      $('.noButton').parent().parent().siblings().find('textarea').removeClass('error');
    }
    if($('.noButton1').hasClass('noDataButton') && !this.refs.dismissedFromService.value){
      $('.noButton1').parent().parent().siblings().find('textarea').addClass('error has-content');
      swal('Please fill the reason field.');
    }else{
      $('.noButton1').parent().parent().siblings().find('textarea').removeClass('error');
    }
    if($('.noButton2').hasClass('noDataButton') && !this.refs.criminalOffence.value){
      $('.noButton2').parent().parent().siblings().find('textarea').addClass('error has-content');
      swal('Please fill the reason field.');
    }else{
      $('.noButton2').parent().parent().siblings().find('textarea').removeClass('error');
    }
    if($('.noButton3').hasClass('noDataButton') && !this.refs.civilJudgments.value){
      $('.noButton3').parent().parent().siblings().find('textarea').addClass('error has-content');
      swal('Please fill the reason field.');
    }else{
      $('.noButton3').parent().parent().siblings().find('textarea').removeClass('error');
    }

    if(!$('textarea').hasClass('error')){
      Meteor.call('insertOtherInformation',id,otherInformation,function (error,result) {
        if(error){
          console.log(error.reason);
        }else{
          FlowRouter.go('/profileForms/menu6');
          $('html, body').animate({
            'scrollTop' : $(".profileBody").position().top
          });
          $('#menu5').removeClass('in active');
          $('.menu5').removeClass('active');
          $('#menu6').addClass('in active');
          if($('textarea').hasClass('error')){
            $('textarea').removeClass('error has-content');
          }
        }
      });
    }

    if($('.yesButton').hasClass('noDataButton') && $('.yesButton1').hasClass('noDataButton') && 
    $('.yesButton2').hasClass('noDataButton') && $('.yesButton3').hasClass('noDataButton')){
      Meteor.call('insertOtherInformation',id,otherInformation,function (error,result) {
       if(error){
          console.log(error.reason);
        }else{
          FlowRouter.go('/profileForms/menu6');
          $('html, body').animate({
            'scrollTop' : $(".profileBody").position().top
          });
          $('#menu5').removeClass('in active');
          $('.menu5').removeClass('active');
          $('#menu6').addClass('in active');
        }
      });
    }
  }
  inputEffect(event){
    event.preventDefault();
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      $(event.target).removeClass("has-content");
    }
  }
  yesReason(event){
    event.preventDefault();
    $(event.target).parent().parent().siblings().slideDown();
    $(event.target).removeClass('noDataButton');
    $(event.target).siblings().addClass('noDataButton');
    $(event.target).parent().parent().siblings().children().find('textarea').focus();
  }
  noReason(event){
    event.preventDefault();
    $(event.target).parent().parent().siblings().slideUp();
    $(event.target).parent().parent().siblings().children().find('textarea').val('');
    $(event.target).removeClass('noDataButton');
    $(event.target).siblings().addClass('noDataButton');
    if($('textarea').hasClass('error')){
      $('textarea').removeClass('error has-content');
    }
  }

  render(){
    return(
      <form className="otherInfoForm basicForm" id="otherInfoForm">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding yesReason">
            <div className="col-lg-8 col-md-8 col-sm-6 col-xs-6">
              <p>Are you currently engaged in any other business either as a proprietor, partner, officer, director, trustee, employee and agent or otherwise? If yes, please give details.</p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <button type="button" className={this.state.otherBusinessInvolving ? "btn btn-info yesButton" : "btn btn-info noDataButton yesButton"} onClick={this.yesReason.bind(this)}>Yes</button>
              <button type="button" className={this.state.otherBusinessInvolving ? "btn btn-info noDataButton noButton" : "btn btn-info noButton"} onClick={this.noReason.bind(this)}>No</button>
            </div>
          </div>
          <div className={this.state.otherBusinessInvolving ? "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12" : "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 otherInfoFormGroup"}>
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-info" aria-hidden="true"></i></span>
              <textarea rows="2" className={this.state.otherBusinessInvolving ? "effect-21 form-control loginInputs otherBusinessInvolving has-content" : "effect-21 form-control loginInputs otherBusinessInvolving"} id="otherBusinessInvolving" name="otherBusinessInvolving" ref="otherBusinessInvolving" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.otherBusinessInvolving}></textarea>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding yesReason">
            <div className="col-lg-8 col-md-8 col-sm-6 col-xs-6">
              <p>Have you ever been dismissed from the services of any previous employer(s)? If yes, please give details.</p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <button type="button" className={this.state.dismissedFromService ? "btn btn-info yesButton1" : "btn btn-info noDataButton yesButton1"} onClick={this.yesReason.bind(this)}>Yes</button>
              <button type="button" className={this.state.dismissedFromService ? "btn btn-info noDataButton noButton1" : "btn btn-info noButton1"} onClick={this.noReason.bind(this)}>No</button>
            </div>
          </div>
          <div className={this.state.dismissedFromService ? "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12" : "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 otherInfoFormGroup"}>
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-info" aria-hidden="true"></i></span>
              <textarea rows="2" className={this.state.dismissedFromService ? "effect-21 form-control loginInputs dismissedFromService has-content" : "effect-21 form-control loginInputs dismissedFromService"} id="dismissedFromService" name="dismissedFromService" ref="dismissedFromService" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.dismissedFromService}></textarea>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding yesReason">
            <div className="col-lg-8 col-md-8 col-sm-6 col-xs-6">
              <p>Have you ever been convicted in a court of law or of a criminal offence? If yes, please give details and status of prosecutions against you.</p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <button type="button" className={this.state.criminalOffence ? "btn btn-info yesButton2" : "btn btn-info noDataButton yesButton2"} onClick={this.yesReason.bind(this)}>Yes</button>
              <button type="button" className={this.state.criminalOffence ? "btn btn-info noDataButton noButton2" : "btn btn-info noButton2"} onClick={this.noReason.bind(this)}>No</button>
            </div>
          </div>
          <div className={this.state.criminalOffence ? "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12" : "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 otherInfoFormGroup"}>
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-info" aria-hidden="true"></i></span>
              <textarea rows="2" className={this.state.criminalOffence ? "effect-21 form-control loginInputs criminalOffence has-content" : "effect-21 form-control loginInputs criminalOffence"} id="criminalOffence" name="criminalOffence" ref="criminalOffence" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.criminalOffence}></textarea>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding yesReason">
            <div className="col-lg-8 col-md-8 col-sm-6 col-xs-6">
              <p>Have you ever had any civil judgments made against you? If yes, please give details.</p>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
              <button type="button" className={this.state.civilJudgments ? "btn btn-info yesButton3" : "btn btn-info noDataButton yesButton3"} onClick={this.yesReason.bind(this)}>Yes</button>
              <button type="button" className={this.state.civilJudgments ? "btn btn-info noDataButton noButton3" : "btn btn-info noButton3"} onClick={this.noReason.bind(this)}>No</button>
            </div>
          </div>
          <div className={this.state.civilJudgments ? "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12" : "form-group col-lg-12 col-md-12 col-sm-12 col-xs-12 otherInfoFormGroup"}>
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-info" aria-hidden="true"></i></span>
              <textarea rows="2" className={this.state.civilJudgments ? "effect-21 form-control loginInputs civilJudgments has-content" : "effect-21 form-control loginInputs civilJudgments"} id="civilJudgments" name="civilJudgments" ref="civilJudgments" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.civilJudgments}></textarea>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <button type="submit" className="btn btn-info pull-right" onClick={this.submitOtherInfo.bind(this)}>Save</button>
        </div>
      </form>
    );
  }
}