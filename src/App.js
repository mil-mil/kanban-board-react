import React, { Component } from 'react';
import KanbanBoard from './Components/KanbanBoard'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App container">
        <div className="row">
            <KanbanBoard />
        </div>
      </div>
    );
  }
}

export default App;
