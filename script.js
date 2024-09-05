// Function to populate the invoice details
function populateInvoice() {
    const itemsTable = document.getElementById("invoice-items");
    itemsTable.innerHTML = "";
    let totalAmount = 0;

    // Sample data for the invoice
    const invoiceData = {
        items: [
            { description: "Item 1", quantity: 2, unitPrice: 10.00 },
            { description: "Item 2", quantity: 1, unitPrice: 20.00 },
        ]
    };

    invoiceData.items.forEach(item => {
        const total = item.quantity * item.unitPrice;
        totalAmount += total;

        const row = `
            <tr>
                <td><input type="text" class="description form-control" value="${item.description}"></td>
                <td><input type="number" class="quantity form-control" value="${item.quantity}"></td>
                <td><input type="number" class="unit-price form-control" value="${item.unitPrice.toFixed(2)}"></td>
                <td><input type="text" class="total form-control" value="${total.toFixed(2)}" readonly></td>
                <td><button class="btn btn-danger" onclick="removeRow(this)">Remove</button></td>
            </tr>`;
        itemsTable.innerHTML += row;
    });

    // Update total amount
    document.getElementById("total-amount").value = totalAmount.toFixed(2);
}

// Function to calculate total on input change
function calculateTotal() {
    document.querySelector("tbody").addEventListener("input", function (event) {
        const target = event.target;
        if (target.classList.contains("quantity") || target.classList.contains("unit-price")) {
            const row = target.closest("tr");
            const quantity = parseFloat(row.querySelector(".quantity").value) || 0;
            const unitPrice = parseFloat(row.querySelector(".unit-price").value) || 0;
            const total = quantity * unitPrice;

            row.querySelector(".total").value = total.toFixed(2);

            // Recalculate total amount
            let newTotalAmount = 0;
            document.querySelectorAll(".total").forEach(function (el) {
                newTotalAmount += parseFloat(el.value) || 0;
            });

            document.getElementById("total-amount").value = newTotalAmount.toFixed(2);
        }
    });
}

// Function to add a new row to the table
function addRow() {
    const newRow = `
        <tr>
            <td><input type="text" class="description form-control"></td>
            <td><input type="number" class="quantity form-control"></td>
            <td><input type="number" class="unit-price form-control"></td>
            <td><input type="text" class="total form-control" readonly></td>
            <td><button class="btn btn-danger" onclick="removeRow(this)">Remove</button></td>
        </tr>`;
    document.getElementById("invoice-items").insertAdjacentHTML('beforeend', newRow);
}

// Function to remove a row from the table
function removeRow(button) {
    const row = button.closest("tr");
    row.remove();
    recalculateTotal();
}

// Function to recalculate total after removing a row
function recalculateTotal() {
    let newTotalAmount = 0;
    document.querySelectorAll(".total").forEach(function (el) {
        newTotalAmount += parseFloat(el.value) || 0;
    });

    document.getElementById("total-amount").value = newTotalAmount.toFixed(2);
}

// Function to generate and download PDF
function generatePDF() {
    // Hide the buttons before generating PDF
    document.querySelectorAll("button").forEach(button => button.style.display = "none");

    const allInputElem = document.querySelectorAll("input");
    allInputElem.forEach(elem => {
        elem.style.border = 'none';
        elem.style.pointerEvents = 'none';
        elem.style.padding = '10px 0';
    });

    const element = document.getElementById("invoice");

    const pdfConfig = {
        margin: 10,
        filename: 'invoice.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf(element, pdfConfig).then(() => {
        // Show the buttons again after PDF generation
        document.querySelectorAll("button").forEach(button => button.style.display = "block");
    });
}

function previewImage(input) {
    const preview = document.getElementById('client-preview');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.classList.remove('hidden');
        };

        reader.readAsDataURL(file);
    } else {
        preview.src = 'https://via.placeholder.com/200x200';
        preview.classList.remove('hidden');
    }
}

function switchTab(tabId) {
    const previewTab = document.getElementById('invoice');
    if (tabId === 'preview-tab') {
        previewTab.style.pointerEvents = 'none';
    } else if (tabId === 'edit-tab') {
        previewTab.style.pointerEvents = 'auto';
    }
}

// Initialize the invoice with sample data and set up event listeners
populateInvoice();
calculateTotal();
