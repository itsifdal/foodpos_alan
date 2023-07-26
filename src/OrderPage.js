import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form  } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BillReceipt from './BillReceipt';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressCard, faListUl, faCircleUser, faAngleDown } from '@fortawesome/free-solid-svg-icons'

const OrderPage = () => {
  const [menus, setMenus] = useState([]);
  const [selectedMenus, setSelectedMenus] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [customerMoney, setCustomerMoney] = useState(0);

  useEffect(() => {
    // Fetch menu data from the API using Axios
    axios
      .get('http://localhost:8000/api/menu') // Assuming your backend runs on port 8000
      .then((response) => {
        // Modify the data to include the full image URL
        const menusWithImageUrls = response.data.map((menu) => ({
          ...menu,
          gambar: `http://localhost:8000/images/${menu.gambar}`, // Assuming your backend serves images from '/images' directory
        }));
        setMenus(menusWithImageUrls);
      })
      .catch((error) => console.error('Error fetching menu data:', error));
  }, []);

  const handleCardClick = (menu) => {
    const updatedMenus = [...selectedMenus];
    const existingMenu = updatedMenus.find((selectedMenu) => selectedMenu.id === menu.id);
    if (existingMenu) {
      existingMenu.quantity += 1;
    } else {
      updatedMenus.push({ ...menu, quantity: 1 });
    }
    setSelectedMenus(updatedMenus);
  };

  const calculateTotalPrice = () => {
    return selectedMenus.reduce((total, menu) => total + menu.harga * menu.quantity, 0);
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
  };

  const handleShowSaveModal = () => {
    setShowSaveModal(true);
  };

  const handleCloseSaveModal = () => {
    setShowSaveModal(false);
    clearSelectedMenus();
  };

  const handleShowPrintModal = () => {
    setShowPrintModal(true);
  };

  const handleClosePrintModal = () => {
    setShowPrintModal(false);
  };

  const handleShowChargeModal = () => {
    setShowChargeModal(true);
  };

  const handleCloseChargeModal = () => {
    setShowChargeModal(false);
    setCustomerMoney(0);
    clearSelectedMenus();
  };

  const clearSelectedMenus = () => {
    setSelectedMenus([]);
  };

  const printModalContent = () => {
    const printWindow = window.open('', '_blank', 'width=1000,height=800'); // Create a new window for printing
    if (printWindow) {
      const modalContent = document.getElementById('modalContent').innerHTML; // Get the modal content to print
  
      // Generate the complete HTML content for the new window
      const htmlContent = `
        <html>
          <head>
            <title>Struk Billing</title>
            <style>
              /* @media print styles */
              @media print {
                /* Your print-specific styles with !important */
                .print-hidden {
                  display: none !important;
                }
              }
            </style>
          </head>
          <body>
            ${modalContent}
          </body>
        </html>
      `;
  
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('Please allow pop-ups for this website to print the Struk Billing.');
    }
  };

  const handlePrintBill = () => {
    printModalContent(); // Trigger the print dialog
  };

  const handleClearSale = () => {
    clearSelectedMenus();
  };

  return (
    <Container className="mt-4">
      <Link to="/"> {/* Use the Link component to navigate to the "Order Page" */}
        <Button variant="primary" className="mb-4">List Menu</Button>
      </Link>
      <Row>
        <Col sm={8}>
          {/* Left Container */}
          <Row md={4}>
            {menus.map((menu) => (
              <Col
                key={menu.id}
                md={4}
                lg={3}
                className="mb-3"
                onClick={() => handleCardClick(menu)} // Attach onClick event directly to Card
                style={{ cursor: 'pointer' }} // Add cursor style to indicate clickability
              >
                <Card key={menu.id} className="shadow mb-3 bg-white rounded">
                  <Card.Img variant="top" src={menu.gambar} style={{ height: '140px', objectFit: 'cover' }} />
                  <Card.Body style={{ padding: '10px 10px 10px 15px' }}>
                    <Card.Title>{menu.nama_menu}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col sm={4}>
          {/* Right Container */}

          <div className="text-center print-hidden" style={{ backgroundColor: "rgb(191 211 241)", fontWeight: "500", fontSize:"26px"}}>
            <div style={{ display: 'inline-block', marginLeft: '5px', float: "left"  }}><FontAwesomeIcon icon={faCircleUser} /></div>
            <div style={{ display: 'inline-block' }}> New Customer </div>
            <div style={{ display: 'inline-block', marginRight: '5px', float: "right" }}> <FontAwesomeIcon icon={faListUl} /> </div>
          </div>

          <Card id="modalContent" style={{ borderRadius: '2px' }}>
            <Card.Header className="text-center print-hidden">Dine In {' '} <FontAwesomeIcon icon={faAngleDown} style={{color: "#4f85e3"}} /> </Card.Header>
            <Card.Body>
              {selectedMenus.length === 0 ? (
                <p>No items in order.</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr className="print-hidden">
                      <th style={{color: "#4f85e3"}}>1</th>
                      <th></th>
                      <th className="text-right" style={{color: "#4f85e3"}}>View Table</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMenus.map((selectedMenu) => (
                      <tr key={selectedMenu.id}>
                        <td>{selectedMenu.nama_menu}</td>
                        <td className="text-center">x{selectedMenu.quantity}</td>
                        <td className="text-right">{formatPrice(selectedMenu.harga * selectedMenu.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <p className="text-right">Sub-Total : {formatPrice(calculateTotalPrice())}</p>
              <p className="text-right">Total : {formatPrice(calculateTotalPrice())}</p>

              <hr />
              
              {/* Clear Sale button */}
              <div className="text-center print-hidden">
                <p style={{ fontWeight: '100', cursor: 'pointer' }} onClick={handleClearSale}>
                  Clear Sale
                </p>
              </div>

              <hr />
            </Card.Body>

            <div className="text-center print-hidden" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button variant="primary" onClick={handleShowSaveModal} style={{ width: '100%', borderRadius: '2px', backgroundColor: "rgb(191 211 241)", border: "none", color: "black", fontWeight: "500"}}>
                Save Bill
              </Button>{' '}
              <Button variant="success" className="mr-2" onClick={handleShowPrintModal} style={{ width: '100%', borderRadius: '2px', backgroundColor: "rgb(191 211 241)", border: "none", color: "black", fontWeight: "500"}}>
                Print Bill
              </Button>
            </div>

            <div className="text-center print-hidden" onClick={handleShowChargeModal} style={{ cursor: 'pointer' }}>
               <Button variant="success" className="mr-2" style={{ width: '100%', borderRadius: '2px', backgroundColor: "rgb(73 93 167)", border: "none", color: "white", fontWeight: "500", fontSize:"22px"}}>
               <FontAwesomeIcon icon={faAddressCard} style={{ marginRight: '5px' }} /> | Charge{' '}{formatPrice(calculateTotalPrice())}
              </Button>
            </div>

          </Card>
          

        </Col>
      </Row>
      {/* Modal for "Save Bill" */}
      <Modal show={showSaveModal} onHide={handleCloseSaveModal}>
        <Modal.Header closeButton>
          <Modal.Title>Berhasil</Modal.Title>
        </Modal.Header>
        <Modal.Body>Pembayaran telah disimpan</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSaveModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for "Print Bill" */}
      <Modal show={showPrintModal} onHide={handleClosePrintModal}>
      <Modal.Header closeButton>
            <Modal.Title>Struk Billing</Modal.Title>
      </Modal.Header>
      <Modal.Body> {/* Add an id to the Modal.Body */}
            <BillReceipt selectedMenus={selectedMenus} calculateTotalPrice={calculateTotalPrice} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClosePrintModal}>
            Close
        </Button>
        <Button variant="primary" onClick={handlePrintBill}>
            Print
        </Button>
      </Modal.Footer>
      </Modal>

      {/* Modal for "Charge" */}
      <Modal show={showChargeModal} onHide={handleCloseChargeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Total Charge: {formatPrice(calculateTotalPrice())}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="customerMoney">
              <Form.Label className="mb-2"><strong>Uang Pelanggan</strong></Form.Label>
              <Form.Control
                type="number"
                value={customerMoney}
                onChange={(e) => setCustomerMoney(Number(e.target.value))}
              />
            </Form.Group>
          </Form>
          <div className="mt-4">
            {customerMoney > 0 && (
              <div>
                Kembalian : {formatPrice(customerMoney - calculateTotalPrice())}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseChargeModal}>
            Oke
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderPage;
