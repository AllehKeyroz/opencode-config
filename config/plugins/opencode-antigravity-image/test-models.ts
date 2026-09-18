import { loadAccounts } from "C:/Users/User/.config/opencode/plugins/opencode-antigravity-image/src/accounts";
import { refreshAccessToken, fetchImageModelQuota } from "C:/Users/User/.config/opencode/plugins/opencode-antigravity-image/src/api";

async function test() {
  const config = await loadAccounts();
  const account = config.accounts[0];
  const token = await refreshAccessToken(account.refreshToken);
  
  // First check what fetchImageModelQuota returns
  const quota = await fetchImageModelQuota(token);
  if (quota) {
    console.log("Quota from fetchImageModelQuota:", JSON.stringify(quota, null, 2));
  } else {
    console.log("fetchImageModelQuota returned null");
  }
  
  // Now get the raw data to see all models
  const res = await fetch("https://daily-cloudcode-pa.sandbox.googleapis.com/v1internal:fetchAvailableModels", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "antigravity/1.11.3 Darwin/arm64",
    },
    body: JSON.stringify({}),
  });
  
  const data = await res.json();
  const models = data.models || {};
  const keys = Object.keys(models);
  console.log("\nTotal models in response:", keys.length);
  
  const imageModels = keys.filter(k => k.includes("flash-image") || k.includes("pro-image") || k.includes("image") || k.includes("gemini-3"));
  console.log("\nRelevant models:");
  for (const k of imageModels.slice(0, 15)) {
    const m = models[k];
    const qi = m?.quotaInfo;
    if (qi) {
      console.log(`  ${k}: remaining=${qi.remainingFraction}, reset=${qi.resetTime}`);
    } else {
      console.log(`  ${k}: no quotaInfo`);
    }
  }
}
test().catch(console.error);
