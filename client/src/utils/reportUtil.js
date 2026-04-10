import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateVehicleReport = (data) => {
  const { vehicle, services, modifications } = data;
  const doc = new jsPDF();

  // ─── HEADER BANNER ───
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, 210, 42, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ELITETRACK PERFORMANCE', 14, 18);
  
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('OFFICIAL VEHICLE BIOGRAPHY & SERVICE DOSSIER', 14, 28);
  
  doc.setFontSize(8);
  doc.setTextColor(227, 0, 0);
  doc.text('STRICTLY CONFIDENTIAL', 14, 36);
  
  // Date stamp
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 140, 36);

  // ─── VEHICLE SPECIFICATIONS ───
  let cursorY = 55;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('VEHICLE SPECIFICATIONS', 14, cursorY);
  doc.setDrawColor(227, 0, 0);
  doc.setLineWidth(1);
  doc.line(14, cursorY + 3, 55, cursorY + 3);

  const vehicleSpecs = [
    ['MAKE', (vehicle.make || 'N/A').toUpperCase()],
    ['MODEL', (vehicle.model || 'N/A').toUpperCase()],
    ['YEAR', (vehicle.year || 'N/A').toString()],
    ['REGISTRATION', (vehicle.registrationNumber || 'N/A').toUpperCase()],
    ['COLOR', (vehicle.color || 'N/A').toUpperCase()],
    ['FUEL TYPE', vehicle.fuelType || 'N/A'],
    ['TRANSMISSION', vehicle.transmission || 'N/A'],
    ['TOTAL MILEAGE', `${(vehicle.mileage || 0).toLocaleString()} KM`]
  ];

  autoTable(doc, {
    startY: cursorY + 8,
    body: vehicleSpecs,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3.5 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 55 },
      1: { textColor: [30, 30, 30] }
    }
  });

  cursorY = doc.lastAutoTable.finalY + 12;

  // ─── ENHANCEMENTS & MODIFICATIONS ───
  if (cursorY > 245) { doc.addPage(); cursorY = 20; }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ENHANCEMENTS & MODIFICATIONS', 14, cursorY);
  doc.setDrawColor(227, 0, 0);
  doc.line(14, cursorY + 3, 55, cursorY + 3);

  if (modifications && modifications.length > 0) {
    const modRows = modifications.map(mod => [
      new Date(mod.installDate).toLocaleDateString(),
      (mod.title || '').toUpperCase(),
      mod.category || '',
      mod.shopName || mod.installedBy || 'Self',
      `LKR ${(mod.totalCost || 0).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: cursorY + 8,
      head: [['DATE', 'TITLE', 'CATEGORY', 'INSTALLER', 'COST']],
      body: modRows,
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    cursorY = doc.lastAutoTable.finalY + 12;
  } else {
    cursorY += 12;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('No modification records found.', 14, cursorY);
    cursorY += 12;
  }

  // ─── MAINTENANCE LOG ───
  if (cursorY > 245) { doc.addPage(); cursorY = 20; }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('MAINTENANCE LOG', 14, cursorY);
  doc.setDrawColor(227, 0, 0);
  doc.line(14, cursorY + 3, 55, cursorY + 3);

  if (services && services.length > 0) {
    const serviceRows = services.map(s => [
      new Date(s.serviceDate).toLocaleDateString(),
      (s.serviceType || '').toUpperCase(),
      `${(s.mileageAtService || 0).toLocaleString()} KM`,
      s.serviceCenter?.name || '-',
      `LKR ${(s.cost?.totalCost || 0).toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: cursorY + 8,
      head: [['DATE', 'SERVICE', 'MILEAGE', 'CENTER', 'COST']],
      body: serviceRows,
      headStyles: { fillColor: [30, 30, 30], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    cursorY = doc.lastAutoTable.finalY + 12;

    // Cost Summary
    if (cursorY > 255) { doc.addPage(); cursorY = 20; }
    const totalServiceCost = services.reduce((sum, s) => sum + (s.cost?.totalCost || 0), 0);
    const totalModCost = (modifications || []).reduce((sum, m) => sum + (m.totalCost || 0), 0);

    doc.setFillColor(245, 245, 245);
    doc.rect(14, cursorY, 182, 30, 'F');
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text('TOTAL SERVICE COST', 20, cursorY + 10);
    doc.text('TOTAL MOD COST', 80, cursorY + 10);
    doc.text('GRAND TOTAL', 140, cursorY + 10);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`LKR ${totalServiceCost.toLocaleString()}`, 20, cursorY + 22);
    doc.text(`LKR ${totalModCost.toLocaleString()}`, 80, cursorY + 22);
    doc.setTextColor(227, 0, 0);
    doc.text(`LKR ${(totalServiceCost + totalModCost).toLocaleString()}`, 140, cursorY + 22);
  } else {
    cursorY += 12;
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('No service records found.', 14, cursorY);
  }

  // ─── FOOTER ON EVERY PAGE ───
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.text('EliteTrack Performance Management System | Confidential Vehicle Report', 14, 290);
    doc.text(`Page ${i} of ${pageCount}`, 180, 290);
  }

  const fileName = `EliteTrack_${(vehicle.registrationNumber || 'VEHICLE').replace(/\s/g, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
};

export const generateCostReport = (data) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, 210, 42, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ELITETRACK PERFORMANCE', 14, 18);
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('FINANCIAL INVESTMENT SUMMARY & COST ANALYTICS', 14, 28);
  
  doc.setTextColor(0,0,0);
  doc.setFontSize(14);
  doc.text('INVESTMENT OVERVIEW', 14, 55);
  doc.setDrawColor(227, 0, 0);
  doc.line(14, 58, 60, 58);
  
  const summaryRows = [
    ['TOTAL SERVICE EXPENDITURE', `LKR ${(data.totalServiceCost || 0).toLocaleString()}`],
    ['TOTAL MODIFICATION INVESTMENT', `LKR ${(data.totalModCost || 0).toLocaleString()}`],
    ['GRAND TOTAL INVESTMENT', `LKR ${(data.grandTotal || 0).toLocaleString()}`]
  ];
  
  autoTable(doc, {
    startY: 65,
    body: summaryRows,
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 100 } }
  });
  
  let currentY = doc.lastAutoTable.finalY + 15;
  
  doc.text('MONTHLY BREAKDOWN', 14, currentY);
  doc.line(14, currentY + 3, 60, currentY + 3);
  
  const monthRows = (data.serviceByMonth || []).map(m => [m.name, `LKR ${m.value.toLocaleString()}`]);
  
  autoTable(doc, {
    startY: currentY + 10,
    head: [['MONTH', 'TOTAL SPENT']],
    body: monthRows,
    headStyles: { fillColor: [30, 30, 30] }
  });

  doc.save(`EliteTrack_Financial_Report_${Date.now()}.pdf`);
};
