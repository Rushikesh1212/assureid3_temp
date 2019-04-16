import React,{Component}  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Invoice } from './api/Invoice.js';
import { Order } from './api/Order.js';
import {Services} from '../../dashboard/reactCMS/api/Services.js';
import { UserProfile } from '../forms/api/userProfile.js';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

class Serviceinvoice extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      invoiceNo       : '',
      serviceId       : '',
      serviceName     : '',
      serviceRate     : '',
      serviceDuration : '',
      userName        : '',
      userId          : '',
      companyName     : '',
      companyAddress  : '',
      companyCity     : '',
      companyState    : '',
      companyCountry  : '',
      companyPincode  : '',
      id              : '', 
      date            : '',
      rate            : '', 
      invoice         : [],
      tax             : [],
      "subscription" : {
        "singleinvoice"      : Meteor.subscribe("singleinvoice"),   
        "allOrders"          : Meteor.subscribe("allOrders"),
        "tempSingleinvoice"  : Meteor.subscribe("tempSingleinvoice"),
        "allUserProfileData" : Meteor.subscribe("allUserProfileData"),
      }
    };
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount(){ 
      $('html, body').scrollTop(0);
  }
  cancdlinvoice(event){
    event.preventDefault();
    if(this.props.invoice.serviceDetails){
      var path = "/ServiceRequiredData/"+this.props.invoice.serviceDetails.serviceId+"-"+this.props.invoice.serviceDetails.serviceName+"-"+this.props.order._id;    
    }else{
      var path = "/PackageRequiredData/"+this.props.invoice.packageDetails.packageId+"-"+this.props.invoice.packageDetails.packageName+"-"+this.props.order._id;          
    }
    // 
    browserHistory.replace(path);
  }
  confirm(event){ 
    event.preventDefault();
    var path = "/PaymentGateway/"+this.props.order._id;
    browserHistory.replace(path);
  }
  formatRupees(num){
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
  }
  totalAmount(){ 
   var totalTax = 0;
   if (this.props.invoice.data) {
      if (this.props.invoice.data.length > 0) {
        var dataLength = this.props.invoice.data.length;
      }else{
        var dataLength = 1;
      }
     }else{
        var dataLength = 1;
     }
   if (this.props.invoice.tax) {
    if (this.props.invoice.tax.length > 0) {
      var taxPrice              = parseFloat(this.props.invoice.tax[0].applicableTax);
     }else{
      var taxPrice              = 1;
     }
   }else{
      var taxPrice              = 1;
     }
    var rate                  = parseFloat(this.props.invoice.serviceRate) * parseFloat(dataLength);
    var taxAmt                = (parseFloat(taxPrice) / 100) *  parseFloat(rate);
    var totalAmount           = parseFloat(taxAmt) + parseFloat(rate);
    var totalAmt              = this.formatRupees(totalAmount);
    return totalAmt;
  }
  printDocument(event){
    event.preventDefault();
       this.createPDF();
  }
  //create pdf 
  createPDF(){
    var outerInvoiceBlock = $('#outerInvoiceBlock'),
    cache_width = outerInvoiceBlock.width(),
    a4  =[850,  2000];  // for a4 size paper width and height
    this.getCanvas().then(function(canvas){
    var img = canvas.toDataURL("image/png"),
    doc = new jsPDF({
            unit:'px', 
            format:'a4'
          }); 
          var width = doc.internal.pageSize.width;  
          var height = doc.internal.pageSize.height - 300;
          doc.addImage(img, 'JPEG',0,0,width,height);
          doc.save('Invoice.pdf');
          outerInvoiceBlock.width(cache_width);
   });
  }
 
  // create canvas object
   getCanvas(){
    var outerInvoiceBlock = $('#outerInvoiceBlock'),
    cache_width = outerInvoiceBlock.width(),
    a4  =[850,  2000];  // for a4 size paper width and height
   // outerInvoiceBlock.width(cache_width).css('max-width','none');
   return html2canvas(outerInvoiceBlock,{
       imageTimeout:2000,
       removeContainer:true
      }); 
  }
  taxAmt(applicableTax){
    var taxPrice = parseFloat(applicableTax);
    // var rate     = parseFloat(this.props.invoice.serviceRate) * parseFloat(this.props.invoice.data.length);
    var taxAmt   = (parseFloat(taxPrice) / 100);
    // var taxAmt   = (parseFloat(taxPrice) / 100) *  parseFloat(rate);
    return taxAmt;
  } 

  rate(){
    //  var rate = parseFloat(this.props.invoice.serviceRate) * parseFloat(this.props.invoice.data.length);
    //  return rate;
  }
  
  render(){
    if(!this.props.loading){
      if(this.props.invoice){ 
      return(
        <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-1" >
          <div className="servieInnerBlock col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12" id="outerInvoiceBlock">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
              <div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headerinvoice">
                    <span className="col-lg-5 col-lg-offset-1 invoicetitle">INVOICE</span>
                    <span className="col-lg-1 mailtitle"></span>
                    <span className="col-lg-4 addresstitle">{this.props.invoice.companyName} <br /> {this.props.invoice.companyAddress.companyAddress},<br />{this.props.invoice.companyAddress.companyCity} {this.props.invoice.companyAddress.companyState ? ", " + this.props.invoice.companyAddress.companyState : ""} {this.props.invoice.companyAddress.companyCountry ? ", " + this.props.invoice.companyAddress.companyCountry : ""} {this.props.invoice.companyAddress.companyPincode ? "- " + this.props.invoice.companyAddress.companyPincode : ""}</span>
                    <span className="col-lg-1 mailtitle downloadPdf"><i className="fa fa-file-pdf-o pull-right" title="Download as pdf" onClick={this.printDocument.bind(this)}></i></span>
                  </div>
                  
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 invoicebill">
                    <div className="col-lg-3 col-lg-offset-1 col-md-2 col-md-offset-1 clientbilled">
                      <div className="billedto">Billed To</div>
                      <div className="clientdetails">
                        {/* {this.props.invoice.userName}<br />*/                        
                        
                          this.props.invoice.billingDetails ?
                           <div>
                            {this.props.invoice.billingDetails.address},
                            {this.props.invoice.billingDetails.city} {this.props.invoice.billingDetails.state ? ", " + this.props.invoice.billingDetails.state : ""} {this.props.invoice.billingDetails.country ? ", " + this.props.invoice.billingDetails.country : ""}<br />{this.props.invoice.billingDetails.pincode}
                           </div>
                           :
                           ""
                        }
                         {/* /* :
                          this.props.address.permanentAddressId ?
                            <div>
                            {this.props.address.line1} {this.props.address.line2 ? ", " + this.props.address.line2 : ""} {this.props.address.line3 ? ", " + this.props.address.line3 : ""} {this.props.address.landmark ? ", " + this.props.address.landmark : ""}<br />
                            {this.props.address.city} {this.props.address.state ? ", " + this.props.address.state : ""} {this.props.address.country ? ", " + this.props.address.country : ""}<br />{this.props.address.pincode}
                           </div>
                          :
                          <p>No Address Found!</p>
                        } */}

                        
                      </div>
                    </div>
                    <div className="col-lg-2 col-lg-offset-1 col-md-2 col-md-offset-1 clientaddress">
                      <div className="invoicenumber">Invoice Number <br /></div>
                      <div className="count">{this.props.invoice.invoiceNo}</div>
                                    
                      <div className="dateofissue">Date of Issue <br /></div>
                      <div className="date">{moment(this.props.invoice.createdAt).format("DD/MM/YYYY")}</div>
                      
                    </div>
                    <div className="col-lg-3 col-lg-offset-1 col-md-4 col-md-offset-2 invoicecount">
                      <div className="invoicetotle">Invoice Total<br /></div>
                      <div className=" money"><i className="fa fa-rupee"></i>{this.formatRupees(this.props.invoice.totalAmount)}</div>
                      {/* <input type="hiddden" value={this.formatRupees(this.props.invoice.totalAmount)} ref="totalAmount" name="totalAmount" className="notDisplay" /> */}
                    </div>

                  </div>


                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 dash"></div>

                  <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 table1">
                    <table>
                      <thead className="">
                        <tr className="tablehead1">
                          <th className="col-lg-8 col-md-8 serviceNm">Service Name </th>
                          <th className="col-lg-2 col-md-2 amtcount">Unit Cost </th>
                          <th className="col-lg-2 col-md-2 invoiceQuantity">Qty </th>
                          <th className="col-lg-3 col-md-3 amtcount">Amount </th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.props.serviceArray.length > 0 ?
                           this.props.serviceArray.map((serviceData,index)=>{
                            return(
                              <tr key ={index} className="firstrow">
                                <td className="col-lg-8 col-md-8">{serviceData.serviceName} <br /> 
                              </td>
                                <td className="col-lg-2 col-md-2 amtcount"><i className="fa fa-rupee"></i>{serviceData.serviceRate}</td>
                                <td className="col-lg-2 col-md-2 invoiceQuantity">{serviceData.totalQty} </td>
                            <td className="col-lg-2 col-md-2 invoiceQuantity">{serviceData.serviceRate * serviceData.totalQty} </td>
                                {/* <td className="col-lg-3 col-md-3 amtcount"><i className="fa fa-rupee"></i>{this.rate()} </td> */}
                              </tr>
                            )
                           })
                         
                          :
                          null

                        }
                      </tbody>
                    </table>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="pull-right total  text-right noPadLeftRight col-lg-6 ">
                        <span className="subtotal text-right col-lg-7 noPadLeftRight ">Subtotal </span>
                        {/* <span className="subtotlecount text-right col-lg-4 noPadLeftRight "><i className="fa fa-rupee"></i>{this.formatRupees(this.rate())}</span> */}
                        <span className="subtotlecount text-right col-lg-4 noPadLeftRight "><span className="col-lg-2"><i className="fa fa-rupee "></i></span><span className="col-lg-9 noPadLeftRight moneyDiv">{this.formatRupees(this.props.invoice.actualAmount)}</span></span>
                      </div>
                      {
                        this.props.invoice.packageDetails ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                          <div className="pull-right text-right noPadLeftRight col-lg-6">
                            <span className="subtotal text-right col-lg-7 noPadLeftRight">Discount ({this.props.invoice.packageDetails.packageDiscount}%)</span>
                            <span className="subtotlecount text-right col-lg-4 noPadLeftRight"><span className="col-lg-2"><i className="fa fa-rupee"></i></span><span className="col-lg-9 noPadLeftRight moneyDiv">{this.formatRupees(this.props.invoice.packageDiscountValue)}</span></span>
                          </div>  
                        </div>


                        :
                        null
                      }
                     
                      {
                          this.props.invoice.packageDetails ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                                <hr></hr>
                                  <div className="pull-right text-right noPadLeftRight col-lg-6">
                                    <span className="subtotal text-right col-lg-7 noPadLeftRight">After Discount Value</span>
                                    <span className="subtotlecount text-right col-lg-4 noPadLeftRight"><span className="col-lg-2"><i className="fa fa-rupee"></i></span><span className="col-lg-9 noPadLeftRight moneyDiv">{(this.props.invoice.reducedActualAmount)}</span></span>
                                  </div>  
                            </div>
                        :
                        null
                      }
                    </div>
                    <hr></hr>
                    
                  { this.props.invoice.taxAmount.length > 0 ?
                    this.props.invoice.taxAmount.map((tax,index) =>{
                        return( 
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight" key={index}>
                            <div className="pull-right text-right noPadLeftRight col-lg-6">
                              <span className="subtotal text-right col-lg-7 noPadLeftRight">{tax.taxName} ({tax.taxRate}%)</span>
                              <span className="subtotlecount text-right col-lg-4 noPadLeftRight"><span className="col-lg-2"><i className="fa fa-rupee"></i></span><span className="col-lg-9 noPadLeftRight moneyDiv">{(tax.calculatedAmount).toFixed(2)}</span></span>
                            </div>  
                          </div>
                        );
                      })
                     :
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                      <div className="pull-right text-right noPadLeftRight col-lg-6">
                        <span className="subtotal  text-right col-lg-7 noPadLeftRight">Tax(0%) </span>
                        <span className="subtotlecount  text-right col-lg-4 noPadLeftRight"><span className="col-lg-2"><i className="fa fa-rupee"></i></span><span className="col-lg-9 noPadLeftRight moneyDiv">0.00</span></span>
                      </div>  
                    </div>
                  }
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
                  <hr></hr>                                      
                    <div className="pull-right text-right noPadLeftRight col-lg-6">
                      <span className="subtotal  text-right col-lg-7 noPadLeftRight">Invoice Total </span>
                      <span className="subtotlecount  text-right col-lg-4 noPadLeftRight"><span className="col-lg-2"><i className="fa fa-rupee"></i></span><span className="col-lg-9 noPadLeftRight moneyDiv">{this.formatRupees(this.props.invoice.totalAmount)}</span></span>
                      {/* <span className="subtotlecount  text-right col-lg-4 noPadLeftRight"><i className="fa fa-rupee"></i>{this.formatRupees(this.props.invoice.totalAmount)}</span> */}
                    </div>  
                  </div>
                 </div>
                 {
                  // Session.get('showInvoice') ?
                  this.props.order.paymentStatus != "paid"?
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                    <button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-left" onClick={this.cancdlinvoice.bind(this)}>Cancel</button>
                    <button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-right" onClick={this.confirm.bind(this)}>Make Payment</button>
                 </div>
                  :
                  null
                  // <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerButtonDiv">
                  //   <button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-left" onClick={this.cancdlinvoice.bind(this)}>Cancel</button>
                  //   <button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-right" onClick={this.confirm.bind(this)}>Make Payment</button>
                  //  </div>
                }
                 
              </div>
           </div>
          </div>
        </div>
      );
     }else{
      return(<span>Data not available</span>);
     }
    }else{
      return(<span>Data not available</span>);
    }
  } 
}
 
