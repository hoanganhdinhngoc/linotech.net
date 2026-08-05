// ==========================================
// SEND CONTACT FORM DATA TO CLOUDFLARE FUNCTIONS
// ==========================================

const CLOUDFLARE_API_CONTACT_URL = "/api/contact";

// Function Setup Contact Form
function setupContactForm() {
    const form = document.getElementById('linotechContactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        const feedbackMsg = document.getElementById('formFeedback');

        // Lấy dữ liệu người dùng điền
        const payload = {
            fullName: document.getElementById('fFullName')?.value.trim() || '',
            email: document.getElementById('fEmail')?.value.trim() || '',
            phone: document.getElementById('fPhone')?.value.trim() || '',
            jobTitle: document.getElementById('fJobTitle')?.value.trim() || '',
            company: document.getElementById('fCompany')?.value.trim() || '',
            message: document.getElementById('fMessage')?.value.trim() || '',
            submittedAt: new Date().toISOString()
        };

        if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Sending...'; }

        // Bắn dữ liệu về Cloudflare Functions
        fetch(CLOUDFLARE_API_CONTACT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                if (feedbackMsg) {
                    feedbackMsg.style.display = 'inline-block';
                    feedbackMsg.style.color = 'var(--primary-green)';
                    feedbackMsg.innerText = 'Message sent successfully!';
                }
                form.reset();
            } else {
                console.error("Server Error:", data.message);
                if (feedbackMsg) {
                    feedbackMsg.style.display = 'inline-block';
                    feedbackMsg.style.color = 'red';
                    feedbackMsg.innerText = 'An error occurred. Please try again.';
                }
            }
        })
        .catch(err => {
            console.error("Fetch Error:", err);
            if (feedbackMsg) {
                feedbackMsg.style.display = 'inline-block';
                feedbackMsg.style.color = 'red';
                feedbackMsg.innerText = 'Network error. Please try again.';
            }
        })
        .finally(() => {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Send'; }
            if (feedbackMsg) { setTimeout(() => { feedbackMsg.style.display = 'none'; }, 5000); }
        });
    });
}

// ==========================================
// SMART CONTACT LINKS - SCROLL OR REDIRECT
// ==========================================
function setupSmartContactLinks() {
    const contactLinks = document.querySelectorAll('a[href$="#connect-section"]');
    const targetSection = document.getElementById('connect-section');

    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (targetSection) {
                e.preventDefault();
                const headerOffset = 50; 

                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                history.pushState(null, null, '#connect-section');
            } 
        });
    });
}

// ==========================================
// LOAD COMPONENTS & REPLACE PATHS (TỐI ƯU HÓA PROMISE)
// ==========================================
async function loadComponent(placeholderId, filePath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return; 

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Cannot fetch ${filePath}`);
        
        let html = await response.text();
        
        // Thay thế biến {{ROOT_PATH}} bằng đường dẫn tương đối của trang hiện tại
        const basePath = window.ROOT_PATH || './';
        html = html.replace(/\{\{ROOT_PATH\}\}/g, basePath);
        
        placeholder.innerHTML = html;
    } catch (error) {
        console.error("Lỗi khi load component:", error);
    }
}

// Khởi chạy khi DOM sẵn sàng bằng async/await
document.addEventListener("DOMContentLoaded", async () => {
    const basePath = window.ROOT_PATH || './';
    
    // Tải song song cả 3 component để tăng tốc độ hiển thị
    await Promise.all([
        loadComponent('header-placeholder', basePath + 'common/header.html'),
        loadComponent('connect-placeholder', basePath + 'common/connect.html'),
        loadComponent('footer-placeholder', basePath + 'common/footer.html')
    ]);

    // Chỉ gọi hàm setup 1 lần duy nhất sau khi mọi HTML đã được chèn vào trang
    setupContactForm();
    setupSmartContactLinks();
});

// ==========================================
// GLOBAL FAVICON FIX
// ==========================================
// Tự động chuẩn hóa Favicon cho mọi trang trên hệ thống Linotech
(function() {
    // 1. Tự động tính toán đường dẫn tương đối từ trang hiện tại ra ngoài Root
    const basePath = window.ROOT_PATH || './'; 
    
    // 2. Nối đường dẫn tương đối vào thư mục cdn
    const iconPath = basePath + 'cdn/images/icon-dark.png'; 
    
    // Tìm xem trang hiện tại đã có thẻ icon chưa
    let link = document.querySelector("link[rel~='icon']");
    
    // Nếu chưa có thì tự động tạo mới
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    
    // Ép đường dẫn ảnh về chuẩn
    link.href = iconPath;
})();