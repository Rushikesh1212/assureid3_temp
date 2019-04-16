import React,{Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import HomePageServices from './HomePageServices.jsx';
import Sectors from './Sectors.jsx';
import HomePageHowitWorks from './HomePageHowitWorks.jsx';
import Support from './Support.jsx';
export default class HomePageCarousal extends TrackerReact(Component){
  constructor(){ 
    super(); 
    this.state ={  
    	"counter" : 0,
      // "searchArray"  : [],
      "subscription" : {
      } 
    }
  }
  componentDidMount(){
  	window.addEventListener('scroll', this.handleScroll);    
  }
  componentWillUnmount(){        
    window.removeEventListener('scroll', this.handleScroll);    
  }  

  handleScroll(event){      
    var a = 0;      
    $(window).scroll(function() {       
       var oTop = $('#carousel-example-generic').offset().top - window.innerHeight;        
       if (a == 0 && $(window).scrollTop() > oTop) {          
         $('.count-number').each(function() {           
             var $this = $(this),              
             countTo = $this.attr('data-to');            
             $({countNum: $this.text()}).animate({countNum: countTo},
               {               
                 duration: 2000,                
                 easing: 'swing',                
                 step: function() {                  
                    $this.text(Math.floor(this.countNum));                
                 },                
                 complete: function() {                  
                 $this.text(this.countNum);                  
                   //alert('finished');                
                 }              
                });         
              });          
             a = 1;        
           }     
      });    
  } 
  
  render() {  
    return (
    	<div>
	    	<div id="carousel-example-generic" className="carousel slide top30" data-ride="carousel">
	        <ol className="carousel-indicators">
	            <li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>
	            <li data-target="#carousel-example-generic" data-slide-to="1"></li>
	            <li data-target="#carousel-example-generic" data-slide-to="2"></li>
	            <li data-target="#carousel-example-generic" data-slide-to="3"></li>
	        </ol>

	        <div className="carousel-inner" role="listbox">
	            <div className="item active">
	               <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/banner1.jpg" alt="..." />
	                <div className="carousel-caption">
										<div className="animate three">
											<h1>
												COMMMUNITY SERVICES  <span>A</span><span>C</span><span>C</span><span>E</span><span>L</span><span>E</span><span>R</span><span>A</span><span>T</span><span>E</span><span>D</span>  
											</h1> 
										</div>
	                </div>
	            </div>
	            <div className="item">
	              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/banner2.jpg" alt="..." />
	                <div className="carousel-caption">
	                  <div className="animate three">
											<h1>						
												EMPLOYEE VERIFCATION <span>A</span><span>C</span><span>C</span><span>E</span><span>L</span><span>E</span><span>R</span><span>A</span><span>T</span><span>E</span><span>D</span>   
											</h1>
						       </div>                   
	               </div> 
	            </div>
	            <div className="item">
	               <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/banner3.jpg" alt="..." />
	                <div className="carousel-caption">
	                  <div className="animate three">
											<h1>
												TENANT VERIFCATION   <span>A</span><span>C</span><span>C</span><span>E</span><span>L</span><span>E</span><span>R</span><span>A</span><span>T</span><span>E</span><span>D</span>  
											</h1> 
										</div>
	                </div>
	            </div>
	            <div className="item">
	              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/banner4.jpg" alt="..." />
	                <div className="carousel-caption">
	                  <div className="animate three">
											<h1>						
												LABOUR VERIFICATION <span>A</span><span>C</span><span>C</span><span>E</span><span>L</span><span>E</span><span>R</span><span>A</span><span>T</span><span>E</span><span>D</span>   
											</h1>
										</div> 
	                </div>
	            </div>

	            <div className="item">
	              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/banner5.jpg" alt="..." />
	                <div className="carousel-caption">
	                  <div className="animate three">
											<h1>
												EMPLOYMENT  VERIFCATION   <span>A</span><span>C</span><span>C</span><span>E</span><span>L</span><span>E</span><span>R</span><span>A</span><span>T</span><span>E</span><span>D</span>  
											</h1> 
										</div>
	                </div>
	            </div>

	        </div>

	        <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
	            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
	            <span className="sr-only">Previous</span>
	        </a>
	        <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
	            <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
	            <span className="sr-only">Next</span>
	        </a>
	      </div>
		    <div className="container">
					<div className="row">
					
						<div className="col-sm-3">
							<div className="counter">
							  <i className="fa fa-smile-o fa-2x hidden-sm"></i>
							  <h2 className="timer count-title count-number" data-to="21" data-speed="1500"></h2>
							  <p className="count-text ">HAPPY CLIENTS</p>
							  <div className="sonar-wave"></div>
							</div>
						</div>
						
						<div className="col-sm-3">
							<div className="counter">
							  <i className="fa fa-list fa-2x hidden-sm"></i>
							  <h2 className="timer count-title count-number" data-to="11900" data-speed="1500"></h2>
							  <p className="count-text ">BACKGROUND CHECKS DONE</p>
							</div>
						</div>
							
						 <div className="col-sm-3">
							<div className="counter">
							  <i className="fa fa-users fa-2x hidden-sm"></i>
							  <h2 className="timer count-title count-number" data-to="501" data-speed="1500"></h2>
							   <p className="count-text ">NO. OF USERS</p>
							</div>
						</div>


						<div className="col-sm-3">
							<div className="counter">
							   <i className="fa fa-code fa-2x hidden-sm"></i>
							  <h2 className="timer count-title count-number" data-to="2057" data-speed="1500"></h2>
							  <p className="count-text ">HOURS OF CODE</p>
							</div>
						</div> 
						
					</div>
				</div>
			    <div className="lt_section">
			        <div className="container">
			            <div className="row">
			                <div className="col-md-12">
			                    <div className="lt_heading">
			                        <h3>INDUSTRY <span>PAIN POINTS</span></h3>
			                    </div>
			                </div>
			            </div>
			        </div>
			    </div>
			    <section id="industry"> 
            <div className="container">
	        		<div className="row">
               <div className="col-md-4 col-sm-12">
			        	<div className="col-md-12 col-sm-4">
					       <p><img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/about.jpg" className="img-responsive"/></p>
				        </div>
								<div className="col-md-12 col-sm-8">
									<h3>WHAT IS ASSUREID?</h3>									
									<p className="text-justify">AssureID helps organisations verify people with unparalleled ease, owing to its Artificial Intelligence and Data Analytics–powered technological systems. In today’s times the information provided by a person even on paper is hard to trust. Fraudsters can use technology to forge documents and their identities. AssureID uses technology itself to verify people’s profiles in the most comprehensive manner; thus keeping fraudsters at bay. The team at AssureID prouds itself in its service and that is why it can say with conviction: if a person is verified by AssureID, you can trust them blindly!</p>								
								</div>		
		         	</div>
			
	            <div className="col-md-4 col-sm-12">
                <div className="row">
                    <div className="col-md-12 col-sm-6">
                        <div className="box wow fadeInLeft" data-wow-delay="0.2s">
                            <p className="description"> Highest number of cases of information discrepancies  have been detected in the 22-30 years age bracket. </p>
                        </div>
                    </div>
                     <div className="col-md-12 col-sm-6">
                        <div className="box wow fadeInLeft">
                            <p className="description"> Mumbai tops in the list of Education discrepancies followed by New Delhi, Bengaluru and Pune. </p>
								        </div>
                    </div>
                     <div className="col-md-12 col-sm-6">
                        <div className="box wow fadeInRight">
                            <p className="description"> The most number of discrepancies are related to Employment information followed by Address and Education.</p>
                        </div>
                    </div>
                    <div className="col-md-12 col-sm-6">
                        <div className="box wow fadeInRight" data-wow-delay="0.2s">
                            <p className="description"> Engineering tops in the list of sector-wise discrepancies followed by FMCG, Pharma, BFSI and IT.</p>
                        </div>
                    </div>
                </div>
	            </div>
			
            <div className="col-md-4 col-sm-12">
              <div className="row">
                <div className="col-md-12 col-sm-12">
                    <div className="box1 wow fadeInLeft" data-wow-delay="0.2s">
                        <p className="description"> About 2/3rds cases are males. </p>							
					              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/explore.jpg" className="img-responsive" />
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box1 wow fadeInLeft" data-wow-delay="0.2s">
                        <p className="description"> Bengaluru tops in the list of Employment discrepancies followed by Mumbai, Hyderabad, New Delhi and Pune.  </p>							
					              <img src="https://s3.ap-south-1.amazonaws.com/assureidportal/websiteImgs/graph.jpg" className="img-responsive" />
                    </div>
                </div>
              </div>
            </div>   
		     	<div className="clearfix"></div>
					<div className="col-sm-12 top50 text-center">
							<h4> SOLUTION BY ASSURE ID </h4>                                   
					</div>

			   </div>
       </div>
    </section>
	  <HomePageServices />
	  <Sectors />
	  <HomePageHowitWorks />
	  <Support />
		</div>
    );
  }
}