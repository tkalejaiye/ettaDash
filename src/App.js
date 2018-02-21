import React, { Component } from "react";
import "./App.css";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import io from "socket.io-client";

const columns = [
  {
    dataField: "date",
    text: "Date",
    sort: true
  },
  {
    dataField: "name",
    text: "Name",
    sort: true
  },
  {
    dataField: "timeIn",
    text: "Time In"
  },
  {
    dataField: "timeOut",
    text: "Time Out"
  },
  {
    dataField: "location",
    text: "Location"
  }
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: []
    };
    this.getTimeFromDate = this.getTimeFromDate.bind(this);
    this.getDate = this.getDate.bind(this);
  }

  componentWillMount() {
    this.socket = io.connect("https://peaceful-castle-10340.herokuapp.com");
  }

  componentDidMount() {
    this.fetchLogs();

    this.socket.on("entry", data => {
      console.log(data);
      this.fetchLogs();
    });
  }

  fetchLogs() {
    fetch("https://peaceful-castle-10340.herokuapp.com/logs")
      .then(response => response.json())
      .then(logs => {
        logs.forEach(log => {
          log.date = this.getDate(log.date);
          log.timeIn = this.getTimeFromDate(log.timeIn);
          log.timeOut = log.timeOut ? this.getTimeFromDate(log.timeOut) : "-";
        });
        this.setState({ logs });
      });
  }

  getDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  getTimeFromDate(date) {
    return moment(date).format("h:mm:ss a");
  }

  render() {
    return (
      <div className="App">
        <BootstrapTable
          keyField="_id"
          data={this.state.logs}
          columns={columns}
          striped
          bordered
        />
      </div>
    );
  }
}

export default App;
