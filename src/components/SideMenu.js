import React from 'react';
import { Nav } from 'react-bootstrap';

const SideMenu = () => {
  return (
    <Nav className="flex-column bg-dark py-4 px-3" style={{ position: 'fixed', zIndex: 1000, right: 0,top:47 ,height:'400px',width:"236px"}}>
      <Nav.Link href="#home" className="text-light">Case Cause List</Nav.Link>
      <Nav.Link href="#features" className="text-light">My cases</Nav.Link>
      <Nav.Link href="#pricing" className="text-light">E- Filling</Nav.Link>
      <Nav.Link href="#pricing" className="text-light">Search by Case Number</Nav.Link>
    </Nav>
  );
};

export default SideMenu;
