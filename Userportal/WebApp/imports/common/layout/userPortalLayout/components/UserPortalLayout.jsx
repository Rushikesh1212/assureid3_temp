import React,{Component} from 'react';
// import header and footer
import UserPortalHeader from '/imports/common/header/userPortalHeader/components/UserPortalHeader.jsx';
import UserPortalFooter from '/imports/common/footer/userPortalFooter/components/UserPortalFooter.jsx';

export const UserPortalLayout = ({content})=>(
	<div className="">          
		<UserPortalHeader />          
			{content}          
		<UserPortalFooter />      
	</div>    
); 
	