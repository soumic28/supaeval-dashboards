import axios from "axios";

// Configuration matches src/lib/api-client.ts
const BASE_URL = "https://supaeval-backend.azurewebsites.net/v1";

// 🔑 PASTE YOUR TOKEN HERE OR USE 'AUTH_TOKEN' ENV VARIABLE
const TOKEN = process.env.AUTH_TOKEN || "PASTE_YOUR_TOKEN_HERE";

if (TOKEN === "PASTE_YOUR_TOKEN_HERE") {
  console.error(
    "❌ Auth token missing. Please set AUTH_TOKEN env var or paste it in the script.",
  );
  console.error(
    "👉 checks: DevTools (F12) -> Application -> Local Storage -> auth_token",
  );
  process.exit(1);
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
  timeout: 30000,
});

async function testEndpoints() {
  console.log(`\n🔎 Testing API Endpoints at ${BASE_URL}\n`);
  console.log(`🔑 Using Token: ${TOKEN.substring(0, 10)}...`);

  // 1. Test /workspaces
  try {
    console.log("\n🚀 Testing GET /workspaces ...");
    const workspacesRes = await apiClient.get("/workspaces");
    console.log(
      `✅ Status: ${workspacesRes.status} ${workspacesRes.statusText}`,
    );
    console.log(
      "📦 Data (Workspaces):",
      workspacesRes.data.length
        ? `Found ${workspacesRes.data.length}`
        : "Empty Array",
    );
    // console.log(JSON.stringify(workspacesRes.data, null, 2)); // Uncomment to see full data
  } catch (error: any) {
    console.error("❌ Error fetching /workspaces:", error.message);
    if (error.response) {
      console.log("   Status:", error.response.status);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
  }

  // 2. Test /runs
  try {
    console.log("\n🚀 Testing GET /runs ...");
    // Check if /workspaces succeeded to get a workspace ID?
    // Typically /runs might need query params or verify general access
    const runsRes = await apiClient.get("/runs");
    console.log(`✅ Status: ${runsRes.status} ${runsRes.statusText}`);
    console.log("📦 Data (Runs):", runsRes.data);
  } catch (error: any) {
    console.error("❌ Error fetching /runs:", error.message);
    if (error.response) {
      console.log("   Status:", error.response.status);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
  }

  // 3. Test /agents
  try {
    console.log("\n🚀 Testing GET /agents ...");
    const agentsRes = await apiClient.get("/agents");
    console.log(`✅ Status: ${agentsRes.status} ${agentsRes.statusText}`);
    console.log("📦 Data (Agents):", agentsRes.data);
  } catch (error: any) {
    console.error("❌ Error fetching /agents:", error.message);
    if (error.response) {
      console.log("   Status:", error.response.status);
      console.log("   Data:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

testEndpoints();