ServiceInvoiceContainer = withTracker(({params}) => {
    var id = params.id;
    
    
    var serviceArray=[];
    // 
    // const postHandle  = Meteor.subscribe('singleinvoice',_id);
    // var editServices   = this.props.params.id; 
    const postHandle  = Meteor.subscribe('singleInvoice',id);

    var invoice = Invoice.findOne({"_id":id});
  
    if(invoice){
      var serviceDetails  =  invoice.serviceDetails;
      if(serviceDetails !=undefined){
        serviceArray.push(serviceDetails);      
      }else{
        var packageServiceDetails = invoice.packageDetails.serviceDetails;
        serviceArray=packageServiceDetails;
      }
  
    
      var address = {};
      var order = Order.findOne({"invoiceDetails.invoiceId": invoice._id}) || {};  
      var userProfile = UserProfile.findOne({"userId" : invoice.userId}) || {};
      
      if (userProfile) {
        if (userProfile.currentAddress) {
          if (userProfile.currentAddress.length > 0) {
            address = userProfile.currentAddress[userProfile.currentAddress.length - 1];
          }else{
            if (userProfile.permanentAddress) {
               if (userProfile.permanentAddress.length > 0) {
               address = userProfile.permanentAddress[userProfile.permanentAddress.length - 1];
              }
            }
          }
        }else{
          if (userProfile.permanentAddress) {
             if (userProfile.permanentAddress.length > 0) {
             address = userProfile.permanentAddress[userProfile.permanentAddress.length - 1];
            }
          }
        }
      }
    }
    
    const loading  = !postHandle.ready();    
    // if(_id){
      return {
          loading,
          invoice,
          order,
          address,
          serviceArray
      };
    // }
})(Serviceinvoice);
export default ServiceInvoiceContainer;