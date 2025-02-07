
let itemCounter = 0; // Initialize itemCounter
//window.alert("hii");
function addInvoiceItem() {
    itemCounter++;
    const newItemRow = `
    <tr id="itemRow${itemCounter}">
        <td><input type="text" class="form-control" placeholder="Enter Description" required></td>
        <td><input type="number" class="form-control quantity" placeholder="Enter Quantity" required></td>
        <td><input type="number" class="form-control unitPrice" placeholder="Enter Unit Price" required></td>
        <td><input type="number" class="form-control totalItemPrice" disabled readonly></td>
        <td><button type="button" class="btn btn-danger" onclick="removeInvoiceItem(${itemCounter})">Remove</button></td>
    `;
    $("#invoiceItems").append(newItemRow);

    //update totalAmount on every item added    
    updatetotalAmount()
}

function removeInvoiceItem(itemId){
    $(`#itemRow${itemId}`).remove();
    updatetotalAmount();
}

function updatetotalAmount(){
    let totalAmount = 0;
    $("tr[id^='itemRow']").each(function(){
        const quantity = parseFloat($(this).find(".quantity").val()) || 0;
        const unitPrice= parseFloat($(this).find(".unitPrice").val()) || 0;
        const totalItemPrice = quantity * unitPrice;

        $(this).find(".totalItemPrice").val(totalItemPrice.toFixed(2));
        totalAmount+= totalItemPrice;
    });

    $("#totalAmount").val(totalAmount.toFixed(2));

   
}

$(document).ready(function(){
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0,10);
    $("#invoiceDate").val(formattedDate);
});

$("#invoiceForm").submit(function(event){
    event.preventDefault();
    updatetotalAmount();
});

//print Bill Invoice
function printInvoice(){
    const customerName = $("#customerName").val();
    const customerAddress = $("#customerAddress").val();
    const customerGST = $("#customerGST").val();
    const invoiceDate = $("#invoiceDate").val();
    const items = [];
    $("tr[id^='itemRow']").each(function(){
        const description = $(this).find("td:eq(0) input").val();
        const quantity = $(this).find("td:eq(1) input").val();
        const unitPrice = $(this).find("td:eq(2) input").val();
        const totalItemPrice = $(this).find("td:eq(3) input").val();

        items.push({
            description: description,
            quantity: quantity,
            unitPrice: unitPrice,
            totalItemPrice: totalItemPrice,

        });
    });
    const totalAmount = $("#totalAmount").val();
   const invoiceContent = `
                <html>
                <head>
                    <title>Tax Invoice</title>
                    <style>
                        body
                        {
                            font-family: Arial,sans-serif;
                            margin: 20px;
                        }
                        h2
                        {
                            color: #007bff;
                        }
                        table
                        {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th,td
                        {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
                        .total
                        {
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div>
                        <h2 style="text-align: center;">Tax Invoice</h2>
                        <div style = "width: 50%;margin-left: auto;display: flex;justify-content: space-between;padding-right: 50px;">
                            <span>Invoice Number:</span>
                            <span>${invoiceNo.value}</span>
                        </div>
                        <div style = "width: 50%;margin-left: auto;display: flex;justify-content: space-between;padding-right: 50px;">
                            <span>Invoice Date:</span>
                            <span>${invoiceDate}</span>
                        </div>
                        <div> 
                            <p style="text-decoration: underline;"><strong>J.B.ENTERPRISES</strong></p>
                            <div style = "line-height:0.4;">
                                <p>A/9, Giriraj Industriie ESTATE</p>
                                <p>Mahakali Caves Road, Andheri East</p>
                                <p>Mumbai : 400 093</p>
                                <p>GSTIN : 27BTFPK4672PIZZ</p>
                            </div>
                        </div>

                        <div style = "margin-top: 50px;">
                            <p style="text-decoration: underline;"><strong>Billing Address</strong></p>
                            <div style = "line-height:0.4;">
                                <p><strong>Customer Name:</strong>${customerName}</p>
                                <p><strong>Address:</strong>${customerAddress}</p>
                                <p><strong>GSTIN:</strong>${customerGST}</p>
                            </div>
                        </div>

                    
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item) =>`
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>${item.unitPrice}</td>
                                <td>${item.totalItemPrice}</td>
                            </tr>`
                            
                            
                            ).join("")}
                    </tbody>
                </table>
                <p class="total">TotalAmount: ${totalAmount}</p>
                </body>
            </html>
    `;

    const printWindow = window.open("","_blank");
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
}
