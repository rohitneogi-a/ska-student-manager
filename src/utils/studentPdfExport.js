import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const d = new Date(dateString);
  if (isNaN(d)) return "N/A";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function getMonthName(monthNumber) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return monthNames[monthNumber - 1] || "N/A";
}

async function toDataUrl(url) {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportStudentsToPdf(students) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(38, 70, 83);
  doc.text("Sreejoni Kala Academy", margin, y);
  y += 20;
  doc.setFontSize(13);
  doc.text("Student Master Data", margin, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    `Generated on ${formatDate(new Date().toISOString())}  |  Total Students: ${students.length}`,
    margin,
    y
  );
  y += 14;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  for (let i = 0; i < students.length; i++) {
    const student = students[i];

    if (y > pageHeight - 180) {
      doc.addPage();
      y = margin;
    }

    const imgSize = 50;
    let imageData = null;
    if (student.profileImage) {
      imageData = await toDataUrl(student.profileImage);
    }
    const textX = margin + (imageData ? imgSize + 12 : 0);

    if (imageData) {
      try {
        doc.addImage(imageData, "JPEG", margin, y, imgSize, imgSize);
      } catch {
        // corrupt or unsupported image data - skip embedding
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(38, 70, 83);
    doc.text(student.name || "N/A", textX, y + 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60);
    const details = [
      `Course: ${student.course || "N/A"}`,
      `Guardian: ${student.guardian || "N/A"}`,
      `Phone: ${student.phone || "N/A"}`,
      `Gender: ${student.gender || "N/A"}`,
      `Joined: ${formatDate(student.joined)}`,
      `Address: ${student.address || "N/A"}`,
    ];
    details.forEach((line, idx) => {
      doc.text(line, textX, y + 28 + idx * 12);
    });

    y += Math.max(imgSize, 28 + details.length * 12) + 10;

    const rows = [...(student.paymentHistory || [])]
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || (b.month ?? 0) - (a.month ?? 0))
      .map((p) => [
        getMonthName(p.month),
        String(p.year ?? "N/A"),
        p.amount != null ? `Rs. ${Number(p.amount).toLocaleString()}` : "N/A",
        p.status || "N/A",
        p.receiptNo || "N/A",
        p.status === "PAID" ? formatDate(p.date) : "-",
      ]);

    if (rows.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        head: [["Month", "Year", "Amount", "Status", "Receipt No.", "Payment Date"]],
        body: rows,
        styles: { fontSize: 8, cellPadding: 4 },
        headStyles: { fillColor: [42, 157, 143], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 246] },
      });
      y = doc.lastAutoTable.finalY + 20;
    } else {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(140);
      doc.text("No payment records found.", textX, y);
      y += 20;
    }

    doc.setDrawColor(230);
    doc.line(margin, y - 10, pageWidth - margin, y - 10);
  }

  doc.save(`student-master-data-${Date.now()}.pdf`);
}
