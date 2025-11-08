// This file contains the JavaScript code for the landing page, handling interactivity, animations, and any dynamic content.

document.addEventListener("DOMContentLoaded", async () => {
  // Sửa đường dẫn cho GitHub Pages
  const providersUrl = "./data/providers.json"; // ✅ Đúng cho root deployment

  // Nếu repo name là "premium-store", có thể cần:
  // const providersUrl = "/premium-store/data/providers.json";

  const container = document.getElementById("providers");
  const heroStarting = document.getElementById("heroStarting");

  // Format currency
  function fmt(v) {
    return new Intl.NumberFormat("vi-VN").format(Math.round(v)) + "₫";
  }

  // Compute pricing with discount
  function computeTotals(base, months) {
    const originalTotal = base * 1.2 * months; // Giá niêm yết tăng 20%
    let saleTotal = base * months;
    if (months >= 6) saleTotal = saleTotal * 0.95; // Giảm 5% cho gói 6-12 tháng
    return { originalTotal, saleTotal };
  }

  // Generate provider card HTML
  function cardHTML(p, initialD) {
    const durations = p.only12 ? [12] : [1, 3, 6, 12];
    const durButtons = durations
      .map(
        (d) =>
          `<button data-d="${d}" class="btn ${
            d === initialD ? "btn-primary" : "btn-outline-secondary"
          } btn-sm me-1 mb-1 duration-pill" aria-pressed="${
            d === initialD
          }">${d} tháng</button>`
      )
      .join("");

    const logo = `<img src="${p.logo}" alt="${p.name}" class="provider-logo" onerror="this.src='https://via.placeholder.com/100x40?text=${p.name}'"/>`;

    return `
      <div class="card card-provider h-100 fade-up">
        <div class="card-body p-3">
          <div class="d-flex align-items-center mb-3">
            <div class="logo-circle me-3">${logo}</div>
            <div class="flex-grow-1">
              <h5 class="card-title mb-0">${p.name}</h5>
              <small class="text-muted">${p.domain}</small>
            </div>
          </div>
          
          <p class="card-text small text-muted mb-3">${p.description || ""}</p>
          
          <div class="pricing-info mb-3">
            <div class="price-old small" id="${p.id}-old">Đang tải...</div>
            <div class="price-sale" id="${p.id}-sale">Đang tải...</div>
            <small class="text-muted d-block mt-1">Giá đã bao gồm khuyến mãi</small>
          </div>

          <div class="duration-selector mb-3">
            <label class="form-label small fw-semibold">Chọn thời hạn:</label>
            <div>${durButtons}</div>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-primary flex-grow-1" data-buy="${p.id}">
              <i class="fa fa-shopping-cart me-1"></i>Mua ngay
            </button>
            <button class="btn btn-outline-secondary" data-details="${
              p.id
            }" title="Chi tiết">
              <i class="fa fa-info-circle"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Load and render providers
  async function loadProviders() {
    try {
      console.log("Fetching providers from:", providersUrl); // Debug log
      const res = await fetch(providersUrl);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Loaded data:", data); // Debug log

      // Fix: handle both array and object with providers property
      const list = Array.isArray(data) ? data : data.providers || [];

      if (list.length === 0) {
        throw new Error("No providers found in JSON");
      }

      container.innerHTML = "";

      list.forEach((p) => {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6 mb-4";
        const initialD = p.only12 ? 12 : 1;
        col.innerHTML = cardHTML(p, initialD);
        container.appendChild(col);

        updateCardPrices(p, initialD);
        attachCardListeners(col, p, initialD);
      });

      // Animate cards on scroll
      animateOnScroll();
    } catch (error) {
      console.error("Load providers error:", error);
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            <i class="fa fa-exclamation-triangle me-2"></i>
            <strong>Không thể tải danh sách nhà cung cấp.</strong><br>
            <small class="text-muted">Lỗi: ${error.message}</small><br>
            <small class="text-muted">URL: ${providersUrl}</small>
          </div>
        </div>
      `;
    }
  }

  // Attach event listeners to card
  function attachCardListeners(col, provider, initialDuration) {
    // Duration selection
    col.querySelectorAll(".duration-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        col.querySelectorAll(".duration-pill").forEach((b) => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-outline-secondary");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.remove("btn-outline-secondary");
        btn.classList.add("btn-primary");
        btn.setAttribute("aria-pressed", "true");

        const months = parseInt(btn.getAttribute("data-d"), 10);
        updateCardPrices(provider, months);
      });
    });

    // Buy button
    col.querySelector("[data-buy]").addEventListener("click", () => {
      const selectedBtn =
        col.querySelector(".duration-pill.btn-primary") ||
        col.querySelector(".duration-pill");
      const months = selectedBtn
        ? parseInt(selectedBtn.getAttribute("data-d"), 10)
        : initialDuration;
      openCheckout(provider, months);
    });

    // Details button
    col.querySelector("[data-details]").addEventListener("click", (e) => {
      e.preventDefault();
      showProviderDetails(provider);
    });
  }

  // Update card prices
  function updateCardPrices(provider, months) {
    const { originalTotal, saleTotal } = computeTotals(provider.base, months);
    const oldEl = document.getElementById(provider.id + "-old");
    const saleEl = document.getElementById(provider.id + "-sale");

    if (oldEl) {
      oldEl.textContent =
        "Giá niêm yết: " +
        fmt(originalTotal) +
        (months > 1 ? ` (${months} tháng)` : "");
    }
    if (saleEl) {
      saleEl.textContent =
        fmt(saleTotal) + (months > 1 ? ` / ${months} tháng` : " / tháng");
    }

    // Update hero price
    if (heroStarting && provider.base <= 35000) {
      heroStarting.textContent = fmt(provider.base);
    }
  }

  // Show provider details modal
  function showProviderDetails(provider) {
    const modal = new bootstrap.Modal(
      document.getElementById("detailsModal") || createDetailsModal()
    );
    const modalBody = document.querySelector("#detailsModal .modal-body");

    modalBody.innerHTML = `
      <div class="text-center mb-3">
        <img src="${provider.logo}" alt="${provider.name}" style="max-height:60px" onerror="this.style.display='none'">
        <h5 class="mt-2">${provider.name}</h5>
        <small class="text-muted">${provider.domain}</small>
      </div>
      <p>${provider.description}</p>
      <ul class="list-unstyled">
        <li><i class="fa fa-check text-success me-2"></i>Bảo hành 7 ngày đổi trả</li>
        <li><i class="fa fa-check text-success me-2"></i>Hỗ trợ 24/7 qua Zalo/Telegram</li>
        <li><i class="fa fa-check text-success me-2"></i>Kích hoạt ngay sau thanh toán</li>
        <li><i class="fa fa-check text-success me-2"></i>Thanh toán linh hoạt</li>
      </ul>
      <div class="alert alert-info small mb-0">
        <i class="fa fa-info-circle me-1"></i>
        Liên hệ ngay: <strong>0909.699.257</strong> để được tư vấn chi tiết
      </div>
    `;
    modal.show();
  }

  // Create details modal if not exists
  function createDetailsModal() {
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "detailsModal";
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chi tiết gói dịch vụ</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  // Open checkout modal
  const checkoutModal = new bootstrap.Modal(
    document.getElementById("checkoutModal")
  );

  function openCheckout(provider, months) {
    const { saleTotal, originalTotal } = computeTotals(provider.base, months);
    const summary = document.getElementById("orderSummary");
    const discount = originalTotal - saleTotal;

    summary.innerHTML = `
      <div class="order-details">
        <h6 class="mb-3">${provider.name}</h6>
        <table class="table table-sm">
          <tr>
            <td>Thời hạn:</td>
            <td class="text-end"><strong>${months} tháng</strong></td>
          </tr>
          <tr>
            <td>Giá niêm yết:</td>
            <td class="text-end text-decoration-line-through text-muted">${fmt(
              originalTotal
            )}</td>
          </tr>
          ${
            discount > 0
              ? `<tr class="text-success">
            <td>Giảm giá:</td>
            <td class="text-end">-${fmt(discount)}</td>
          </tr>`
              : ""
          }
          <tr class="fw-bold">
            <td>Tổng thanh toán:</td>
            <td class="text-end text-primary fs-5">${fmt(saleTotal)}</td>
          </tr>
        </table>
      </div>
    `;

    const payBtn = document.getElementById("payNowBtn");
    payBtn.onclick = () => {
      const paymentInfo = `Thanh toán ${
        provider.name
      } (${months} tháng) - ${fmt(
        saleTotal
      )}\nMomo: 0909699257\nMB Bank: 4888888882004`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(paymentInfo).then(() => {
          showToast(
            "Đã sao chép thông tin thanh toán! Vui lòng chuyển khoản và gửi biên nhận.",
            "success"
          );
        });
      } else {
        showToast(
          "Vui lòng chuyển khoản theo thông tin và gửi biên nhận qua Zalo/Telegram: 0909.699.257",
          "info"
        );
      }
      return false;
    };

    checkoutModal.show();
  }

  // Show toast notification
  function showToast(message, type = "info") {
    const toastContainer =
      document.querySelector(".toast-container") || createToastContainer();
    const toast = document.createElement("div");
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute("role", "alert");
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener("hidden.bs.toast", () => toast.remove());
  }

  // Create toast container
  function createToastContainer() {
    const container = document.createElement("div");
    container.className = "toast-container position-fixed top-0 end-0 p-3";
    document.body.appendChild(container);
    return container;
  }

  // Animate elements on scroll
  function animateOnScroll() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
  }

  // Initialize smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Load providers on page load
  await loadProviders();

  // Add loading indicator
  const style = document.createElement("style");
  style.textContent = `
    .provider-logo { max-height: 40px; max-width: 100px; object-fit: contain; }
    .duration-pill.btn-primary { background-color: var(--accent); border-color: var(--accent); }
  `;
  document.head.appendChild(style);
});
