import React,{Component} from 'react';

import CorporateHeader from '/imports/common/header/corporateHeader/components/CorporateHeader.jsx';
import CorporateFooter from '/imports/common/footer/corporateFooter/CorporateFooter.jsx';

export const CorporateLayout = ({content})=>(
  <div className="">     
  		<CorporateHeader />     
      	{content} 
      <CorporateFooter />          
  </div>    
);