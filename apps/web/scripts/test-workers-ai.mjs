const accountId =
  (process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();

const token =
  (process.env.CLOUDFLARE_AI_TOKEN || "").trim();

const model =
  (process.env.ARKNOZ_AI_MODEL ||
    "@cf/meta/llama-3.1-8b-instruct-fast").trim();

if (!accountId) {
  console.error("FAIL: Missing CLOUDFLARE_ACCOUNT_ID");
  process.exit(1);
}

if (!token) {
  console.error("FAIL: Missing CLOUDFLARE_AI_TOKEN");
  process.exit(1);
}

const url =
  `https://api.cloudflare.com/client/v4/accounts/` +
  `${accountId}/ai/run`;

try {
  const response = await fetch(url, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "cf-aig-gateway-id": "default",
    },

    body: JSON.stringify({
      model,

      input: {
        messages: [
          {
            role: "user",
            content:
              "Return exactly this text and nothing else: ARKNOZ_AI_PASS",
          },
        ],

        max_tokens: 20,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    console.error("WORKERS AI CONNECTION: FAIL");
    console.error(`HTTP STATUS: ${response.status}`);
    console.error(
      JSON.stringify(data.errors || data, null, 2)
    );
    process.exit(1);
  }

  console.log("");
  console.log("WORKERS AI CONNECTION: PASS");
  console.log(`MODEL: ${model}`);
  console.log("CLOUDFLARE AI API: REACHABLE");
  console.log("");
} catch (error) {
  console.error("WORKERS AI CONNECTION: FAIL");
  console.error(error.message);
  process.exit(1);
}