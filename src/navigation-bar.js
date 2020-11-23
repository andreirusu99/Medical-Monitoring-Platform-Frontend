import React from 'react'
import logo from './common/images/icon.png';

import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavLink,
    UncontrolledDropdown
} from 'reactstrap';

const textStyle = {
    color: 'white',
    textDecoration: 'none'
};


const NavigationBar = () => (
    <div>
        <Navbar color="dark" light expand="md">
            <NavbarBrand href="/doctor_home">
                <img src={logo} width={"50"}
                     height={"35"}
                     alt="logo"
                />
            </NavbarBrand>
            <Nav className="mr-auto" navbar>

                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle style={textStyle} nav caret>
                        Navigation
                    </DropdownToggle>

                    <DropdownMenu>

                        <DropdownItem>
                            <NavLink href="/doctor_home">Home</NavLink>
                        </DropdownItem>

                        <DropdownItem>
                            <NavLink href="/patients">Patient Management</NavLink>
                        </DropdownItem>

                        <DropdownItem>
                            <NavLink href="/caregivers">Caregiver Management</NavLink>
                        </DropdownItem>

                        <DropdownItem>
                            <NavLink href="/drugs">Drug Management</NavLink>
                        </DropdownItem>

                    </DropdownMenu>
                </UncontrolledDropdown>

            </Nav>
        </Navbar>
    </div>
);

export default NavigationBar
