import React, { Component }  from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { NewsFeeds } from '/imports/admin/adminDashboard/newsFeedManagement/api/NewsFeed.js';
import YoutubeEmbedVideo from "youtube-embed-video";
import { withTracker } from 'meteor/react-meteor-data';
const getVideoId = require('get-video-id');

class NewsFeed extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      // newsFeeds            : [],
      "subscription"  : {
        "newsFeedData" : Meteor.subscribe("newsFeedData"),    
      }    
    };    
  }
  // componentDidMount() {
  //   this.newsFeedTracker = Tracker.autorun( ()=> {
  //     Meteor.subscribe("newsFeedData");
  //     const newsFeeds = NewsFeeds.find().fetch();
  //     // console.log("newsFeeds",newsFeeds);
  //     this.setState({newsFeeds: newsFeeds});
  //   }); 
 
  // }
  // componentWillUnmount() {
  //    if (this.newsFeedTracker) {
  //     this.newsFeedTracker.stop();
  //     }
  // }  
  newsFeeds(){
    return this.props.newsFeeds.map((newsFeeds,index) =>{
      // console.log("newsFeeds",newsFeeds);
      return(
        <div key={index}>
         { newsFeeds.newsVideoType == "YouTubeVideo" ?
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
              <iframe style={{maxWidth:100+'%',height:160+'px'}} src={"https://www.youtube.com/embed/" + newsFeeds.newsYouTubeVideo} allowFullScreen frameBorder="0"></iframe>
            </div>
            // <YoutubeEmbedVideo suggestions={false}  width={250} height={120} controls videoId={getVideoId(newsFeeds.newsYouTubeVideo)} />
           : 
            newsFeeds.newsVideoType == "LocalImage" ?
            <img src={newsFeeds.newsImage} className="noProfilePadding col-lg-12 col-md-12 col-sm-12 col-xs-12" />

           : <video width="120" height="120" controls className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
               <source src={newsFeeds.newsVideo} type="video/mp4" />
            </video>   
          }   
          <p>{newsFeeds.newsFeedTitile}</p>
          <p>{newsFeeds.newsDescription.substring(0,95)}..</p>
          <hr className="horizontalLine col-lg-11 col-md-11 col-sm-11 col-xs-11" />
          {/*<div id="myModal" className="modal fade ">
            <div className="modal-dialog modal-lg">
            <button type="button" className="close videoBtnPosition" data-dismiss="modal" aria-hidden="true">&times;</button>
              <iframe className="videoMmodal" width="560" height="315" src="https://www.youtube.com/embed/7wtfhZwyrcc" frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>*/}
        </div>
        );
      });
    }
  render() {
    if (!this.props.loading) {
      return (
        <div>
           {this.newsFeeds()}
         </div>
      );
    }else{
      return(
        <span>Loading</span>
        );
    }
  } 
} 
NewsFeedContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('newsFeedData');
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    var newsFeeds   = NewsFeeds.find({}).fetch() || [];
    // console.log("newsFeeds",newsFeeds);
    const loading   = !postHandle.ready();
    
    // if(_id){
      return {
          loading,
          newsFeeds,
      };
    // }
})(NewsFeed);

export default NewsFeedContainer;
