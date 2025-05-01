export const generateInvoiceHTML = (invoice, client, timesheets) => {
  console.log("Generating invoice HTML with:");
  console.log(`- Invoice ID: ${invoice._id}`);
  console.log(`- Client: ${client?.name || "No client name"}`);
  console.log(`- Timesheets: ${timesheets?.length || 0} items`);

  if (timesheets && timesheets.length > 0) {
    console.log(
      "First timesheet project check:",
      timesheets[0].project
        ? `Project exists: ${timesheets[0].project.title}`
        : "Project is missing"
    );

    console.log(
      "First timesheet employee check:",
      timesheets[0].employee
        ? `Employee exists: ${timesheets[0].employee.firstName}`
        : "Employee is missing"
    );
  }

  // Updated Timesheet Rows
  const timesheetRows = timesheets
    .map((ts) => {
      const formattedDate = ts.date
        ? new Date(ts.date).toISOString().slice(0, 10)
        : "N/A";

      let projectName = "Not Assigned";
      if (ts.project && typeof ts.project === "object") {
        projectName = ts.project.title || "Untitled Project";
      } else if (typeof ts.project === "string") {
        projectName = "Unpopulated Project (ID only)";
      }

      const description = ts.description || "No description";
      const hours =
        typeof ts.hoursWorked === "number" ? ts.hoursWorked.toFixed(2) : "0.00";

      return `
      <tr>
        <td>${formattedDate}</td>
        <td>${projectName}</td>
      
        <td>${description}</td>
        <td>${hours}</td>
      </tr>`;
    })
    .join("");

  const issuedDateStr = invoice.issuedDate
    ? new Date(invoice.issuedDate).toDateString()
    : new Date().toDateString();

  const dueDateStr = invoice.dueDate
    ? new Date(invoice.dueDate).toDateString()
    : "N/A";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice._id || ""}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
            line-height: 1.5;
          }
          .invoice-header {
            border-bottom: 2px solid #ddd;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          h1 {
            color: #444;
            margin-bottom: 10px;
          }
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-info div {
            flex: 1;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .summary {
            margin-top: 30px;
            width: 300px;
            margin-left: auto;
          }
          .summary td {
            padding: 8px 12px;
          }
          .summary tr:last-child {
            font-weight: bold;
            background-color: #f0f0f0;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>INVOICE</h1>
          <p><strong>Invoice ID:</strong> ${invoice._id || "N/A"}</p>
        </div>

        <div class="invoice-info">
          <div>
            <h3>From:</h3>
            <p>Shunyavkash PVT LTD<br>
            123 Business Street<br>
            City, State ZIP<br>
            Email: billing@yourcompany.com<br>
            Phone: (123) 456-7890</p>
          </div>
          
          <div>
            <h3>Bill To:</h3>
            <p><strong>${client?.name || "N/A"}</strong><br>
            Billing Address: ${client?.billingAddress || "N/A"}<br>
            Email: ${client?.email || "N/A"}<br>
            Phone: ${client?.phone || "N/A"}</p>
          </div>
          
          <div>
            <h3>Invoice Details:</h3>
            <p><strong>Issued Date:</strong> ${issuedDateStr}<br>
            <strong>Due Date:</strong> ${dueDateStr}<br>
            <strong>Status:</strong> ${invoice.status || "Draft"}</p>
          </div>
        </div>

        <h3>Timesheet Summary:</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Project</th>
            
              <th>Description</th>
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            ${timesheetRows ||
              '<tr><td colspan="5">No timesheet data available</td></tr>'}
          </tbody>
        </table>

        <table class="summary">
          <tr><td><strong>Total Hours:</strong></td><td>${
            invoice.totalHours ? invoice.totalHours.toFixed(2) : "0.00"
          }</td></tr>
          <tr><td><strong>Rate Per Hour:</strong></td><td>$${
            invoice.ratePerHour ? invoice.ratePerHour.toFixed(2) : "0.00"
          }</td></tr>
          <tr><td><strong>Total Amount Due:</strong></td><td>$${
            invoice.totalAmount ? invoice.totalAmount.toFixed(2) : "0.00"
          }</td></tr>
        </table>
        
        <div class="footer">
          <p>Thank you for your business! Payment is due within 30 days of invoice date.</p>
          <p>Please make checks payable to Your Company Name or pay online at www.yourcompany.com/payments</p>
        </div>
      </body>
    </html>
  `;
};
