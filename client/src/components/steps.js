import React from 'react';
import "./steps.css"
function Steps(){
    return(<>
            
            <div className="step1">
                <h1 className="step1-heading" style={{color:"#3f51b5"}}>Step1</h1>
                <p className="step1-subheading" style={{color:"#84a9ac"}}>Register/Login Yourself.</p>
            </div>
            <div className="step2" >
            <h1 className="step1-heading" style={{color:"#3f51b5"}}>Step2</h1>
            <p className="step1-subheading" style={{color:"#84a9ac"}}>Go to amazon website and open that product you want to buy and copy the link/url</p>
            </div>
            <div className="step3">
            <h1 className="step1-heading" style={{color:"#3f51b5"}}>Step3</h1>
            <p className="step1-subheading" style={{color:"#84a9ac"}}>the paste the link in your landing page and press the add button</p>
            </div>
            </>
    )
}
export default Steps;