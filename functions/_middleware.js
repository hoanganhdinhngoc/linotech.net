// Khai báo ID GTM của Linotech
const GTM_ID = 'GTM-T6KVXL4X';

// Mã GTM dành cho thẻ head
const gtmHeadScript = `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->
`;

// Mã GTM dành cho thẻ body
const gtmBodyScript = `
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`;

// Cấu hình chèn vào thẻ head
class HeadRewriter {
  element(element) {
    element.prepend(gtmHeadScript, { html: true });
  }
}

// Cấu hình chèn vào thẻ body
class BodyRewriter {
  element(element) {
    element.prepend(gtmBodyScript, { html: true });
  }
}

// Hàm Middleware chặn mọi request
export async function onRequest(context) {
  const response = await context.next();
  
  // Kiểm tra: Chỉ chèn code GTM nếu file tải về là HTML (bỏ qua CSS, JS, Hình ảnh)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("text/html")) {
    return new HTMLRewriter()
      .on("head", new HeadRewriter())
      .on("body", new BodyRewriter())
      .transform(response);
  }
  
  return response;
}