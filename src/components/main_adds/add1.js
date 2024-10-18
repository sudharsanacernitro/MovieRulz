
import React from "react";
import './add1.css';

function Add1(){

return(<><div className="add_container">
    <img src={`${process.env.PUBLIC_URL}/add1.gif`} alt="Image" id="add"/>
    <div id="add_content">
    <span>WATCH NOW</span>
      <span1>WITH PREMIUM %</span1>  
    </div>
</div></>);

}


export default Add1;