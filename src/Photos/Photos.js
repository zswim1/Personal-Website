import React from 'react';
import './Photos.css';
import Family from './Family.jpg';
import Bike from './bike.png';
import Grandpa from './Grandpa.jfif';
import Mountain from './Mountain.jfif'

function Photos(){
    return(
        <div id="bottomPictures">
            <div id="row1" className="row">
                <img id="bikePic" src={Bike} alt="Bike"/>
                <img id="footballPic" src={Grandpa} alt="Grandpa"/>
            </div>
            <div id="row2" class="row">
                <img id="familyPic" src={Family} alt="Family"/>
                <img id="mountainPic" src={Mountain} alt="Mountain"/>
            </div>
        </div>
    );
}

export default Photos;