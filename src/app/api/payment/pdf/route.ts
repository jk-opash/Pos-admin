import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

export async function POST(req: Request) {
  try {
    const payment = await req.json();

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 0, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- PDFKIT DRAWING CODE START ---
      const primaryColor = '#1e293b'; // dark blue
      const accentColor = payment.status === 'success' ? '#8cc63f' : (payment.status === 'failed' ? '#ef4444' : '#f59e0b');
      
      const width = doc.page.width;
      
      // 1. Header Design
      doc.polygon(
        [0, 0],
        [width * 0.45, 0],
        [width * 0.35, 120],
        [0, 120]
      );
      doc.fill(primaryColor);
      
      doc.polygon(
        [width * 0.46, 0],
        [width * 0.55, 0],
        [width * 0.45, 120],
        [width * 0.36, 120]
      );
      doc.fill(accentColor);

      // Company Logo / Name (Top Left)
      doc.fillColor('white')
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('COMPANY', 40, 45)
         .fontSize(10)
         .font('Helvetica')
         .text('BUSINESS TAGLINE HERE', 40, 72);
         
      // RECEIPT Text (Top Right)
      doc.fillColor(accentColor)
         .fontSize(32)
         .font('Helvetica-Bold')
         .text('RECEIPT', 0, 45, { align: 'right', width: width - 40 });
         
      // Details (Top Right under RECEIPT)
      doc.fillColor('#333333')
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('Transaction ID:', width - 200, 90)
         .font('Helvetica')
         .text(`${payment.id.split('-')[0].toUpperCase()}`, width - 100, 90);
         
      doc.font('Helvetica-Bold')
         .text('Date:', width - 200, 105)
         .font('Helvetica')
         .text(new Date(payment.createdAt).toLocaleDateString(), width - 100, 105);

      // 2. Billing Info
      const startY = 160;
      doc.fontSize(10).font('Helvetica').fillColor('#666666');
      
      // Receipt To
      doc.text('Receipt To:', 40, startY);
      doc.font('Helvetica-Bold').fillColor('#333333').fontSize(14)
         .text(payment.businessName || payment.businessId || 'Business Client', 40, startY + 15);
      doc.font('Helvetica').fontSize(10).fillColor('#666666')
         .text('Business Director, Company Inc.', 40, startY + 35)
         .text('Phone: +000 123 4567 89', 40, startY + 50)
         .text('Email: info@example.com', 40, startY + 65);

      // Receipt From
      doc.text('Receipt From:', width / 2 + 50, startY);
      doc.font('Helvetica-Bold').fillColor('#333333').fontSize(14)
         .text('Opash Software', width / 2 + 50, startY + 15);
      doc.font('Helvetica').fontSize(10).fillColor('#666666')
         .text('Managing Director, Opash Ltd.', width / 2 + 50, startY + 35)
         .text('Phone: +000 987 6543 21', width / 2 + 50, startY + 50)
         .text('Email: contact@opash.com', width / 2 + 50, startY + 65);

      // 3. Table Header
      const tableTop = 270;
      
      doc.rect(40, tableTop, width - 80, 30).fill(accentColor);
      
      // Draw darker boxes for # and TOTAL
      doc.rect(width - 200, tableTop, 60, 30).fill(primaryColor);
      doc.rect(width - 130, tableTop, 90, 30).fill(primaryColor);
      
      doc.fillColor('white').font('Helvetica-Bold').fontSize(10);
      doc.text('NO', 50, tableTop + 10);
      doc.text('DESCRIPTION', 100, tableTop + 10);
      doc.text('PRICE', width - 190, tableTop + 10);
      doc.text('QTY', width - 120, tableTop + 10);
      doc.text('TOTAL', width - 70, tableTop + 10);

      // 4. Table Rows
      let rowY = tableTop + 30;
      const amountNum = Number(payment.amount) || 0;
      const items = [
        { desc: `Payment for Subscription`, details: `Method: ${payment.paymentMethod || 'Credit Card'} | Status: ${payment.status}`, price: amountNum, qty: 1 }
      ];

      items.forEach((item, i) => {
        // Striped background
        if (i % 2 === 0) {
          doc.rect(40, rowY, width - 80, 40).fill('#f8fafc');
        }
        
        doc.fillColor('#333333').font('Helvetica-Bold').fontSize(10);
        doc.text(`0${i + 1}`, 50, rowY + 12);
        
        doc.text(item.desc, 100, rowY + 10);
        doc.font('Helvetica').fontSize(8).fillColor('#666666');
        doc.text(item.details, 100, rowY + 22);
        
        doc.font('Helvetica-Bold').fontSize(10).fillColor('#333333');
        doc.text(`$${item.price.toFixed(2)}`, width - 190, rowY + 12);
        doc.text(`${item.qty}`, width - 110, rowY + 12);
        doc.text(`$${(item.price * item.qty).toFixed(2)}`, width - 70, rowY + 12);
        
        rowY += 40;
      });

      // 5. Summary Section
      const summaryY = rowY + 30;
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
      
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#333333');
      doc.text('Subtotal:', width - 200, summaryY);
      doc.text(`$${subtotal.toFixed(2)}`, width - 70, summaryY);
      
      doc.text('Discount:', width - 200, summaryY + 15);
      doc.text('$0.00', width - 70, summaryY + 15);
      
      doc.text('Tax (0%):', width - 200, summaryY + 30);
      doc.text('$0.00', width - 70, summaryY + 30);
      
      // Total Box
      doc.rect(width - 220, summaryY + 50, 180, 30).fill(accentColor);
      doc.fillColor('white').font('Helvetica-Bold').fontSize(12);
      doc.text('Total Paid', width - 200, summaryY + 60);
      doc.text(`$${subtotal.toFixed(2)}`, width - 80, summaryY + 60);

      // 6. Payment Info
      doc.fillColor(accentColor).font('Helvetica-Bold').fontSize(10);
      doc.text('Payment Method', 40, summaryY);
      
      doc.fillColor('#333333');
      doc.text('Payment To:', 40, summaryY + 20);
      doc.font('Helvetica').text('1234 5678 9012', 120, summaryY + 20);
      
      doc.font('Helvetica-Bold').text('Account Name:', 40, summaryY + 35);
      doc.font('Helvetica').text('Opash POS', 120, summaryY + 35);
      
      doc.font('Helvetica-Bold').text('Branch Code:', 40, summaryY + 50);
      doc.font('Helvetica').text('XYZ', 120, summaryY + 50);
      
      // Signature
      doc.moveTo(width / 2 - 50, summaryY + 55).lineTo(width / 2 + 50, summaryY + 55).strokeColor('#dddddd').stroke();
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#333333');
      doc.text('Authorized Sign', width / 2 - 50, summaryY + 65, { width: 100, align: 'center' });

      // 7. Terms & Conditions
      const termsY = summaryY + 120;
      doc.fillColor(accentColor).font('Helvetica-Bold').fontSize(10);
      doc.text('Terms & Conditions', 40, termsY);
      
      doc.fillColor('#666666').font('Helvetica').fontSize(8);
      doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 40, termsY + 15, { width: width - 80, lineGap: 3 });

      // 8. Footer
      const footerY = doc.page.height - 60;
      
      // Background
      doc.rect(0, footerY, width, 60).fill(primaryColor);
      
      // Footer text
      doc.fillColor('white').font('Helvetica').fontSize(10);
      doc.text('Thank You For Your Payment', 0, footerY + 25, { width: width - 40, align: 'right' });
      
      // Footer icons / info (approximated with text/diamonds)
      const infos = ['+000 123 4567 89', 'contact@opash.com', '123 Business Rd, City'];
      let infoX = 40;
      infos.forEach((info) => {
        // Draw green diamond
        doc.polygon(
          [infoX + 10, footerY + 20],
          [infoX + 20, footerY + 30],
          [infoX + 10, footerY + 40],
          [infoX, footerY + 30]
        );
        doc.fill(accentColor);
        
        doc.fillColor('white').fontSize(8).text(info, infoX + 25, footerY + 27);
        infoX += 130;
      });

      // --- PDFKIT DRAWING CODE END ---
      doc.end();
    });

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=receipt-${payment.id}.pdf`,
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ 
      error: 'Failed to generate PDF', 
      details: error?.message || String(error),
    }, { status: 500 });
  }
}
