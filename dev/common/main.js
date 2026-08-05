// ==========================================
// KHAI BÁO URL GOOGLE APPS SCRIPT CỦA LINOTECH
// ==========================================
const GOOGLE_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxP7-uZKjKaGj7OyNoid-Q8wCEpTA7NR865ksm0EnbGi-CZ7b6XCLAr3iPw6gtfplI/exec";

// Function Setup Contact Form
function setupContactForm() {
    const form = document.getElementById('linotechContactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        const feedbackMsg = document.getElementById('formFeedback');

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

        fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
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
            }
        })
        .finally(() => {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Send'; }
            if (feedbackMsg) { setTimeout(() => { feedbackMsg.style.display = 'none'; }, 5000); }
        });
    });
}

// ==========================================
// SMART CONTACT LINKS - CUỘN HOẶC CHUYỂN TRANG
// ==========================================
function setupSmartContactLinks() {
    // Tìm tất cả các link đang trỏ tới #connect-section
    const contactLinks = document.querySelectorAll('a[href$="#connect-section"]');
    const targetSection = document.getElementById('connect-section');

    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Nếu trang hiện tại ĐÃ CÓ sẵn phần form liên hệ -> Chỉ cuộn mượt xuống
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, '#connect-section');
            } 
            // Nếu trang hiện tại KHÔNG CÓ form (VD: trang blogs) -> Để trình duyệt chuyển hướng về trang chủ
        });
    });
}

// ==========================================
// LOAD COMPONENTS & REPLACE PATHS
// ==========================================
async function loadComponent(placeholderId, filePath, callback) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return; 

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Cannot fetch ${filePath}`);
        
        let html = await response.text();
        
        // CỐT LÕI TẠI ĐÂY: Thay thế biến {{ROOT_PATH}} bằng đường dẫn tương đối của trang hiện tại
        const basePath = window.ROOT_PATH || './';
        html = html.replace(/\{\{ROOT_PATH\}\}/g, basePath);
        
        placeholder.innerHTML = html;
        
        if (typeof callback === 'function') callback();
    } catch (error) {
        console.error("Lỗi khi load component:", error);
    }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
    const basePath = window.ROOT_PATH || './';
    
    // Đảm bảo chạy setupSmartContactLinks sau khi Header/Footer đã được load xong
    loadComponent('header-placeholder', basePath + 'common/header.html', setupSmartContactLinks);
    
    loadComponent('connect-placeholder', basePath + 'common/connect.html', () => {
        setupContactForm();
        setupSmartContactLinks(); 
    });
    
    loadComponent('footer-placeholder', basePath + 'common/footer.html', setupSmartContactLinks);
});