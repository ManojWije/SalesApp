import React, { Component } from "react";
import {
  Button,
  Confirm,
  Table,
  Modal,
  Input,
  Header,
  Label
} from "semantic-ui-react";

export class Stores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datalist: [],
      loading: true,
      opendelete: false,
      openadd: false,
      editid: "",
      newname: "",
      newaddress: "",
      isvalid: true
    };

    this.handleDelete = this.handleDelete.bind(this); // handell the delete request
    this.handelAdd = this.handelAdd.bind(this); //handel the add edit request
    this.editFunction = this.editFunction.bind(this);
    this.addFunction = this.addFunction.bind(this);
    this.deleteFunction = this.deleteFunction.bind(this);
    this.closeAdd = this.closeAdd.bind(this);
    this.closeDelete = this.closeDelete.bind(this);
    this.handleName = this.handleName.bind(this); //handel add edit name by user
    this.handleAddress = this.handleAddress.bind(this); //handell add edit address by user
  }

  componentDidMount() {
    fetch("api/Stores")
      .then(response => response.json())
      .then(data => {
        this.setState({
          datalist: data,
          loading: false
        });
      });
  }

  addFunction() {
    this.setState({ openadd: true });
  }

  editFunction(id, name, address) {
    this.editid = id;
    this.setState({ openadd: true, newname: name, newaddress: address });
  }

  handelAdd() {
    if (this.state.newname === "" || this.state.newaddress === "") {
      this.setState({ isvalid: false });
    } else {
      if (this.editid > 0) {
        let data = {
          id: this.editid,
          name: this.state.newname,
          address: this.state.newaddress
        };

        fetch("api/Stores/" + this.editid, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(this.setState({ openadd: false }));
        let afterdelete = this.state.datalist.filter(rec => {
          return rec.id !== this.editid;
        });
        let newdata = [...afterdelete];
        newdata.push(data);
        this.setState({ datalist: newdata });
        this.editid = 0;
      } else {
        let data = {
          name: this.state.newname,
          address: this.state.newaddress
        };

        fetch("api/Stores/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(this.setState({ openadd: false }));
        let newdata = [...this.state.datalist];
        newdata.push(data);
        this.setState({ datalist: newdata });
      }
      this.setState({ isvalid: true, newcustname: "", newaddress: "" });
    }
  }

  closeAdd() {
    this.editid = 0;
    this.setState({ openadd: false, isvalid: true });
  }

  deleteFunction(id) {
    this.setState({ opendelete: true, deleteid: id });
  }

  handleDelete() {
    this.setState({ opendelete: false });
    fetch("api/Stores/" + this.state.deleteid, {
      method: "delete"
    }).then(data => {
      this.setState({
        datalist: this.state.datalist.filter(rec => {
          return rec.id !== this.state.deleteid;
        })
      });
    });
  }

  closeDelete = () => this.setState({ opendelete: false });

  handleName(event) {
    this.setState({ newname: event.target.value, isvalid: true });
  }

  handleAddress(event) {
    this.setState({ newaddress: event.target.value, isvalid: true });
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderTable(this.state.datalist)
    );

    return (
      <div>
        <h1>Stores</h1>
        <p>
          <Button
            content="Add Store"
            icon="plus"
            labelPosition="right"
            color="green"
            onClick={() => this.addFunction()}
          ></Button>
        </p>
        {contents}
      </div>
    );
  }

  renderadd() {
    console.log(this.editname);
    return (
      <div>
        <Modal open={this.state.openadd}>
          <Header>{this.editid > 0 ? "Edit Store" : "Add Store"}</Header>
          <Modal.Content>
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Name</Table.Cell>
                  <Table.Cell>
                    <Input
                      type="text"
                      placeholder={"Name..."}
                      onChange={this.handleName}
                      value={this.editid > 0 ? this.state.newname : null}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Address</Table.Cell>
                  <Table.Cell>
                    <Input
                      type="text"
                      placeholder={"Address..."}
                      onChange={this.handleAddress}
                      value={this.editid > 0 ? this.state.newaddress : null}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell></Table.Cell>
                  <Table.Cell>
                    {this.state.isvalid ? (
                      ""
                    ) : (
                      <Label basic color="red">
                        Values can not be null
                      </Label>
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Save"
              icon="save"
              labelPosition="left"
              color="blue"
              onClick={() => this.handelAdd()}
            ></Button>
            <Button
              content="Close"
              icon="delete"
              labelPosition="left"
              color="red"
              onClick={() => this.closeAdd()}
            ></Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
  renderTable(datalist) {
    return (
      <div>
        {this.renderadd()}

        <div>
          <Confirm
            style={{ position: "static" }}
            size={"mini"}
            open={this.state.opendelete}
            onCancel={this.closeDelete}
            onConfirm={this.handleDelete}
          />
        </div>
        <div>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Address</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {datalist.map(item => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.address}</Table.Cell>
                  <Table.Cell>
                    <Button
                      content="Edit"
                      icon="edit"
                      labelPosition="left"
                      color="yellow"
                      onClick={() =>
                        this.editFunction(item.id, item.name, item.address)
                      }
                    ></Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      content="Delete"
                      icon="delete"
                      labelPosition="left"
                      color="red"
                      onClick={id => this.deleteFunction(item.id)}
                    ></Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }
}
