import React from "react";
import "./App.css";
import { Button, Modal, Form, Alert } from "react-bootstrap";
class Card extends React.Component {
  state = {
    edit: false,
    delete: false
  };
  editClose = () => {
    this.setState({ edit: false, title: "", body: "" });
    this.props.Update();
  };
  editOpen = () => {
    this.setState({
      edit: true,
      title: this.props.data.title,
      body: this.props.data.body
    });
  };
  confOpen = () => {
    this.setState({ delete: true });
  };
  confClose = () => {
    this.setState({ delete: false });
  };

  Change = event => {
    let key = event.target.name;
    this.setState({ [key]: event.target.value });
  };
  Delete = () => {
    fetch("https://jsonplaceholder.typicode.com/posts/" + this.props.data.id, {
      method: "DELETE"
    })
      .then(event => {
        this.confClose();
        this.props.onSuccess();
        this.props.Update();
      })
      .catch(err => {
        this.confClose();
        this.props.Update();
      });
  };
  Submit = () => {
    if (
      this.state.title === this.props.data.title &&
      this.state.body === this.props.data.body
    ) {
      this.props.onWarning();
      this.editClose();
    } else {
      fetch(
        "https://jsonplaceholder.typicode.com/posts/" + this.props.data.id,
        {
          method: "PUT",
          body: JSON.stringify({
            id: this.props.data.id,
            title: this.state.title,
            body: this.state.body,
            userId: this.props.data.userId
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        }
      )
        .then(response => response.json())
        .then(json => {
          console.log(json);
          this.props.onSuccess();
          this.editClose();
        })
        .catch(err => console.log(err));
    }
    console.log(
      this.state.title !== this.props.data.title ||
        this.state.body !== this.props.data.body
    );
    // this.props.onError();
    // this.editClose();
    // console.log(this.state.title, this.state.body);
  };
  render() {
    return (
      <div className="border" style={{ padding: "25px" }}>
        <h3 style={{ textAlign: "left" }}> {this.props.data.title}</h3>
        <div class="dropdown-divider" />
        <p>{this.props.data.body}</p>
        <Button
          variant="primary"
          onClick={event => {
            this.editOpen();
          }}
        >
          Edit
        </Button>
        <Button
          variant="warning"
          onClick={event => {
            this.confOpen();
          }}
        >
          Delete
        </Button>

        <DialogBox
          Change={this.Change}
          state={this.state}
          close={this.editClose}
          Submit={this.Submit}
        />
        <Modal size="lg" show={this.state.delete} onHide={this.confClose}>
          <Modal.Header closeButton>
            <Modal.Title>Do you want to delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Button
              variant="primary"
              onClick={event => {
                this.Delete();
              }}
            >
              OK
            </Button>
            <Button
              variant="secondary"
              onClick={event => {
                this.confClose();
              }}
            >
              Cancle
            </Button>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
class DialogBox extends React.Component {
  render() {
    return (
      <Modal
        size="lg"
        show={this.props.state.edit}
        onHide={event => this.props.close()}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={event => {
              event.preventDefault();
              this.props.Submit(event);
            }}
          >
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                onChange={event => {
                  this.props.Change(event);
                }}
                name="title"
                value={this.props.state.title}
              />
            </Form.Group>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={this.props.state.body}
                name="body"
                onChange={event => {
                  this.props.Change(event);
                }}
                rows="3"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={event => {
                this.props.Submit();
              }}
            >
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
class App extends React.Component {
  state = {
    result: [],
    showSuccess: false,
    showError: false,
    showWarning: false
  };

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(json => {
        this.setState({ result: json });
      });
  }
  Update = () => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(response => response.json())
      .then(json => {
        this.setState({ result: json });
      });
  };
  onSuccess = () => {
    this.setState({ showSuccess: true });
  };
  onError = () => {
    this.setState({ showError: true });
  };
  onWarning = () => {
    this.setState({ showWarning: true });
  };
  componentDidUpdate() {
    if (this.state.showError) {
      setTimeout(() => {
        this.setState({ showError: false });
      }, 1000);
    }
    if (this.state.showSuccess) {
      setTimeout(() => {
        this.setState({ showSuccess: false });
      }, 1000);
    }
    if (this.state.showWarning) {
      setTimeout(() => {
        this.setState({ showWarning: false });
      }, 1000);
    }
  }
  render() {
    return (
      <div>
        <Alert show={this.state.showSuccess} variant="success">
          <Alert.Heading>Success</Alert.Heading>
        </Alert>
        <Alert show={this.state.showError} variant="danger">
          <Alert.Heading>Failed</Alert.Heading>
        </Alert>
        <Alert show={this.state.showWarning} variant="info">
          <Alert.Heading>No Edit to save</Alert.Heading>
        </Alert>
        <div
          style={{ textAlign: "center" }}
          className="p-3 mb-2 bg-primary text-white"
        >
          <h2>List</h2>
        </div>
        {this.state.result.map(list => {
          return (
            <Card
              onSuccess={this.onSuccess}
              onError={this.onError}
              onWarning={this.onWarning}
              key={list.id}
              Update={this.Update}
              data={list}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
