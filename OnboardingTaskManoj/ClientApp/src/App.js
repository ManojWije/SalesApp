import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import { Customers } from "./components/Customers";
import { Stores } from "./components/Stores";
import { Products } from "./components/Products";
import { Sales } from "./components/Sales";
export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Sales} />
        <Route path="/Customers" component={Customers} />
        <Route path="/Stores" component={Stores} />
        <Route path="/Products" component={Products} />
        <Route path="/Sales" component={Sales} />
      </Layout>
    );
  }
}
