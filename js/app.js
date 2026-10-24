import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import { getVisibleOrders, getOrderDetails, getStats } from "./selectors.js";
import { renderStats, renderCategoryOptions, renderOrders, renderDetail, showError } from "./view.js";

const searchInput = document.querySelector("#searchInput");
const statusFilter = document.querySelector("#statusFilter");
const categoryFilter = document.querySelector("#categoryFilter");
const ordersTableBody = document.querySelector("#ordersTableBody");

const render = () => {
  const categories = [...new Set(state.products.map((p) => p.category))];
  renderCategoryOptions(categories, state.category);
  const rows = getVisibleOrders(state).map((order) => getOrderDetails(order, state));
  renderOrders(rows);
  renderStats(getStats(state));
};

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value.trim();
  render();
});

statusFilter.addEventListener("change", (event) => {
  state.status = event.target.value;
  render();
});

categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  render();
});

ordersTableBody.addEventListener("click", (event) => {
  const button = event.target.closest(".details-btn");
  if (!button) return;
  const id = Number(button.dataset.id);
  const order = state.orders.find((o) => o.id === id);
  if (order) renderDetail(getOrderDetails(order, state));
});

const init = async () => {
  try {
    const data = await loadAllData();
    state.customers = data.customers;
    state.products = data.products;
    state.orders = data.orders;
    render();
  } catch (error) {
    console.error(error);
    showError(`Could not load the data: ${error.message}`);
  }
};

init();