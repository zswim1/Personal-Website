import React from 'react';
import './Projects.css';
import Button from 'react-bootstrap/Button';
import Basketball from './basketball.png';
import CourseMaster from './CourseMaster.png';
import Drone from './drone.png';
import Milliman from './Milliman.jpg';
import Travel from './Travel.png';


function Projects(){


    const expand = (section, button) => {
        var display = getComputedStyle(document.getElementById(section), null).display;
        console.log(display)
        if(display === "none"){
            document.getElementById(section).style.display = "block";
            document.getElementById(button).innerHTML = "Hide";
        } else {
            document.getElementById(section).style.display = "none";
            document.getElementById(button).innerHTML = "Learn More";
        }
    }


    return(
        <div id="mainContent">

            <div id="Milliman">
                <div id="projectAndButton">
                    <div className="projectHeader">Milliman  <span className="dateInfo">Summer 2019</span></div>
                    <Button id="infoMill" variant="danger" className="infoButton" onClick={() => expand('millContent', 'infoMill')}>Learn More</Button>
                </div>
                <div id="millContent">
                    <br/>
                    <img id="millimage" className="projImage" src={Milliman} alt="Milliman"/>
                    <div className="description" id="millDescription">
                        Summer Internship where I created a web application that was used primarily on the IPAD. Gathered, managed, and displayed large data sets stored on Salesforce. Added Email, Print, and Dropbox functionality using templates and API's.
                    </div>
                    <div className="techHeader">Technologies Used</div>
                    <ul>
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                        <li>Adobe XD</li>
                        <li>Salesforce API</li>
                        <li>Ipad optimization</li>
                    </ul>
                </div>
            </div>

            <div id="TravelTalk">
                <div id="projectAndButton">
                    <div className="projectHeader">TravelTalk  <span className="dateInfo">Spring 2019</span></div>
                    <Button id="infoTT" variant="danger" className="infoButton" onClick={() => expand('ttContent', 'infoTT')}>Learn More</Button>
                </div>
                <div id="ttContent">
                    <div className="youtubeLink">
                            <a href="https://www.youtube.com/watch?v=lVhOerA1oS8&t=23s">Travel Talk Video</a>
                        </div>
                    <img id="ttimage" className="projImage" src={Travel} alt="Travel Talk"/>
                    <div className="description" id="ttDescription">
                        A social platform that allows users to engage in discussions and share their experiences about different places throughout the world. Users were able to tag locations on a map that they had been to and discuss what they had thought about that location. Users were also able to follow and be followed by other users allowing their locations and thoughts to be shared with others.
                    </div>
                    <div className="techHeader">Technologies Used</div>
                    <ul>
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                        <li>React</li>
                        <li>Firebase hosting</li>
                        <li>Map API</li>
                    </ul>
                </div>
            </div>

            <div id="CourseMaster">
                <div id="projectAndButton">
                    <div className="projectHeader">Course Master  <span className="dateInfo">Fall 2018</span></div>
                    <Button id="infoCourse" variant="danger" className="infoButton" onClick={() => expand('courseContent', 'infoCourse')}>Learn More</Button>
                </div>
                <div id="courseContent">
                    <br/>
                    <img id="courseimage" className="projImage" src={CourseMaster} alt="Course Master"/>
                    <div className="description" id="courseDescription">
                        A web application where Purdue students can go to review the courses they have taken and remark on how difficult the course was, how many exams there were, whether attendance was necessary, and many other attributes. As well as leaving reviews, students can look at reviews other students have left to determine what classes they want to take.
                    </div>
                    <div className="techHeader">Technologies Used</div>
                    <ul>
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>JavaScript</li>
                        <li>Angular</li>
                        <li>Firebase hosting</li>
                        <li>Purdue API</li>
                    </ul>
                </div>
            </div>

            <div id="VrBasketball">
                <div id="projectAndButton">
                    <div className="projectHeader">VR Basketball  <span className="dateInfo">Fall 2018</span></div>
                    <Button id="infoBBall" variant="danger" className="infoButton" onClick={() => expand('bballContent', 'infoBBall')}>Learn More</Button>
                </div>
                <div id="bballContent">
                    <div className="youtubeLink">
                        <a href="https://www.youtube.com/watch?v=TpBwJUWcQLg&feature=youtu.be">VR Basketball Video</a>
                    </div>
                    <img id="bballimage" className="projImage" src={Basketball} alt="Basketball VR"/>
                    <div className="description" id="bballDescription">
                        A VR basketball game where the player can practice shooting the ball or race against the clock trying to make baskets.
                    </div>
                    <div className="techHeader">Technologies Used</div>
                    <ul>
                        <li>Unity</li>
                        <li>C#</li>
                        <li>HTC Vive headset</li>
                    </ul>
                </div>
            </div>

            <div id="VrDrone">
                <div id="projectAndButton">
                    <div className="projectHeader">VR Drone Simulator  <span className="dateInfo">Fall 2018</span></div>
                    <Button id="infoDrone" variant="danger" className="infoButton" onClick={() => expand('droneContent', 'infoDrone')}>Learn More</Button>
                </div>
                <div id="droneContent">
                    <div className="youtubeLink">
                            <a href="https://www.youtube.com/watch?v=1xxuXDVefUE">VR Drone Video </a>
                    </div>
                    <img id="droneimage" className="projImage" src={Drone} alt="VR Drone"/>
                    <div className="description" id="droneDescription">
                        A VR third person drone simulator where the player tries to race through a city while driving through gates.
                    </div>
                    <div className="techHeader">Technologies Used</div>
                    <ul>
                        <li>Unity</li>
                        <li>C#</li>
                        <li>HTC Vive headset</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Projects;