export async function onRequestPost(context) {
  try {
    // 1. Airtable Webhook URL of Linotech (Lấy chính xác từ code GAS của Sir)
    const airtableUrl = "https://hooks.airtable.com/workflows/v1/genericWebhook/appP7QrAm7Hgq5gya/wfltz4pK2n30ecaVw/wtrO5XZLHOBlIBcGZ";

    // 2. Parse JSON payload sent from Linotech Website
    // Hàm này tương đương với JSON.parse(e.postData.contents) bên GAS
    const payload = await context.request.json();

    // 3. Map payload fields clearly for Airtable workflow (Giữ nguyên cấu trúc của Sir)
    const airtablePayload = {
      "Full Name": payload.fullName || "",
      "Email": payload.email || "",
      "Phone Number": payload.phone || "",
      "Job Title": payload.jobTitle || "",
      "Company Name": payload.company || "",
      "Message": payload.message || "",
      "Submitted At": payload.submittedAt || new Date().toISOString()
    };

    // 4. Forward data to Airtable Webhook (Server-to-Server)
    const response = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(airtablePayload),
    });

    // Bắt lỗi nếu Airtable từ chối request
    if (!response.ok) {
      throw new Error(`Airtable Webhook error: ${response.status} ${response.statusText}`);
    }

    // 5. Return success response to frontend (Tương đương ContentService bên GAS)
    return new Response(JSON.stringify({ "status": "success" }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json" 
      }
    });

  } catch (error) {
    // Return error message cho Frontend
    return new Response(JSON.stringify({ "status": "error", "message": error.toString() }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json" 
      }
    });
  }
}