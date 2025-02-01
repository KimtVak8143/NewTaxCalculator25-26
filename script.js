// Function to format number with commas
function formatNumberInput() {
    let input = document.getElementById("income");
    let value = input.value.replace(/,/g, ""); // Remove existing commas
    if (!isNaN(value) && value !== "") {
        input.value = Number(value).toLocaleString("en-IN"); // Format as Indian number system
    }
}

// Function to remove formatting before calculation
function getRawNumber(value) {
    return parseFloat(value.replace(/,/g, "")) || 0;
}

function calculateTax() {
    const income = getRawNumber(document.getElementById("income").value);
    const resultDiv = document.getElementById("result");
    const breakdownDiv = document.getElementById("breakdown");

    if (income <= 0) {
        resultDiv.innerHTML = '<div class="alert alert-danger">Please enter a valid income!</div>';
        breakdownDiv.innerHTML = '';
        return;
    }

    const slabs = [
        { limit: 400000, rate: 0.00 },
        { limit: 800000, rate: 0.05 },
        { limit: 1200000, rate: 0.10 },
        { limit: 1600000, rate: 0.15 },
        { limit: 2000000, rate: 0.20 },
        { limit: 2400000, rate: 0.25 },
        { limit: Infinity, rate: 0.30 }
    ];

    let tax = 0;
    let prev_limit = 0;
    let taxDetails = [];

    for (let i = 0; i < slabs.length; i++) {
        if (income > prev_limit) {
            let taxableAmount = Math.min(income, slabs[i].limit) - prev_limit;
            let taxAmount = taxableAmount * slabs[i].rate;
            tax += taxAmount;

            taxDetails.push({
                range: `${prev_limit.toLocaleString("en-IN")} - ${slabs[i].limit.toLocaleString("en-IN")}`,
                rate: `${(slabs[i].rate * 100).toFixed(0)}%`,
                taxable: `₹${taxableAmount.toLocaleString("en-IN")}`,
                tax: `₹${taxAmount.toLocaleString("en-IN")}`
            });

            prev_limit = slabs[i].limit;
        } else {
            break;
        }
    }

    resultDiv.innerHTML = `<div class="alert alert-success">
        <strong>Total Tax: ₹${tax.toLocaleString("en-IN")}</strong>
    </div>`;

    let tableHTML = `<table class="table table-bordered mt-3">
        <thead class="table-dark">
            <tr>
                <th>Income Range (₹)</th>
                <th>Rate</th>
                <th>Taxable Amount</th>
                <th>Tax</th>
            </tr>
        </thead>
        <tbody>`;

    taxDetails.forEach(row => {
        tableHTML += `<tr>
            <td>${row.range}</td>
            <td>${row.rate}</td>
            <td>${row.taxable}</td>
            <td>${row.tax}</td>
        </tr>`;
    });

    tableHTML += `</tbody></table>`;
    breakdownDiv.innerHTML = tableHTML;
}
