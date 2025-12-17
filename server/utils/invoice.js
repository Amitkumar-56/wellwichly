// server/utils/invoice.js
'use strict';
const PDFDocument = require('pdfkit');

function currency(v) {
  const n = Number(v || 0);
  return `₹${n.toFixed(2)}`;
}

function generateInvoicePdf(order) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    const invoiceNo = String(order._id || '').slice(-8).toUpperCase();
    const brand = 'Wellwichly Pvt. Ltd.';
    const addr = '212/184, Swaraj Bhawan, Uttar Pradesh 211003, India';
    const phone = '+91 8881917644';
    const email = 'Wellwichly@gmail.com';

    // Header Section
    doc.rect(40, 40, 515, 70).fill('#111827');
    doc.fillColor('#ffffff').fontSize(20).text(brand, 50, 55, { width: 300 });
    doc.fontSize(10).text(addr, 50, 80, { width: 300 });
    doc.text(`Phone: ${phone}`, 50, 95);
    doc.text(`Email: ${email}`, 180, 95);
    doc.fillColor('#ffffff').fontSize(22).text('INVOICE', 370, 55, { width: 170, align: 'right' });
    doc.fontSize(10).text(`Invoice No: ${invoiceNo}`, 370, 80, { width: 170, align: 'right' });
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 370, 95, { width: 170, align: 'right' });

    // Bill To Section
    doc.fillColor('#111827').rect(40, 120, 515, 90).stroke('#e5e7eb');
    doc.fontSize(12).text('Bill To', 50, 130);
    doc.fontSize(10);
    doc.text(`Name: ${order.customerName}`, 50, 150, { width: 300 });
    doc.text(`Phone: ${order.phone}`, 50, 165, { width: 300 });
    if (order.email) doc.text(`Email: ${order.email}`, 50, 180, { width: 300 });
    doc.text(`Address: ${order.address}`, 50, 195, { width: 300 });
    doc.fontSize(12).text('Order Info', 370, 130);
    doc.fontSize(10);
    doc.text(`Order ID: ${String(order._id)}`, 370, 150, { width: 170, align: 'right' });
    doc.text(`Payment: ${order.paymentMethod}`, 370, 165, { width: 170, align: 'right' });
    doc.text(`Status: ${order.status}`, 370, 180, { width: 170, align: 'right' });

    // Table Header
    const tableTop = 230;
    doc.rect(40, tableTop, 515, 24).fill('#f3f4f6').stroke('#e5e7eb');
    doc.fillColor('#111827').fontSize(11);
    doc.text('S.No', 50, tableTop + 6, { width: 40 });
    doc.text('Item', 100, tableTop + 6, { width: 240 });
    doc.text('Qty', 350, tableTop + 6, { width: 50, align: 'right' });
    doc.text('Rate', 410, tableTop + 6, { width: 70, align: 'right' });
    doc.text('Amount', 490, tableTop + 6, { width: 60, align: 'right' });

    // Table Rows
    let y = tableTop + 30;
    let subtotal = 0;
    (order.items || []).forEach((item, idx) => {
      const qty = Number(item.quantity || 1);
      const rate = Number(item.price || 0);
      const amt = qty * rate;
      subtotal += amt;
      doc.rect(40, y - 2, 515, 24).stroke('#e5e7eb');
      doc.fontSize(10).fillColor('#111827');
      doc.text(String(idx + 1), 50, y + 4, { width: 40 });
      doc.text(String(item.name || ''), 100, y + 4, { width: 240 });
      doc.text(String(qty), 350, y + 4, { width: 50, align: 'right' });
      doc.text(currency(rate), 410, y + 4, { width: 70, align: 'right' });
      doc.text(currency(amt), 490, y + 4, { width: 60, align: 'right' });
      y += 26;
    });

    // Summary Section (Positioned after table)
    const total = Number(order.totalAmount || subtotal);
    const tax = 0;
    const grand = total + tax;

    const summaryTop = y + 20;  // Increased spacing to avoid overlap
    doc.rect(300, summaryTop, 255, 80).stroke('#e5e7eb');
    doc.fontSize(11).fillColor('#111827');
    doc.text('Subtotal', 310, summaryTop + 8, { width: 130 });
    doc.text(currency(subtotal), 500, summaryTop + 8, { width: 50, align: 'right' });
    doc.text('Taxes', 310, summaryTop + 30, { width: 130 });
    doc.text(currency(tax), 500, summaryTop + 30, { width: 50, align: 'right' });
    doc.fontSize(12).text('Grand Total', 310, summaryTop + 52, { width: 130 });
    doc.fontSize(12).text(currency(grand), 500, summaryTop + 52, { width: 50, align: 'right' });

    // Footer
    const footerTop = summaryTop + 100;  // Ensure footer is below summary
    doc.fontSize(10).fillColor('#6b7280').text('Thank you for your purchase!', 50, footerTop);
    doc.text('This is a computer generated invoice.', 50, footerTop + 15);

    // Status Badge
    if (order.status === 'delivered') {
      doc.fillColor('#16a34a').fontSize(18).text('DELIVERED', 50, footerTop + 40);
    } else if (order.status === 'confirmed') {
      doc.fillColor('#1d4ed8').fontSize(18).text('CONFIRMED', 50, footerTop + 40);
    }

    doc.end();
  });
}

module.exports = { generateInvoicePdf };