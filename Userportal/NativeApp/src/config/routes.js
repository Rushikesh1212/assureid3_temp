import {StackNavigator, TabNavigator} from 'react-navigation';

import LogIn from '../layouts/LogIn/LogIn.js';
import SignUp from '../layouts/SignUp/SignUp.js';
import SubmitOTP from '../layouts/SubmitOTP/SubmitOTP.js';
import ForgotPassword from '../layouts/ForgotPassword/ForgotPassword.js';
import ReceivedOTP from '../layouts/ReceivedOTP/ReceivedOTP.js';
import ResetPassword from '../layouts/ResetPassword/ResetPassword.js';

import Dashboard from '../layouts/Dashboard/Dashboard.js';
import ProfileLandingPage from '../layouts/Dashboard/ProfileLandingPage.js';
import EditMyProfile from '../layouts/EditMyProfile/EditMyProfile.js';
import ChangePassword from '../layouts/ChangePassword/ChangePassword.js';

import MyProfile from '../layouts/MyProfile/MyProfile.js';
// import BasicForm from '../layouts/MyProfile/BasicForm.js';
import StatutoryForm from '../layouts/MyProfile/StatutoryForm.js';
import AcademicForm from '../layouts/MyProfile/AcademicForm.js';
import AddressForm from '../layouts/MyProfile/AddressForm.js';
import CertificateForm from '../layouts/MyProfile/CertificateForm.js';
import OtherInfoForm from '../layouts/MyProfile/OtherInfoForm.js';
import EmploymentInfo from '../layouts/MyProfile/EmploymentInfo.js';
import NotificationLayout from '../layouts/NotificationLayout/NotificationLayout.js';
import ServiceInfo from '../layouts/Services/ServiceInfo.js';

import RequiredInformation from '../layouts/Services/RequiredInformation.js';
import BasicInformation from '../layouts/ViewProfile/BasicInformation.js';
import AddressInformation from '../layouts/ViewProfile/AddressInformation.js';
import AcademicsInformation from '../layouts/ViewProfile/AcademicsInformation.js';
import ExperienceInformation from '../layouts/ViewProfile/ExperienceInformation.js';
import Skills from'../layouts/ViewProfile/Skills.js';
import CertificationInformation from'../layouts/ViewProfile/CertificationInformation.js';
import Invoice from'../layouts/Invoice/Invoice.js';
import InvoiceReciept from '../layouts/Invoice/InvoiceReciept.js';
import PaymentGateway from '../layouts/Invoice/PaymentGateway.js';
import MyOrder from '../layouts/Dashboard/MyOrder.js';
import OrderVerification from '../layouts/Dashboard/OrderVerification.js';

import IdentityInformation from '../layouts/ViewProfile/IdentityInformation.js';
import OurServicesBlock from '../layouts/Services/OurServicesBlock.js';
import LatestUpdatesBlock from '../layouts/Services/LatestUpdatesBlock.js';
import NewsFeed from '../layouts/Dashboard/NewsFeed.js';
import Settings from '../layouts/Settings/Settings.js';
import ViewProfile from '../layouts/ViewProfile/ViewProfile.js';

import PackageInfo from '../layouts/Packages/PackageInfo.js';
import PackageRequiredData from '../layouts/Packages/PackageRequiredData.js';

// import NotificationLayout from '../layouts/NotificationLayout/NotificationLayout.js';
// import React,{Component } from 'react';
// import { Text, View } from 'react-native';
export const AuthStack = StackNavigator({
  
  ProfileLandingPage: {
    screen: ProfileLandingPage,
    navigationOptions:{
      header: null
    }
  },
  
  NewsFeed:{
    screen: NewsFeed,
    navigationOptions: {
      header: null
    }
  },
  
  MyProfile:{
    screen: MyProfile,
    navigationOptions:{
      header: null
    }
  },
  
  CertificateForm:{
    screen: CertificateForm,
    navigationOptions: {
      header: null
    }
  },
  
  ViewProfile:{
    screen: ViewProfile,
    navigationOptions: {
      header: null
    }
  },

  // BasicForm:{
  //   screen: BasicForm,
  //   navigationOptions: {
  //     header: null
  //   }
  // },

  
  
  OtherInfoForm:{
    screen: OtherInfoForm,
    navigationOptions: {
      header: null
    }
  },
  
  EmploymentInfo: {
    screen: EmploymentInfo,
    navigationOptions:{
      header: null,
    }
  },

  AcademicForm: {
    screen: AcademicForm,
    navigationOptions:{
      header: null
    }
  },

  AddressForm:{
    screen: AddressForm,
    navigationOptions: {
      header: null
    }
  },

  StatutoryForm: {
    screen: StatutoryForm,
    navigationOptions:{
      header:null
    }
  },
  
  MyOrder:{
    screen: MyOrder,
    navigationOptions: {
      header: null
    }
  },

  IdentityInformation:{
    screen: IdentityInformation,
    navigationOptions: {
      header: null
    }
  },
  OrderVerification:{
    screen: OrderVerification,
    navigationOptions: {
      header: null
    }
  },

  InvoiceReciept: {
    screen: InvoiceReciept,
    navigationOptions:{
      header:null
    }
  },
  Invoice: {
    screen: Invoice,
    navigationOptions:{
      header:null
    }
  },
  PaymentGateway: {
    screen: PaymentGateway,
    navigationOptions:{
      header:null
    }
  },
  CertificationInformation: {
    screen: CertificationInformation,
    navigationOptions:{
      header:null
    }
  },
  Skills: {
    screen: Skills,
    navigationOptions:{
      header:null
    }
  },    
  
  ExperienceInformation: {
    screen: ExperienceInformation,
    navigationOptions:{
      header:null
    }
  },
  AddressInformation: {
    screen: AddressInformation,
    navigationOptions:{
      header:null
    }
  },
  AcademicsInformation: {
    screen: AcademicsInformation,
    navigationOptions:{
      header:null
    }
  },
  BasicInformation: {
    screen: BasicInformation,
    navigationOptions:{
      header:null
    }
  },
  
  ServiceInfo: {
    screen: ServiceInfo,
    navigationOptions:{
      header:null
    }
  },

  PackageInfo: {
    screen: PackageInfo,
    navigationOptions:{
      header:null
    }
  },

  PackageRequiredData: {
    screen: PackageRequiredData,
    navigationOptions:{
      header:null
    }
  },

  RequiredInformation: {
      screen: RequiredInformation,
      navigationOptions:{
        header:null
      }
    },
  
  Dashboard:{
     screen: Dashboard,
    navigationOptions: {
      header: null
    }
  },

  OurServicesBlock:{
    screen: OurServicesBlock,
    navigationOptions: {
      header: null
    }
  },

  LatestUpdatesBlock:{
    screen: LatestUpdatesBlock,
    navigationOptions: {
      header: null
    }
  },

  Settings:{
    screen: Settings,
    navigationOptions: {
      header: null
    }
  },

  //  NotificationLayout:{
  //    screen: NotificationLayout,
  //   navigationOptions: {
  //     header: null
  //   }
  // },
 
});


export const HomeStack = StackNavigator({
  
  LogIn: {
    screen: LogIn,
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
