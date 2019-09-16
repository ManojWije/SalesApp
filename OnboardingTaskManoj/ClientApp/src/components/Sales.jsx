import React, { Component } from "react";

import {
  Button,
  Confirm,
  Table,
  Modal,
  Header,
  Input,
  Dropdown,
  Label
} from "semantic-ui-react";

export class Sales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Saleslist: [],
      Customerlist: [],
      Storelist: [],
      Productlist: [],
      newcustomer: "",
      loading: true,
      opendelete: false,
      deleteid: "",
      openadd: false,
      newdate: "",
      isdatevalid: true
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.afteradd = this.afteradd.bind(this);
    this.ValidateDate = this.ValidateDate.bind(this);
  }

  //Load data
  componentDidMount() {
    fetch("api/Sales")
      .then(response => response.json())
      .then(data => {
        this.setState({ Saleslist: data, loading: false, deleteid: "" });
      });

    fetch("api/Customers")
      .then(response => response.json())
      .then(data => {
        this.setState({ Customerlist: data });
      });

    fetch("api/Stores")
      .then(response => response.json())
      .then(data => {
        this.setState({ Storelist: data });
      });
    fetch("api/Products")
      .then(response => response.json())
      .then(data => {
        this.setState({ Productlist: data });
      });
  }

  afteradd() {
    fetch("api/Sales")
      .then(response => response.json())
      .then(data => {
        this.setState({ Saleslist: data });
      });
    console.log("afteradd");
    console.log(this.state.Saleslist);
  }
  findProduct(idproduct) {
    const selectedProduct = this.state.Productlist.filter(rec => {
      return rec.id === idproduct;
    });
    const productname = selectedProduct.map(name => {
      return name.name;
    });

    return productname;
  }

  findCustomer(idcust) {
    const selectedCustomer = this.state.Customerlist.filter(rec => {
      return rec.id === idcust;
    });
    const custname = selectedCustomer.map(name => {
      return name.name;
    });

    return custname;
  }
  findStore(idstore) {
    const selectedStore = this.state.Storelist.filter(rec => {
      return rec.id === idstore;
    });
    const storename = selectedStore.map(name => {
      return name.name;
    });

    return storename;
  }
  formatdate(date) {
    var dateonly = date.split("T");
    return dateonly[0];
    // console.log(date);
    // return date;
  }
  //Delete
  deleteFunction(id) {
    this.setState({ opendelete: true, deleteid: id });
  }

  handleDelete() {
    this.setState({ opendelete: false });
    fetch("api/Sales/" + this.state.deleteid, {
      method: "delete"
    }).then(() => {
      this.setState({
        Saleslist: this.state.Saleslist.filter(rec => {
          return rec.id !== this.state.deleteid;
        })
      });
    });
  }

  closeDelete = () => this.setState({ opendelete: false });
  // add edit

  addFunction() {
    this.setState({ openadd: true });
  }

  editFunction(id, customerId, productId, storeId, datesold) {
    this.editid = id;
    this.editCustomer = this.findCustomer(customerId);
    this.editprduct = this.findProduct(productId);
    this.editstore = this.findStore(storeId);

    this.setState({ newdate: this.formatdate(datesold), openadd: true });
  }

  closeAdd() {
    this.editid = 0;
    this.setState({ openadd: false });
  }

  handleDate = (event, { value }) => {
    this.setState({ newdate: value });
  };
  customerChanged = (event, { value }) => {
    this.selectedcustomer = value;
  };
  productChanged = (event, { value }) => {
    this.selectedproduct = value;
  };
  storeChanged = (event, { value }) => {
    this.selectedstore = value;
  };

  ValidateDate(dateString) {
    if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(dateString)) {
      let parts = dateString.split("-");
      let day = parseInt(parts[2], 10);
      let month = parseInt(parts[1], 10);
      let year = parseInt(parts[0], 10);
      console.log(year);
      if (month <= 12 && day <= 31) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  handelAdd() {
    if (this.ValidateDate(this.state.newdate)) {
      this.setState({ isdatevalid: false });
    } else {
      if (this.editid > 0) {
        let data = {
          id: this.editid,
          productId: this.selectedproduct,
          customerId: this.selectedcustomer,
          storeId: this.selectedstore,
          date: this.state.newdate
        };

        fetch("api/Sales/" + this.editid, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(this.setState({ openadd: false }));
        let afterdelete = this.state.Saleslist.filter(rec => {
          return rec.id !== this.editid;
        });
        let newdata = [...afterdelete];
        newdata.push(data);
        this.setState({ Saleslist: newdata });
      } else {
        let data = {
          productId: this.selectedproduct,
          customerId: this.selectedcustomer,
          storeId: this.selectedstore,
          date: this.state.newdate
        };

        fetch("api/Sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }).then(this.setState({ openadd: false }));
        let newdata = [...this.state.Saleslist];
        newdata.push(data);
        this.setState({ Saleslist: newdata });
      }
      this.setState({ isdatevalid: true });
    }
  }

  render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderTable(this.state.Saleslist)
    );

    return (
      <div>
        <h1>Sales</h1>
        <p>
          <Button
            content="Add Sales"
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
    return (
      <div>
        <Modal open={this.state.openadd}>
          <Header>{this.editid > 0 ? "Edit Sale" : "Add Sale"}</Header>
          <Modal.Content>
            <Table>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Date</Table.Cell>
                  <Table.Cell>
                    <Input
                      type="text"
                      placeholder={"yyyy-mm-dd"}
                      onChange={this.handleDate}
                      value={this.editid > 0 ? this.state.newdate : null}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {this.state.isdatevalid ? (
                      ""
                    ) : (
                      <Label basic color="red">
                        Date format not correct
                      </Label>
                    )}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Customer</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      fluid
                      selection
                      placeholder={
                        this.editid > 0 ? this.editCustomer : "Customer..."
                      }
                      onChange={this.customerChanged}
                      options={this.state.Customerlist.map(item => ({
                        key: item.id,
                        value: item.id,
                        text: item.name
                      }))}
                    ></Dropdown>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Product</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      fluid
                      selection
                      placeholder={
                        this.editid > 0 ? this.editprduct : "Product..."
                      }
                      onChange={this.productChanged}
                      options={this.state.Productlist.map(item => ({
                        key: item.id,
                        value: item.id,
                        text: item.name
                      }))}
                    ></Dropdown>
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Store</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      fluid
                      selection
                      placeholder={
                        this.editid > 0 ? this.editstore : "Store..."
                      }
                      onChange={this.storeChanged}
                      options={this.state.Storelist.map(item => ({
                        key: item.id,
                        value: item.id,
                        text: item.name
                      }))}
                    ></Dropdown>
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

  renderTable(Saleslist) {
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
                <Table.HeaderCell>Product</Table.HeaderCell>
                <Table.HeaderCell>Customer</Table.HeaderCell>
                <Table.HeaderCell>Store</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {Saleslist.map(item => (
                <Table.Row key={item.id}>
                  <Table.Cell>{this.findProduct(item.productId)}</Table.Cell>
                  <Table.Cell>{this.findCustomer(item.customerId)}</Table.Cell>
                  <Table.Cell>{this.findStore(item.storeId)}</Table.Cell>
                  <Table.Cell>{this.formatdate(item.date)}</Table.Cell>
                  <Table.Cell>
                    <Button
                      content="Edit"
                      icon="edit"
                      labelPosition="left"
                      color="yellow"
                      onClick={id =>
                        this.editFunction(
                          item.id,
                          item.customerId,
                          item.productId,
                          item.storeId,
                          item.date
                        )
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
