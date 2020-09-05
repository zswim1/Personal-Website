import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import Home from './Home/Home';
import Projects from './Projects/Projects';
import Photos from './Photos/Photos';
import Exercise from './Exercise/Exercise';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    const makeBold = (id) => {
      // console.log('here');
        var link = document.getElementById(id);
        link.classList.add("Bold");
    };

    const removeBold = (id) => {
        var link = document.getElementById(id);
        link.classList.remove("Bold");
    }

    return (
        <Router>
            <div id="allContent">
                <nav>
                    <div id="navBar">
                        <div id="navName">
                            Zachary Swim
                        </div>
                        <div className="navLinkBox">
                            <Link to="/" id="link1" className="navLink" style={{ textDecoration: 'none' }} onMouseEnter={() => makeBold('link1')} onMouseLeave={() => removeBold('link1')}>Home</Link>
                        </div>
                        <div className="navLinkBox">
                            <Link to="/Projects" id="link2" className="navLink" style={{ textDecoration: 'none' }} onMouseEnter={() => makeBold('link2')} onMouseLeave={() => removeBold('link2')}>Projects</Link>
                        </div>
                        <div className="navLinkBox">
                            <Link to="/Photos" id="link3" className="navLink" style={{ textDecoration: 'none' }} onMouseEnter={() => makeBold('link3')} onMouseLeave={() => removeBold('link3')}>Photos</Link>
                        </div>
                        <div id="exerciseBox" className="navLinkBox">
                            <Link to="/Exercise" id="link4" className="navLink" style={{ textDecoration: 'none' }} onMouseEnter={() => makeBold('link4')} onMouseLeave={() => removeBold('link4')}>Exercise</Link>
                        </div>
                    </div>
                </nav>

                <Switch>
                    <Route path="/Projects">
                        <Projects />
                    </Route>
                    <Route path="/Photos">
                        <Photos />
                    </Route>
                    <Route path="/Exercise">
                        <Exercise />
                    </Route>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
