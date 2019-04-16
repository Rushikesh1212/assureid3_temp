import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TicketMaster } from '/imports/admin/caseManagement/api/TicketMaster.js';
import { Order} from '/imports/admin/orderManagement/api/Order.js';
import OrderSummary from '/imports/admin/orderManagement/component/OrderSummary.jsx';
import OrderSummaryTable from '/imports/admin/orderManagement/component/OrderSummaryTable.jsx';
import ReportGeneration from '/imports/admin/reportgeneration/components/ReportGeneration.jsx';

class OrderGeneration extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "subscription" : { 
      } 
    };
  }
  // //create pdf 
  createPDF(){
    var orderGenerationwrap = $('#orderGenerationwrap'),
    cache_width     = orderGenerationwrap.width();
    // a4              =[850,  2000];  // for a4 size paper width and height
    this.getCanvas().then(function(canvas){
    var imageData = canvas.toDataURL("image/png"),
    doc     = new jsPDF({
            orientation : 'portrait',
            unit:'px', 
            format:'a4',
          });
          doc.setFontSize(16); 
          var width           = doc.internal.pageSize.width; 
          var height          = doc.internal.pageSize.height;
          var imgHeight       = canvas.height * width / canvas.width;
          var heightLeft = imgHeight;
          var position = 0;

          doc.addImage(img, 'PNG', 0, position, width, imgHeight);
          heightLeft -= height;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(img, 'PNG', 0, position, width, imgHeight);
            heightLeft -= height;
          }
          doc.save('GenratedOrder.pdf');
          orderGenerationwrap.width(cache_width);
               // var image = new Image();
               //  image = Canvas2Image.convertToJPEG(canvas);
               //  // var doc = new jsPDF();
               //  doc.addImage(imageData, 'JPEG', 12, 10);
               //  var croppingYPosition = 1095;
               //  count = (image.height) / 1095;

               //  for (var i =1; i < count; i++) {
               //          doc.addPage();
               //          var sourceX = 0;
               //          var sourceY = croppingYPosition;
               //          var sourceWidth = image.width;
               //          var sourceHeight = 1095;
               //          var destWidth = sourceWidth;
               //          var destHeight = sourceHeight;
               //          var destX = 0;
               //          var destY = 0;
               //          var canvas1 = document.createElement('canvas');
               //          canvas1.setAttribute('height', destHeight);
               //          canvas1.setAttribute('width', destWidth);                         
               //          var ctx = canvas1.getContext("2d");
               //          ctx.drawImage(image, sourceX, 
               //                               sourceY,
               //                               sourceWidth,
               //                               sourceHeight, 
               //                               destX, 
               //                               destY, 
               //                               destWidth, 
               //                               destHeight);
               //          var image2 = new Image();
               //          image2 = Canvas2Image.convertToJPEG(canvas1);
               //          image2Data = image2.src;
               //          doc.addImage(image2Data, 'JPEG', 12, 10);
               //          croppingYPosition += destHeight;              
               //      }                  
               //  var d = new Date().toISOString().slice(0, 19).replace(/-/g, "");
               //  filename = 'GenratedOrder_' + d + '.pdf';
               //  doc.save(filename);
   });
  }
    // create canvas object
  getCanvas(){ 
    var orderGenerationwrap = $('#orderGenerationwrap'),
    cache_width     = orderGenerationwrap.width(),
    a4              = [850,  2000];  // for a4 size paper width and height
   // orderGenerationwrap.width(cache_width).css('max-width','none');
   return html2canvas(orderGenerationwrap,{
       imageTimeout:2000,
       useCORS : true,
       removeContainer:true
      }); 
  }
  downloadOrderaspdf(event){
    event.preventDefault();
    this.createPDF();
  }
  componentDidMount(){      
  }
  render(){
    return (
      <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 orderGenerationwrap" id="orderGenerationwrap">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding generationHeader"> 
          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 pull-left">
            <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/AssureIDlogo.png" className="generationImg" />
          </div>
          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
           <div className="col-lg-11 col-md-11 col-sm-12 col-xs-12">
             <h1 className="pull-right">FINAL SCREENING REPORT</h1>
           </div>
           <div className="col-lg-1 col-md-1 col-sm-12 col-xs-12 outerpdficonatorder">
              <i className="fa fa-file-pdf-o pull-right fa-2x pdf-icon" title="Download as pdf" onClick={this.downloadOrderaspdf.bind(this)}></i>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 generationInfo noLRPad">
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noLRPad">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 reportLabel">Name <span className="pull-right">:</span></div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 valueLabel">{this.props.orderCandidate ? this.props.orderCandidate.candidateFirstName+" "+this.props.orderCandidate.candidateLastName : "-"}</div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding orderinfodiv">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">Order Reference <span className="pull-right">:</span></div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">{this.props.getOrder ? this.props.getOrder.orderNo : "-"}</div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding orderinfodiv">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">Order Date <span className="pull-right">:</span></div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">{this.props.getOrder ? moment(this.props.getOrder.createdAt).format('DD-MM-YYYY') : "-"}</div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding orderinfodiv">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">Report Level <span className="pull-right">:</span></div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">Standard</div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding orderinfodiv">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">Report Date <span className="pull-right">:</span></div>
              <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">{this.props.getOrder ? moment(this.props.getOrder.completedDate).format('DD-MM-YYYY') : "-"} </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding orderinfodiv">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">Result <span className="pull-right">:</span></div>
              <div className={"col-lg-8 col-md-8 col-sm-8 col-xs-8 "+this.props.textColor}><b>{this.props.getOrder ? this.props.getOrder.orderStatus : "-"}</b></div>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
        {/*
          this.props.getOrder ?
               <div>
                  <OrderSummaryTable order={this.props.getOrder} backgroundColor={this.props.backgroundColor} candidateId={this.props.candidateId}/>    
                </div>
          :
            null
        */}
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
          <h3>EXECUTIVE SUMMARY</h3>
          { 
            this.props.orderCandidate ?
             this.props.orderCandidate.verificationData.map((ticketData,index)=>{
                return(
                  <div key={index}>
                    <OrderSummary ticketId={ticketData.ticketDetails.ticketId}/>
                  </div>
                )
             })
             :
             null
          }
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <h3 className="orderHeadStyle">SUMMARY OF FINDINGS</h3>
          <ul className="col-lg-12 col-md-12 col-sm-12 col-xs-12 orderHeadStyle">
          {
            this.props.summaryFinding ?
              this.props.summaryFinding.map((summary,index)=>{
                  return summary.text != undefined ? 
                    <li className= "showLi" key={index}>{summary.text}</li>
                  :
                    <div>hello</div>
              })
            :
            <div>hi</div>
          }
          </ul>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
          { 
            this.props.getOrder ?
             this.props.orderCandidate.verificationData.map((ticketData,index)=>{
                return(
                  <div key={index}>
                    <ReportGeneration ticketId={ticketData.ticketDetails.ticketId}/>
                  </div>
                )
             })
             :
             null
          }
        </div>
      </div>
    );
  }
}
export default OrderGenerationContainer = withTracker(props => {
  console.log("Inside corporateOrderManagement order generation");
  //Get id from the props
  var idValue = props.ticketId;
  if(!idValue){
    //Get the ticket id from the url
    // var currentLocation = browserHistory.getCurrentLocation();
    var currentLocation = location.pathname;
    console.log('currentLocation: ', currentLocation);
    if(currentLocation){
      var splitUrl = currentLocation.split('/');
      var url = splitUrl[2];
      if (url) {
        var splitValue  = url.split('-');
        idValue         = splitValue[0];
        var candidateId = splitValue[1];
        // console.log("candidateId :",candidateId);
      } 
      
    }
  }
  var handleSinTick = Meteor.subscribe("singleOrder",idValue);
  var handleTick    = Meteor.subscribe("allTickets");
  var loading       = !handleSinTick.ready();
  var getOrder      = Order.findOne({"_id":idValue});
  
  if(getOrder){
    //status of order
    var tempStatus = ''; 
    // var allTicketStatus = getOrder.ticket; 
    // var allTicketStatus = getOrder.candidateDetails[0].verificationData;
    var orderCandidate = getOrder.candidateDetails.find(function (obj) { return obj.candidateId == candidateId });
    // console.log("orderCandidate",orderCandidate);
    if (orderCandidate) {
      var allTicketStatus = orderCandidate.verificationData;
      // console.log("allTicketStatus",allTicketStatus);
    }
    var orderStatus = allTicketStatus.find(function (obj) { return obj.ticketDetails.status == 'Inaccessible' });
    if(!orderStatus){
      orderStatus = allTicketStatus.find(function (obj) { return obj.ticketDetails.status == 'Major Discrepancy' });
      if(!orderStatus){
        orderStatus = allTicketStatus.find(function (obj) { return obj.ticketDetails.status == 'Minor Discrepancy' });
        if(!orderStatus){
          orderStatus = allTicketStatus.find(function (obj) { return obj.ticketDetails.status == 'Clear' });
          if(!orderStatus){
            getOrder.orderStatus = 'Not Verified';
            var textColor = 'blackColorDiv';  
            var backgroundColor = "blackBackgroundDiv";
          }else{
            getOrder.orderStatus = 'Clear';    
            var textColor = 'text-success';
            var backgroundColor = "greenBackgroundDiv";
          }
        }else{
          getOrder.orderStatus = 'Minor Discrepancy';  
          var textColor = 'orangeColorDiv';
          var backgroundColor = "orangeBackgroundDiv";
        }
      }else{
        getOrder.orderStatus = 'Major Discrepancy';
        var textColor = 'redColorDiv';
        var backgroundColor = "redBackgroundDiv";
      }
    }else{
      getOrder.orderStatus = 'Inaccessible';
      var textColor = 'amberColorDiv';
      var backgroundColor = "amberBackgroundDiv";
    }

    //Summary Findings of all the tickets
    var caseDrop = [];
    var cancelled = [];
    var unableToVerify = [];
    var inaccessible = [];
    var majorDiscrepancy = [];
    var minorDiscrepancy = [];
    var clear = [];

    for(i = 0 ; i < getOrder.candidateDetails[0].verificationData.length; i++ ){
      var ticketDetails = TicketMaster.findOne({"_id":getOrder.candidateDetails[0].verificationData[i].ticketDetails.ticketId});
      if(ticketDetails){
        var data = {
          ticketNumber : ticketDetails.ticketNumber,
          ticketStatus : '-',
        };
        if(ticketDetails.verificationType == 'employement'){
          data.ticketInfo = ticketDetails.verificationData.nameOfEmployer;
          data.ticketVerification = 'Employement Verification';
        }else if(ticketDetails.verificationType == 'permanentAddress'){
          data.ticketInfo = ticketDetails.verificationData.line1 + ' , ' +ticketDetails.verificationData.line2 + ', ' + ticketDetails.verificationData.line3 + ' , ' + ticketDetails.verificationData.landmark + ' , ' + ticketDetails.verificationData.city + ' , ' + ticketDetails.verificationData.state + ' , ' + ticketDetails.verificationData.pincode;
          data.ticketVerification = 'Address Verification';
        }else if(ticketDetails.verificationType == 'currentAddress'){
          data.ticketInfo = ticketDetails.verificationData.tempLine1 + ' , ' +ticketDetails.verificationData.tempLine2 + ', ' + ticketDetails.verificationData.tempLine3 + ' , ' + ticketDetails.verificationData.tempLandmark + ' , ' + ticketDetails.verificationData.tempCity + ' , ' + ticketDetails.verificationData.tempState + ' , ' + ticketDetails.verificationData.tempPincode;
          data.ticketVerification = 'Address Verification';
        }else if(ticketDetails.verificationType == 'education'){
          data.ticketInfo = ticketDetails.verificationData.collegeName + ' - ' + ticketDetails.verificationData.university;
          data.ticketVerification = 'Education Verification';
        }else if(ticketDetails.verificationType == 'Identity'){
          data.ticketInfo = ticketDetails.verificationData.identityType;
          data.ticketVerification = 'Identity Verification';
        }
        // console.log("data");
        // console.log(data);
        var ticketStatus = ticketDetails.reportGenerated.documents.status.split('-');
        if(ticketStatus){
          data.ticketStatus = ticketStatus[1];
          switch(ticketStatus[1]){
            case 'Stop Checked':
              caseDrop.push(data);
              break;
            case 'Cancelled' :
              cancelled.push(data);
              break;
            case 'Unable to Verify' : 
              unableToVerify.push(data);
              break;
            case 'Inaccessible' :
              inaccessible.push(data);
              break;
            case 'Major Discrepancy' :
              majorDiscrepancy.push(data);
              break;
            case 'Minor Discrepancy' :
              minorDiscrepancy.push(data);
              break;
            case 'Clear' :
              clear.push(data);
              break;
          }  //EOF switch 
         
          var caseDropSummaryFinding         = ' are dropped';
          var cancelledSummaryFinding        = ' are cancelled';
          var unableToVerifiySummaryFinding  = ' were unable to verify';
          var inaccessibleSummaryFinding     = ' seems to be wrong. Either we could not find this address or the address was inaccessible to us.';
          var clearSummaryFinding            = ' are clear and looking good to us.';
          var minorDiscrepancySummaryFinding = ' are clear with minor Discrepany.';
          var majorDiscrepancySummaryFinding = ' Were not cleared due to manjor discrepancy.';

          var summaryFinding = [];
          if(caseDrop.length != 0){
            if(caseDrop.length == 1){
              var text = caseDrop[0].ticketInfo + ' , ' + caseDrop[0].ticketVerification + caseDropSummaryFinding;
            }else{
              var text = '';
              for(j = 0 ; j < caseDrop.length; j++){
                var text = text + caseDrop[j].ticketInfo + ' , ' + caseDrop[j].ticketVerification + ' , '
              }
              text = text + caseDropSummaryFinding;
            }
            var summary = {
              text : text,
            }
            summaryFinding.push(summary);
          }//EOF Case Drop

          if(cancelled.length != 0){
            if(cancelled.length == 1){
              var text = cancelled[0].ticketInfo + ' , ' + cancelled[0].ticketVerification + cancelledSummaryFinding;
            }else{
              var text = '';
              for(j = 0 ; j < cancelled.length; j++){
                var text = text + cancelled[j].ticketInfo + ' , ' + cancelled[j].ticketVerification + ' , '
              }
              text = text + cancelledSummaryFinding;
            }
            var summary = {
              text : text,
            }
            summaryFinding.push(summary);
          }//EOF Cancelled

          if(unableToVerify.length != 0){
            if(unableToVerify.length == 1){
              var text = unableToVerify[0].ticketInfo + ' , ' + unableToVerify[0].ticketVerification + unableToVerifiySummaryFinding;
            }else{
              var text = '';
              for(j = 0 ; j < unableToVerify.length; j++){
                var text = text + unableToVerify[j].ticketInfo + ' , ' + unableToVerify[j].ticketVerification + ' , '
              }
              text = text + unableToVerifiySummaryFinding;
            }
            var summary = {
              text : text,
            }
            summaryFinding.push(summary);
          }//EOF Unable to verifiy

          if(inaccessible.length != 0){
            if(inaccessible.length == 1){
              var text = inaccessible[0].ticketInfo + ' , ' + inaccessible[0].ticketVerification + inaccessibleSummaryFinding;
            }else{
              var text = '';
              for(j = 0 ; j < inaccessible.length; j++){
                var text = text + inaccessible[j].ticketInfo + ' , ' + inaccessible[j].ticketVerification + ' , '
              }
              text = text + inaccessibleSummaryFinding;
            }
            var summary = {
              text : text,
            }
            summaryFinding.push(summary);
          }//EOF Inaccessible

          if(minorDiscrepancy.length != 0){
            if(minorDiscrepancy.length == 1){
              var text = minorDiscrepancy[0].ticketInfo + ' , ' + minorDiscrepancy[0].ticketVerification + minorDiscrepancySummaryFinding;
            }else{
              var text = '';
              for(j = 0 ; j < minorDiscrepancy.length; j++){
                var text = text + minorDiscrepancy[j].ticketInfo + ' , ' + minorDiscrepancy[j].ticketVerification + ' , '
              }
              text = text + minorDiscrepancySummaryFinding;
            }
            var summary = {
              text : text,
            }
            summaryFinding.push(summary);
          }//EOF minor Discrepancy

          if(majorDiscrepancy.length != 0){
            if(majorDiscrepancy.length == 1){
              var text = majorDiscrepancy[0].ticketInfo + ' , ' + majorDiscrepancy[0].ticketVerification + majorDiscrepancySummaryFinding;
            }else{
              var text = '';
              for(j = 0 ; j < majorDiscrepancy.length; j++){
                var text = text + majorDiscrepancy[j].ticketInfo + ' , ' + majorDiscrepancy[j].ticketVerification + ' , '
              }
              text = text + majorDiscrepancySummaryFinding;
            }
            var summary = {
              text : text,
            }
            summaryFinding.push(summary);
          }//EOF minor Discrepancy

          if(clear.length != 0){
            if(clear.length == 1){
              var text = clear[0].ticketInfo + ' , ' + clear[0].ticketVerification + clearSummaryFinding;
            }else{
              var text = '';
              for(j = 0 ; j < clear.length; j++){
                var text = text + clear[j].ticketInfo + ' , ' + clear[j].ticketVerification + ' , '
              }
              text = text + clearSummaryFinding;
            }
            var summary = {
              text : text,
            }
            summaryFinding.push(summary);
          }//EOF of clear

        }//EOF ticketStatus
      } 
    }
    getOrder.summaryFinding = summaryFinding;
    

  }
return{
  getOrder,
  textColor,
  summaryFinding,
  backgroundColor,
  orderCandidate,
  candidateId
}
})(OrderGeneration);