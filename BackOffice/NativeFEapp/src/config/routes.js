
import {StackNavigator, TabNavigator} from 'react-navigation';

import LogIn from '../layouts/LogIn/LogIn.js';
import SignUp from '../layouts/SignUp/SignUp.js';
import SubmitOTP from '../layouts/SubmitOTP/SubmitOTP.js';
import ForgotPassword from '../layouts/ForgotPassword/ForgotPassword.js';
import ReceivedOTP from '../layouts/ReceivedOTP/ReceivedOTP.js';
import ResetPassword from '../layouts/ResetPassword/ResetPassword.js';

import ListOfTickets from '../layouts/ListOfTickets/ListOfTickets.js';
import NewTickets from '../layouts/ListOfTickets/NewTickets.js';
import CompletedAcceptedTickets from '../layouts/ListOfTickets/CompletedAcceptedTickets.js';
import CompletedRejectedTickets from '../layouts/ListOfTickets/CompletedRejectedTickets.js';
import ReopenedTickets from '../layouts/ListOfTickets/ReopenedTickets.js';
import AllocatedTickets from '../layouts/ListOfTickets/AllocatedTickets.js';

import ViewTicket from '../layouts/ViewTicket/ViewTicket.js';
import ViewTicketForm from '../layouts/ViewTicket/ViewTicketForm.js';
import ViewTicketNextForm from '../layouts/ViewTicket/ViewTicketNextForm.js';
import ViewSubmittedTicketContainer from '../layouts/ViewTicket/ViewSubmittedTicketContainer.js';

import Camera from '../layouts/Camera/Camera.js';
import CameraImgPicker from '../layouts/Camera/CameraImgPicker.js';
import CameraView from '../layouts/CameraView/CameraView.js';
import CameraGallery from '../layouts/CameraGallery/CameraGallery.js';
// import VideoRecording from '../layouts/VideoRecording/VideoRecording.js';

import Dashboard from '../layouts/Dashboard/Dashboard.js';
import MyProfile from '../layouts/MyProfile/MyProfile.js';
import EditMyProfile from '../layouts/EditMyProfile/EditMyProfile.js';
import ChangePassword from '../layouts/ChangePassword/ChangePassword.js';
import GeoTagging from '../layouts/GeoTagging/GeoTagging.js';
import MapDisplay from '../layouts/GeoTagging/MapDisplay.js';


import NotificationLayout from '../layouts/NotificationLayout/NotificationLayout.js';

export const AuthStack = StackNavigator({

  Dashboard:{
     screen: Dashboard,
    navigationOptions: {
      header: null
    }
  },
  
  MapDisplay:{
    screen:MapDisplay,
    navigationOptions:{
      header:null
    }
  },
  
  CameraImgPicker:{
      screen: CameraImgPicker,
      navigationOptions: {
      header: null
    }
  },


  
  GeoTagging:{
    screen:GeoTagging,
    navigationOptions:{
      header:null
    }
  },




  // VideoRecording:{
  //     screen: VideoRecording,
  //     navigationOptions: {
  //     header: null
  //   }
  // },

  // VideoRecording:{
  //     screen: VideoRecording,
  //     navigationOptions: {
  //     header: null
  //   }
  // },


  AllocatedTickets: {
  screen: AllocatedTickets,
  navigationOptions: {
    header: null
    }
  },
  ReopenedTickets: {
  screen: ReopenedTickets,
  navigationOptions: {
    header: null
    }
  },


  CompletedRejectedTickets: {
  screen: CompletedRejectedTickets,
  navigationOptions: {
    header: null
    }
  },

  CompletedAcceptedTickets: {
  screen: CompletedAcceptedTickets,
  navigationOptions: {
    header: null
    }
  },

  NewTickets: {
  screen: NewTickets,
  navigationOptions: {
    header: null
    }
  },

  ListOfTickets: {
  screen: ListOfTickets,
  navigationOptions: {
    header: null
    }
  },
  
  Camera:{
    screen:Camera,
    navigationOptions:{
      header:null
    }
  },

  ViewSubmittedTicket: {
  screen: ViewSubmittedTicketContainer,
  navigationOptions: {
    header: null
    }
  },


  ViewTicket: {
    screen: ViewTicket,
    navigationOptions: {
      header: null
    }
  },

  ViewTicketForm:{
    screen:ViewTicketForm,
    navigationOptions:{
      header:null
    }
  },

  ViewTicketNextForm:{
    screen:ViewTicketNextForm,
    navigationOptions:{
      header:null
    }
  },
  
   CameraView:{
    screen:CameraView,
    navigationOptions:{
      header:null
    }
  },

  CameraGallery:{
    screen:CameraGallery,
    navigationOptions:{
      header:null
    }
  },

   NotificationLayout:{
     screen: NotificationLayout,
    navigationOptions: {
      header: null
    }
  },


  EditMyProfile:{
    screen:EditMyProfile,
    navigationOptions:{
      header:null
    }
  },
   MyProfile: {
    screen: MyProfile,
    navigationOptions:{
      header: null
    }
  },

  ChangePassword:{
    screen:ChangePassword,
    navigationOptions:{
      header:null
    }
  },
});


export const HomeStack = StackNavigator({

  LogIn: {
    screen: LogIn,
    navigationOptions: {
      header: null
    }
  },
  SubmitOTP:{
    screen: SubmitOTP,
    navigationOptions: {
      header: null
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null
    }
  },

  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      header: null
    }
  },
  ReceivedOTP: {
    screen: ReceivedOTP,
    navigationOptions: {
      header: null
    }
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: {
      header: null
    }
  },
});
