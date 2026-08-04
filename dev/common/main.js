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