import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatRupiah } from "./utils";

interface InvoiceData {
  transactionId: string;
  customerName: string;
  customerPhone: string;
  items: any[];
  total: number;
  date: string;
}

export const generateInvoicePDF = (
  data: InvoiceData,
  format: "a4" | "letter" = "a4"
) => {
  // Create jsPDF instance
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: format,
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header (Company Info)
  doc.setFillColor(30, 41, 59); // Dark slate blue (Naka ERP style)
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("NAKA ERP", 14, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Precision Management & Technology", 14, 28);

  // INVOICE text right aligned
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - 14, 25, { align: "right" });

  doc.setTextColor(0, 0, 0);

  // 2. Transaction & Customer Info
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 14, 55);
  
  doc.setFont("helvetica", "normal");
  doc.text(data.customerName, 14, 62);
  doc.text(data.customerPhone || "-", 14, 68);

  // Invoice Details right aligned
  doc.setFont("helvetica", "bold");
  doc.text("Invoice No:", pageWidth - 50, 55);
  doc.text("Date:", pageWidth - 50, 62);

  doc.setFont("helvetica", "normal");
  doc.text(data.transactionId, pageWidth - 14, 55, { align: "right" });
  doc.text(data.date, pageWidth - 14, 62, { align: "right" });

  // 3. Line Items Table
  const tableRaw = data.items.map((item, index) => [
    (index + 1).toString(),
    item.sku,
    item.model,
    "1",
    formatRupiah(item.sellPrice),
    formatRupiah(item.sellPrice),
  ]);

  (doc as any).autoTable({
    startY: 80,
    head: [["NO", "ASSET ID", "ITEM DESCRIPTION", "QTY", "PRICE", "TOTAL"]],
    body: tableRaw,
    theme: "striped",
    headStyles: {
      fillColor: [30, 41, 59], // Header table color matching branding
      textColor: 255,
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
      textColor: 50,
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 70 },
      3: { cellWidth: 12, halign: "center" },
      4: { cellWidth: 35, halign: "right" },
      5: { cellWidth: 35, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // 4. Totals
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("GRAND TOTAL", pageWidth - 60, finalY);
  
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text(formatRupiah(data.total), pageWidth - 14, finalY, { align: "right" });

  // 5. Footer Notes
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text("Terima kasih atas kepercayaan Anda bertransaksi dengan Naka ERP.", 14, finalY + 30);
  doc.text("Hardware bergaransi tunduk pada syarat dan ketentuan yang berlaku.", 14, finalY + 35);

  // 6. Action (Save file)
  doc.save(`Invoice_${data.transactionId}.pdf`);
};
