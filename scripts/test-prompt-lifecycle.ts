import axios from "axios";

// Configuration
const BASE_URL = "https://supaeval-backend.azurewebsites.net/v1";
// 🔑 PASTE YOUR TOKEN HERE OR USE 'AUTH_TOKEN' ENV VARIABLE
const TOKEN = process.env.AUTH_TOKEN || "PASTE_YOUR_TOKEN_HERE";

if (TOKEN === "PASTE_YOUR_TOKEN_HERE") {
  console.error("❌ Auth token missing. Set AUTH_TOKEN env var.");
  process.exit(1);
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

async function runTest() {
  console.log(`\n🔎 Testing Prompt Lifecycle (Create -> Delete)\n`);

  let datasetId: string | null = null;

  // 1. Get a Dataset
  try {
    console.log("1️⃣  Fetching Datasets...");
    const dsRes = await apiClient.get("/datasets");
    const datasets = dsRes.data;
    if (Array.isArray(datasets) && datasets.length > 0) {
      datasetId = datasets[0].id;
      console.log(`✅ Use Dataset: ${datasets[0].name} (ID: ${datasetId})`);
    } else {
      console.error("❌ No datasets found. Cannot test prompt creation.");
      return;
    }
  } catch (e: any) {
    console.error("❌ Failed to fetch datasets:", e.message);
    return;
  }

  // 2. Create a Test Prompt
  let promptId: string | null = null;
  try {
    console.log("\n2️⃣  Creating Test Prompt...");
    const newPrompt = {
      dataset_id: datasetId,
      prompt_text: "Test Prompt from Script " + Date.now(),
      expected_output: "Test Completion",
      prompt_complexity: "L0",
      prompt_type: "completion",
    };
    const createRes = await apiClient.post("/prompts", newPrompt);

    // Handle array or single object response
    const created = Array.isArray(createRes.data)
      ? createRes.data[0]
      : createRes.data;

    if (created && created.id) {
      promptId = created.id;
      console.log(`✅ Created Prompt ID: ${promptId}`);
      console.log(`   Text: ${created.prompt_text}`);
    } else {
      console.error("❌ Created prompt has no ID:", createRes.data);
      return;
    }
  } catch (e: any) {
    console.error("❌ Failed to create prompt:", e.message);
    if (e.response) console.error("   Data:", JSON.stringify(e.response.data));
    return;
  }

  // 3. Verify it exists
  try {
    console.log(`\n3️⃣  Verifying Prompt Existence...`);
    await apiClient.get(`/prompts/${promptId}`);
    console.log(`✅ Prompt ${promptId} exists.`);
  } catch (e: any) {
    console.error(`❌ Failed to fetch created prompt:`, e.message);
  }

  // 4. Delete the Prompt
  try {
    console.log(`\n4️⃣  Deleting Prompt ${promptId}...`);
    const deleteRes = await apiClient.delete(`/prompts/${promptId}`);
    console.log(
      `✅ Delete Request Status: ${deleteRes.status} ${deleteRes.statusText}`,
    );
  } catch (e: any) {
    console.error("❌ Failed to delete prompt:", e.message);
    if (e.response) console.error("   Data:", JSON.stringify(e.response.data));
    return;
  }

  // 5. Verify it's gone
  try {
    console.log(`\n5️⃣  Verifying Deletion...`);
    await apiClient.get(`/prompts/${promptId}`);
    console.error(`❌ Prompt ${promptId} STILL EXISTS after delete!`);
  } catch (e: any) {
    if (e.response && e.response.status === 404) {
      console.log(`✅ Prompt ${promptId} is Gone (404 OK).`);
    } else {
      console.error(`❌ Error checking deletion:`, e.message);
    }
  }
}

runTest();
