import React,{Component}  from 'react';
import {render}           from 'react-dom';
import TrackerReact       from 'meteor/ultimatejs:tracker-react';
import { withTracker }    from 'meteor/react-meteor-data';
import { FlowRouter }     from 'meteor/ostrio:flow-router-extra';

export default class StaticRequestStatus extends TrackerReact(Component) {
	 constructor(){
    super(); 
    this.state ={
      "subscription" : {
      } 
    }
  }
  render(){
  	return(
  		<div>
        <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 noProfilePadding visitedHeight companyVerifColor outerpaddingForMobile">
         {/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 companyOrderPage">
          <h3 className="text-center">Request Status</h3>
         </div>*/}
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <table className="table empVerifListTable table-striped table-bordered">
              <thead>
                <tr className="" >
                  <th className="text-center ">Sr. No.</th>
                  <th className="text-center ">AssureID</th>
                  <th className="text-center ">Employee Details</th>
                  <th className="text-center ">
                   Verification Type
                  </th>
                  <th className="text-center ">Document Attachment</th>
                  <th className="text-center ">Status</th>
                  <th className="text-center ">Report</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-left">1.</td>
                  <td className="text-left">IN-CAA-000011</td>
                  <td className="text-left">
                    <div>Bindu Shah</div>
                    <div>bindushaha@gmail.com</div>
                    <div>9888857856</div>
                    <div>-</div>
                  </td>
                  <td className="text-left">Jasminium Socity, Magarpatta City, Pune 411013</td>
                  <td className="text-left">
                    <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/ProofDocuments/3QKWuwFRsb5MmDAr2.png" download>
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/Photo-icon.png" className="img-responsive requestStatusImgs"/>
                    </a>
                  </td>
                  <td className="blockwrap bgOrange">Case Initiated</td>
                  <td className="text-left">
                    <a href="" className="text-center">
                      -
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="text-left">2.</td>
                  <td className="text-left">IN-CAA-000002</td>
                  <td className="text-left">
                    <div>Kriti Ahuja</div>
                    <div>kriti.ahuja@gmail.com</div>
                    <div>9888877777</div>
                    <div>1234 5678 9012</div>
                  </td>
                  <td className="text-left">Hadapsar, Pune 411028</td>
                  <td className="text-left">
                    <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/ProofDocuments/23rnKJh5cn8LTSNLq.png" download>
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/Photo-icon.png" className="img-responsive requestStatusImgs"/>
                    </a>
                  </td>
                  <td className="text-left bgBlue">Completed</td>
                  <td className="text-left">
                    <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/sampleReport/Report1.pdf" download>
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/pdf.png" className="img-responsive requestStatusPdfs"/>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="text-left">3.</td>
                  <td className="text-left">IN-CAA-000001</td>
                  <td className="text-left">
                    <div>Charita Joshi</div>
                    <div>charita.joshi23@gmail.com</div>
                    <div>978451295</div>
                    <div>-</div>
                  </td>
                  <td className="text-left">Opposite Bharat Complex, Solapur Rd, Hadapsar Gaon, Hadapsar, Pune, Maharashtra 411028</td>
                  <td className="text-left">
                    <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/ProofDocuments/3QKWuwFRsb5MmDAr2.png" download>
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/Photo-icon.png" className="img-responsive requestStatusImgs"/>
                    </a>
                  </td>
                  <td className="blockwrap bgYellow">Verification Started</td>
                  <td className="text-left">
                    <a href="" className="text-center">
                      -
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="text-left">4.</td>
                  <td className="text-left">IN-CAA-000008</td>
                  <td className="text-left">
                    <div>Om Bidkar</div>
                    <div>ombidkar123@gmail.com</div>
                    <div>9887457856</div>
                    <div>-</div>
                  </td>
                  <td className="text-left">Late Divakar Ganesh Gangal Rd, Naupada, Brahman Society, Thane, Maharashtra 400602</td>
                  <td className="text-left">
                    <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/ProofDocuments/3QKWuwFRsb5MmDAr2.png" download>
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/Photo-icon.png" className="img-responsive requestStatusImgs"/>
                    </a>
                  </td>
                  <td className="blockwrap bgLightOrange">Verification Completed</td>
                  <td className="text-left">
                    <a href="" className="text-center">
                      -
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="text-left">4.</td>
                  <td className="text-left">IN-CAA-000003</td>
                  <td className="text-left">
                    <div>Ira Krishna</div>
                    <div>ira12Krishna@gmail.com</div>
                    <div>9888854566</div>
                    <div>-</div>
                  </td>
                  <td className="text-left">Devidarshan, Gadkari Rd, Naupada, Thane West, Thane, Maharashtra 400602</td>
                  <td className="text-left">
                    <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/ProofDocuments/3QKWuwFRsb5MmDAr2.png" download>
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/Photo-icon.png" className="img-responsive requestStatusImgs"/>
                    </a>
                  </td>
                  <td className="blockwrap bgPGeen">Case Initiated</td>
                  <td className="text-left">
                    <a href="" className="text-center">
                      -
                    </a>
                  </td>
                </tr>
                <tr>
                  <td className="text-left">5.</td>
                  <td className="text-left">IN-CAA-000001</td>
                  <td className="text-left">
                    <div>Bindu Shah</div>
                    <div>bindushaha@gmail.com</div>
                    <div>9888857856</div>
                    <div>-</div>
                  </td>
                  <td className="text-left">Jasminium Socity, Magarpatta City, Pune 411013</td>
                  <td className="text-left">
                    <a href="https://s3.ap-south-1.amazonaws.com/assureidportal/ProofDocuments/3QKWuwFRsb5MmDAr2.png" download>
                      <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/Photo-icon.png" className="img-responsive requestStatusImgs"/>
                    </a>
                  </td>
                  <td className="blockwrap bgGeen">Report Generating</td>
                  <td className="text-left">
                    <a href="" className="text-center">
                      -
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>      
        </div>
  		</div>
  		);
  }
}