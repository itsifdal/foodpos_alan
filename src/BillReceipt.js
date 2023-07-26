import React from 'react';

const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price);
};

const BillReceipt = ({ selectedMenus, calculateTotalPrice }) => {
  return (
    <div>
      <ul>
        {selectedMenus.map((selectedMenu) => (
          <li key={selectedMenu.id}>
            {selectedMenu.nama_menu} - {selectedMenu.harga} x {selectedMenu.quantity}
          </li>
        ))}
      </ul>
      <p>Total: {formatPrice(calculateTotalPrice())}</p>
    </div>
  );
};

export default BillReceipt;
