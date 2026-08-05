// ==========================================
// KHAI BÁO URL GOOGLE APPS SCRIPT CỦA LINOTECH
// ==========================================
const GOOGLE_SCRIPT_WEB_APP_URL = "/api/contact";

// Function Setup Contact Form xử lý gửi dữ liệu qua Google Script
function setupContactForm() {
    const form = document.getElementById('linotechContactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        const feedbackMsg = document.getElementById('formFeedback');

        // Thu thập payload
        const payload = {
            fullName: document.getElementById('fFullName')?.value.trim() || '',
            email: document.getElementById('fEmail')?.value.trim() || '',
            phone: document.getElementById('fPhone')?.value.trim() || '',
            jobTitle: document.getElementById('fJobTitle')?.value.trim() || '',
            company: document.getElementById('fCompany')?.value.trim() || '',
            message: document.getElementById('fMessage')?.value.trim() || '',
            submittedAt: new Date().toISOString()
        };

        if (submitBtn) {
            submitBtn.disabled = true; 
            submitBtn.innerText = 'Sending...';
        }

        fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Dùng text/plain để tránh Preflight CORS
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
                if (feedbackMsg) {
                    feedbackMsg.style.display = 'inline-block';
                    feedbackMsg.style.color = '#ff3333';
                    feedbackMsg.innerText = 'Error: ' + data.message;
                }
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false; 
                submitBtn.innerText = 'Send';
            }
            if (feedbackMsg) {
                setTimeout(() => { feedbackMsg.style.display = 'none'; }, 5000);
            }
        });
    });
}

// Hàm Fetch HTML file và chèn vào một div cụ thể
async function loadComponent(placeholderId, filePath, callback) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return; 

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Cannot fetch ${filePath} - Status: ${response.status}`);
        }
        const html = await response.text();
        placeholder.innerHTML = html;
        
        // Nếu có hàm callback (ví dụ kích hoạt form sau khi load xong connect.html), hãy chạy nó
        if (typeof callback === 'function') {
            callback();
        }
    } catch (error) {
        console.error("Lỗi khi load component:", error);
    }
}

// Chạy hàm ngay khi HTML tải xong
document.addEventListener("DOMContentLoaded", () => {
    const basePath = window.ROOT_PATH || './';
    
    loadComponent('header-placeholder', basePath + 'common/header.html');
    
    // Khi load xong file connect.html vào placeholder, gọi luôn hàm setupContactForm để gắn sự kiện submit cho form
    loadComponent('connect-placeholder', basePath + 'common/connect.html', () => {
        setupContactForm();
    });
    
    loadComponent('footer-placeholder', basePath + 'common/footer.html');
});