import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import { HighChartComponent } from './components';
import { MapAndDropDownExample } from './components/MapComponent';
import DevicePage from './components/DevicePage';
import { NoteTable } from './components/NoteTable';
import Yielddetails from './components/yielddetails';
function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Bar Chart</Link>
            </li>
            <li>
              <Link to="/map">Map with Dropdown</Link>
            </li>
            <li>
              <Link to="/devices/84:71:27:85:c6:b2">Redux Firestore example</Link>
            </li>
            <li>
              <Link to="/addyield">Yield and Note example</Link>
            </li>
          </ul>

          <hr />
          <Switch>
            <Route exact path="/">
              <HighChartComponent />
            </Route>
            <Route path="/map">
              <MapAndDropDownExample />
            </Route>
            <Route path="/devices/84:71:27:85:c6:b2">
              <DevicePage />
            </Route>
            <Route path="/addyield">
              <NoteTable />
            </Route>
            <Route path="/yielddetails/:id">
              <Yielddetails />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
