# 🛠 HƯỚNG DẪN TÙY BIẾN TRANG DỊCH VỤ (Dành cho AI Agent & Reseller)

[SYSTEM_NOTE]: File này chứa cấu trúc và quy tắc để AI Agent thực hiện thay đổi nội dung (Content), cấu trúc giá (Pricing Logic) và kênh liên hệ (Channels) trên file HTML trang Dịch vụ (Services Page). Khi Reseller đưa ra yêu cầu, AI Agent cần quét file này để xác định đúng block code cần sửa đổi.

---

## 🤖 HƯỚNG DẪN DÀNH CHO AI AGENT (AI INSTRUCTIONS)
1. **Phân tích yêu cầu:** Nhận diện rõ Reseller muốn đổi phần nào (Văn bản, Giá, Thuật toán tính toán, hay Kênh liên hệ).
2. **Tuân thủ Cấu trúc:** Chỉ sửa đổi nội dung bên trong các thẻ HTML được chỉ định, KHÔNG làm hỏng cấu trúc Grid/Flexbox của CSS.
3. **Kiểm tra Logic Toán học:** Khi can thiệp vào `[PRICING_CALCULATOR]`, phải đảm bảo thuộc tính `data-operation` (`base`, `multiply`, `add`) khớp chính xác với công thức giá mới do Reseller yêu cầu.

---

## 🏢 1. THÔNG TIN NHÀ CUNG CẤP & BRANDING (SUPPLIER INFO)
[TARGET_FILE]: `index.html` (hoặc file services tương ứng).
[ACTION]: Tìm kiếm và thay thế các giá trị mặc định của hệ thống Mera AI thành thông tin của Reseller.

* **Tên công ty / Tiêu đề tab:** Tìm thẻ `<title>Services - Mera AI</title>` $\rightarrow$ Thay "Mera AI" bằng `[RESELLER_NAME]`.
* **Mô tả SEO:** Tìm `<meta name="description" content="...">` $\rightarrow$ Thay đổi mô tả dịch vụ phù hợp.
* **Tiêu đề Hero (Hero Section):** * Tìm `<section class="hero">` $\rightarrow$ Thẻ `<h1>` và `<p>`.
    * *Mặc định:* "Global Connectivity Solutions". Tùy chỉnh thông điệp cốt lõi tại đây.

---

## 📦 2. CÁC DỊCH VỤ CẦN THAY ĐỔI (SERVICE CONTENTS)
[TARGET_BLOCK]: `<div class="services-grid">` và `<div class="strengths-grid">`
[ACTION]: Cập nhật Tiêu đề, Mô tả và Icon của từng gói dịch vụ kinh doanh.

**A. Danh sách Dịch vụ Chính (Services):**
Trang hiện tại có 4 Block `<div class="service-card">`. AI cần thay thế nội dung thẻ `<h3>` (Tên dịch vụ) và `<p>` (Mô tả chi tiết).
* *Card 1:* Vietnam National Backbone (Mạng đường trục).
* *Card 2:* Cross-Border Terrestrial Transit (Kênh truyền biên giới).
* *Card 3:* Submarine Cable Connectivity (Cáp quang biển).
* *Card 4:* Global IP Transit & Peering (Định tuyến toàn cầu).

**B. Điểm mạnh Cốt lõi (Core Strengths):**
Tìm `<div class="strengths-grid">` để thay đổi 4 giá trị cốt lõi của Reseller (VD: Global Resilience, Scalable Architecture, Security First, Expert Support).

---

## 🧮 3. HÀM TÍNH TOÁN GIÁ & LOGIC (PRICING CALCULATOR)
[TARGET_BLOCK]: `<section class="pricing-section">`
[CRITICAL_LOGIC]: Thuật toán Javascript tính giá tự động dựa trên thuộc tính `data-operation` của thẻ `<select>`. AI tuyệt đối KHÔNG xóa các class `calc-select` hay thay đổi cấu trúc thẻ này nếu không viết lại file JS.

**Cấu trúc Thuật toán (Thuật toán chuỗi):**
* `Total = (Tổng các giá trị [base]) * (Tích các giá trị [multiply]) + (Tổng các giá trị [add])`

**Hướng dẫn AI Agent sửa giá cho Reseller:**
Khi Reseller muốn đổi cấu hình hoặc bảng giá, hãy tìm đến `<div class="tab-content" id="...">` tương ứng và điều chỉnh các thẻ `<select>`:

1.  **Dịch vụ Nền tảng (Giá gốc):**
    * *Mã nguồn:* `<select class="calc-select" data-operation="base">`
    * *Cách sửa:* Đổi giá trị trong thuộc tính `value="..."`. Giá trị này sẽ là **giá USD/Tháng** căn bản. (VD: `value="800"` $\rightarrow$ 800$).
2.  **Hệ số nhân (Theo Dung lượng/Băng thông):**
    * *Mã nguồn:* `<select class="calc-select" data-operation="multiply">`
    * *Cách sửa:* `value` ở đây là **cấp số nhân**. (VD: Gấp đôi giá thì đặt `value="2"`, giữ nguyên giá đặt `value="1"`).
3.  **Dịch vụ cộng thêm (Add-ons / SLA):**
    * *Mã nguồn:* `<select class="calc-select" data-operation="add">`
    * *Cách sửa:* `value` ở đây là **số tiền cộng thêm thẳng vào tổng bill**. (VD: Phí hỗ trợ 24/7 thêm 300$ $\rightarrow$ `value="300"`).

*Ví dụ Yêu cầu Reseller:* "Đổi giá băng thông 10Gbps của Backbone lên 6000$".
*Hành động AI:* Tìm `#tab-backbone` $\rightarrow$ Tìm `<option value="5000">10 Gbps - $5,000 / month</option>` $\rightarrow$ Đổi thành `<option value="6000">10 Gbps - $6,000 / month</option>`.

---

## 🔗 4. KÊNH KẾT NỐI & NHÀ CUNG CẤP (CONNECTION CHANNELS & CTA)
[TARGET_BLOCK]: File JS cấu hình ngoài (vd: `../common/main.js`) HOẶC các placeholder trong HTML.
[ACTION]: Đảm bảo luồng dữ liệu khách hàng trỏ đúng về hệ thống CRM/Email của Reseller.

* **Header / Footer:** Giao diện sử dụng JS để load Header/Footer qua các ID `<div id="header-placeholder"></div>` và `<div id="footer-placeholder"></div>`. Reseller cần đảm bảo file `main.js` trỏ nguồn load Header/Footer chứa số điện thoại, email hỗ trợ chuẩn xác.
* **Nút CTA / Form Contact:** (Nếu Reseller yêu cầu tích hợp Form thay vì chỉ hiển thị giá). AI có thể inject (chèn) thêm một thẻ `<form>` phía dưới `.calc-right` để truyền giá trị `.price-value` vào thẻ input ẩn (`<input type="hidden">`) và gửi (POST) về Endpoint API / Webhook của Reseller.

---
[END_OF_README]