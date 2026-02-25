async function testApi() {
  console.log("Testing without auth...");
  try {
    const res1 = await fetch(
      "https://supaeval-backend.azurewebsites.net/v1/workspaces",
    );
    console.log("No auth status:", res1.status);
    console.log("No auth response:", await res1.text());
  } catch (e) {
    console.error("No auth error:", e.message);
  }

  console.log("\nTesting with dummy auth...");
  try {
    const res2 = await fetch(
      "https://supaeval-backend.azurewebsites.net/v1/workspaces",
      {
        headers: {
          Authorization: "Bearer dummy_token_123",
        },
      },
    );
    console.log("Dummy auth status:", res2.status);
    console.log("Dummy auth response:", await res2.text());
  } catch (e) {
    console.error("Dummy auth error:", e.message);
  }

  console.log("\nTesting with double slash /v1//workspaces...");
  try {
    const res3 = await fetch(
      "https://supaeval-backend.azurewebsites.net/v1//workspaces",
    );
    console.log("Double slash no auth status:", res3.status);
  } catch (e) {
    console.error("Double slash error:", e.message);
  }
}

testApi();
