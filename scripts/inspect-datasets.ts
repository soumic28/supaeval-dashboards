import axios from "axios";

// Configuration
const BASE_URL = "https://supaeval-backend.azurewebsites.net/v1";
const TOKEN = process.env.AUTH_TOKEN || "PASTE_YOUR_TOKEN_HERE";

if (TOKEN === "PASTE_YOUR_TOKEN_HERE") {
  console.error("❌ Auth token missing.");
  process.exit(1);
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

async function inspectDatasets() {
  console.log(`\n🔎 Inspecting /datasets Response Structure\n`);

  try {
    const res = await apiClient.get("/datasets");
    const datasets = res.data;
    if (Array.isArray(datasets) && datasets.length > 0) {
      const d = datasets[0];
      console.log("🔑 Keys in Dataset Object:");
      console.log(Object.keys(d).join(", "));
      console.log("\n📦 Sample Values:");
      // Print relevant fields
      console.log(`id: ${d.id}`);
      console.log(`name: ${d.name}`);
      console.log(`entry_count: ${d.entry_count}`); // Checked in code
      console.log(`prompt_count: ${d.prompt_count}`);
      console.log(`num_prompts: ${d.num_prompts}`);
      console.log(`count: ${d.count}`);
      console.log(`prompts: ${d.prompts}`); // Might be array or null
    } else {
      console.log("⚠️ No datasets found.");
    }
  } catch (e: any) {
    console.error("❌ Failed to fetch datasets:", e.message);
  }
}

inspectDatasets();
