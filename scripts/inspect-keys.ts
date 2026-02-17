import axios from "axios";

const BASE_URL = "https://supaeval-backend.azurewebsites.net/v1";
const TOKEN = process.env.AUTH_TOKEN || "";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${TOKEN}` },
});

async function run() {
  try {
    console.log("--- LIST ---");
    const res = await apiClient.get("/datasets");
    if (res.data.length > 0) {
      const d = res.data[0];
      Object.keys(d).forEach((k) => console.log(`${k}: ${d[k]}`));

      console.log("\n--- DETAIL ---");
      try {
        const detail = await apiClient.get(`/datasets/${d.id}`);
        Object.keys(detail.data).forEach((k) =>
          console.log(`${k}: ${detail.data[k]}`),
        );
      } catch (e) {
        console.log("Detail failed");
      }
    } else {
      console.log("No datasets");
    }
  } catch (e) {
    console.error(e);
  }
}
run();
