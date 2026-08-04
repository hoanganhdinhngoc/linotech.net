// Function Setup Contact Form (Trích lược phần JS xử lý form)
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

        submitBtn.disabled = true; submitBtn.innerText = 'Sending...';

        fetch(GOOGLE_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Dùng text/plain để tránh Preflight CORS
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                feedbackMsg.style.display = 'inline-block';
                feedbackMsg.style.color = 'var(--primary-green)';
                form.reset();
            }
        })
        .finally(() => {
            submitBtn.disabled = false; submitBtn.innerText = 'Send';
            setTimeout(() => { feedbackMsg.style.display = 'none'; }, 5000);
        });
    });
}

// Hàm Fetch HTML file và chèn vào một div cụ thể
async function loadComponent(placeholderId, filePath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return; // Nếu trang không có chỗ chứa này thì bỏ qua

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Cannot fetch ${filePath} - Status: ${response.status}`);
        }
        const html = await response.text();
        placeholder.innerHTML = html;
    } catch (error) {
        console.error("Lỗi khi load component:", error);
    }
}

// Chạy hàm ngay khi HTML tải xong
document.addEventListener("DOMContentLoaded", () => {
    // ROOT_PATH được khai báo ở đầu các file index.html để đảm bảo đường dẫn luôn chuẩn
    const basePath = window.ROOT_PATH || './';
    
    loadComponent('header-placeholder', basePath + 'common/header.html');
    loadComponent('connect-placeholder', basePath + 'common/connect.html');
    loadComponent('footer-placeholder', basePath + 'common/footer.html');
});