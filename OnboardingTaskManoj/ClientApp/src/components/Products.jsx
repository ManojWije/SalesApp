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

export class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datalist: [],
      loading: true,
      opendelete: false,
      openadd: false,
      editid: "",
      newname: "",
      newprice: "",
      isnamevalid: true,
      ispricevalid: true
    };

    this.handleDelete = this.handleDelete.bind(this); // handell the delete request
    this.handelAdd = this.handelAdd.bind(this); //handel the add edit request
    this.editFunction = this.editFunction.bind(this);
    this.addFunction = this.addFunction.bind(this);
    this.deleteFunction = this.deleteFunction.bind(this);
    this.closeAdd = this.closeAdd.bind(this);
    this.closeDelete = this.closeDelete.bind(this);
    this.handleName = this.handleName.bind(this); //handel add edit name by user
    this.handlePrice = this.handlePrice.bind(this); //handell add edit price by user
  }

  componentDidMount() {
    fetch("api/Products")
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

  editFunction(id, name, price) {
    this.editid = id;
    this.setState({ openadd: true, newname: name, newprice: price });
  }

  handelAdd() {
    if (this.state.newname === "") {
      this.setState({ isnamevalid: false });
    } else if (isNaN(this.state.newprice) || this.state.newprice === "") {
      this.setState({ ispricevalid: false });
    } else {
      if (this.editid > 0) {
        let data = {
          id: this.editid,
          name: this.state.newname,
          price: this.state.newprice
        };

        fetch("api/Products/" + this.editid, {
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
          price: this.state.newprice
        };

        fetch("api/Products/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(this.setState({ openadd: false }));
        let newdata = [...this.state.datalist];
        newdata.push(data);
        this.setState({ datalist: newdata });
      }
      this.setState({
        newcustname: "",
        newprice: "",
        isnamevalid: true,
        ispricevalid: true
      });
    }
  }

  closeAdd() {
    this.editid = 0;
    this.setState({ openadd: false, isnamevalid: true, ispricevalid: true });
  }

  deleteFunction(id) {
    this.setState({ opendelete: true, deleteid: id });
  }

  handleDelete() {
    this.setState({ opendelete: false });
    fetch("api/Products/" + this.state.deleteid, {
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
    this.setState({ newname: event.target.value, isnamevalid: true });
  }

  handlePrice(event) {
    this.setState({ newprice: event.target.value, ispricevalid: true });
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
        <h1>Products</h1>
        <p>
          <Button
            content="Add Products"
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
          <Header>{this.editid > 0 ? "Edit Product" : "Add Product"}</Header>
          <Modal.Content>
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Name</Table.Cell>
                  <Table.Cell>
                    <Input
                      type="text"
                      placeholder="Name..."
                      onChange={this.handleName}
                      value={this.editid > 0 ? this.state.newname : null}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {this.state.isnamevalid ? (
                      ""
                    ) : (
                      <Label basic color="red">
                        Values can not be null
                      </Label>
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Price</Table.Cell>
                  <Table.Cell>
                    <Input
                      type="text"
                      placeholder="Price..."
                      onChange={this.handlePrice}
                      value={this.editid > 0 ? this.state.newprice : null}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {this.state.ispricevalid ? (
                      ""
                    ) : (
                      <Label basic color="red">
                        Price should be a number
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
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {datalist.map(item => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.price}</Table.Cell>
                  <Table.Cell>
                    <Button
                      content="Edit"
                      icon="edit"
                      labelPosition="left"
                      color="yellow"
                      onClick={() =>
                        this.editFunction(item.id, item.name, item.price)
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
