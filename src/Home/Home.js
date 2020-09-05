import React from 'react';
import './Home.css';
import Button from 'react-bootstrap/Button';
import Headshot from './Headshot.jpg';

function Home(){

    const gotoLinkedIn = () => {
        window.open('https://linkedin.com/in/zachary-swim-47535616a', '_blank');
    }

    const gotoEmail = () => {
        window.location.href='mailto:zach.swim@dmcinfo.com';
    }

    const gotoGithub = () => {
        window.open('https://github.com/zswim1', '_blank');
    }

    return(
        <div id="mainContent">
            <div id="pictures">
                <img id="picture" src={Headshot} alt="Headshot"/>
                <div id="nameAndLinks">
                    <div id="name">Zachary Swim</div>
                    <div id="links">
                        <Button id="EmailLink" variant="outline-danger" className="link" onClick={() => {gotoEmail()}}>Email</Button>
                        <Button id="LinkedInLink" variant="outline-primary" className="link" onClick={() => {gotoLinkedIn()}}>LinkedIn</Button>
                        <Button id="GithubLink" variant="outline-success" className="link" onClick={() => {gotoGithub()}}>Github</Button>
                    </div>
                    <div id="skillTitle">Skills</div>
                    <ul id="skills" list-style-type="disc">
                        <li>C</li>
                        <li>C++</li>
                        <li>C#</li>
                        <li>Java</li>
                        <li>JavaScript</li>
                        <li>HTML</li>
                        <li>CSS</li>
                        <li>React</li>
                        <li>API implementation</li>
                    </ul>
                </div>
            </div>
            <div id="aboutMe">
                <div id="about">
                    <div id="aboutTitle">About Me</div>
                    <div id="aboutText">
                        I'm a Software Engineer in Chicago, IL working for DMC, inc. on full stack tech consulting projects. 
                        I graduated from Purdue University with a B.S. in Computer Science.
                        When I'm not coding, I love to ride my bike, hike, ski, and play card games.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;