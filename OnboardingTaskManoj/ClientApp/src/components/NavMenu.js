import React, { Component } from "react";
/*import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";*/
import { Link } from "react-router-dom";
import "./NavMenu.css";
import { Menu } from "semantic-ui-react";

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <Menu>
        <Menu.Item>
          <h2>React</h2>
        </Menu.Item>
        <Menu.Item>
          <Link to="/Sales">Sales</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/Customers">Customers</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/Products">Products</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/Stores">Stores</Link>
        </Menu.Item>
      </Menu>
    );
    /*return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3"
          light
        >
          <Container>
            <NavbarBrand tag={Link} to="/">
              React
            </NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={!this.state.collapsed}
              navbar
            >
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/customers">
                    Customers
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/stores">
                    Stores
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/products">
                    Products
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/Sales">
                    Sales
                  </NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );*/
  }
}
