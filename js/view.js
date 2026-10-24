const $ = (selector) => document.querySelector(selector);

const tableBody = $("#ordersTableBody");
const resultCount = $("#resultCount");
const categoryFilter = $("#categoryFilter");
const errorBox = $("#errorMes");
const detailModal =new bootstrap.Modal($("#detailModal"));

const STATUS ={
    delivered: { label: "Delivered", css:"status-delivered"},
    "pending": { label: "Pending", css:"status-pending"},
    cancelled: { label: "Cancelled", css:"status-cancelled"},
};

const badge = (status)=>{
    const s=STATUS[status] || {label: status, css:""};
    return `<span class="status ${s.css}">${s.label}</span>`;
};

const createRow = (o)=> `
<tr>
<td>#${o.id}</td>
<td>${o.customerName}</td>
<td>${o.city}</td>
<td>${o.date}</td>
<td>${badge(o.status)}</td>
<td>${o.total} DH </td>
<td><button class="btn btn-rose btn-sm details-btn" data-id="${o.id}">see</button></td>
</tr>
`;

export const renderStats=(stats)=> {
    $("#totalCustomers").textContent = stats.customers;
    $("#totalProducts").textContent = stats.products;
    $("#totalOrders").textContent = stats.orders;
    $("#totalAmount").textContent = `${stats.amount} DH`;
};

export const renderCategoryOptions= (categories, selected)=>{
    categoryFilter.innerHTML=["all", ...categories]
    .map((c)=> `<option value="${c}" ${c === selected ? "selected" : ""}>${c ==="all" ? "All categories" : c}</option>`) .join("");
};

export const renderOrders = (rows) => {
  resultCount.textContent = `${rows.length} order(s) shown`;
  if (rows.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No order matches your search.</td></tr>`;
    return;
  }
  tableBody.innerHTML = rows.map(createRow).join("");
};

export const renderDetail =(d)=>{
    $("#detailTitle").textContent =`Order #${d.id}`;
    $("#detailCustomer").textContent = d.customerName;
    $("#detailCity").textContent = d.city;
    $("#detailDate").textContent = d.date;
    $("#detailStatus").textContent = (STATUS[d.status] || {label: d.status}).label;
    $("#detailLines").innerHTML = d.lines
    .map((l)=> `<tr><td><img src="${l.image}" alt="${l.name}" class="thumb">${l.name}</td> <td>${l.price} DH</td> <td>${l.quantity}</td> <td>${l.amount} DH </td></tr>`) .join("");
    $("#detailTotal").textContent = `${d.total} DH`;
    detailModal.show();

};

export const showError = (message) => {
    errorBox.textContent= message;
    errorBox.classList.remove("d-none");
    resultCount.textContent="data failed to load";
};
