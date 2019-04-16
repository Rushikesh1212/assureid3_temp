import React,{Component} from 'react';

import WebsiteHeader from '/imports/common/header/websiteHeader/components/WebsiteHeader.jsx';
import WebsiteFooter from '/imports/common/footer/websiteFooter/components/WebsiteFooter.jsx';

export const WebsiteLayout = ({content})=>(
	<div className="">          
		<WebsiteHeader />          
			{content}          
		<WebsiteFooter />      
	</div>    
); 
	