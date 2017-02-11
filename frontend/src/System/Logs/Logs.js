import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Switch from 'Components/Router/Switch';
import LogsTableConnector from './Table/LogsTableConnector';
import LogFilesConnector from './Files/LogFilesConnector';
import UpdateLogFilesConnector from './Updates/UpdateLogFilesConnector';

class Logs extends Component {

  //
  // Render

  render() {
    return (
      <Switch>
        <Route
          exact={true}
          path="/system/logs"
          component={LogsTableConnector}
        />

        <Route
          path="/system/logs/files"
          component={LogFilesConnector}
        />

        <Route
          path="/system/logs/updatefiles"
          component={UpdateLogFilesConnector}
        />
      </Switch>
    );
  }
}

export default Logs;
