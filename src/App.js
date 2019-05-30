import React from "react";
import "./App.css";

class Card extends React.Component {
  render() {
    return (
      <div className="border" style={{ padding: "25px" }}>
        <h3 style={{ textAlign: "left" }}> {this.props.title}</h3>
        <div class="dropdown-divider" />
        <p>{this.props.body}</p>
        <button type="button" class="btn btn-primary">
          Edit
        </button>
        <button type="button" class="btn btn-warning">
          Delete
        </button>

        <div class="dropdown-divider" />
      </div>
    );
  }
}
class App extends React.Component {
  state = {
    result: []
  };

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(json => {
        this.setState({ result: json });
      });
  }
  render() {
    return (
      <div>
        <div
          style={{ textAlign: "center" }}
          className="p-3 mb-2 bg-primary text-white"
        >
          <h2>List</h2>
        </div>
        {this.state.result.map(list => {
          return <Card key={list.id} title={list.title} body={list.body} />;
        })}
      </div>
    );
  }
}

export default App;
