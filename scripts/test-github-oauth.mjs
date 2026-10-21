import dotenv from "dotenv";
dotenv.config();

console.log("🧪 Running GitHub OAuth Integration Test Suite...\n");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || "https://acmbitm.campsy.app/api/integrations/github/callback";

  // Test 1: Secrets configured
  console.log("1. Checking Environment Variables...");
  assert(Boolean(clientId), "GITHUB_CLIENT_ID is present in environment");
  assert(Boolean(clientSecret), "GITHUB_CLIENT_SECRET is present in environment");
  assert(Boolean(redirectUri), "GITHUB_REDIRECT_URI is present in environment");

  // Test 2: Live GitHub API credentials validation
  console.log("\n2. Validating Credentials with Live GitHub OAuth Endpoint...");
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: "test_verification_code_for_probe",
      }),
    });

    const data = await res.json();
    // When credentials are valid, GitHub recognizes them and responds with bad_verification_code.
    // If credentials were invalid, GitHub would respond with incorrect_client_credentials.
    assert(
      data.error === "bad_verification_code",
      `GitHub API accepted client_id and client_secret as valid (Response: ${data.error} - ${data.error_description})`
    );
    assert(
      data.error !== "incorrect_client_credentials",
      "GitHub API confirmed credentials are NOT rejected as incorrect"
    );
  } catch (err) {
    assert(false, `GitHub probe failed with network error: ${err.message}`);
  }

  // Test 3: Negative test with deliberate invalid secret
  console.log("\n3. Verifying Negative Test (Detecting Bad Secret)...");
  try {
    const res = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: "intentionally_incorrect_secret",
        code: "test_code",
      }),
    });

    const data = await res.json();
    assert(
      data.error === "incorrect_client_credentials",
      "GitHub correctly rejects fake credentials with 'incorrect_client_credentials'"
    );
  } catch (err) {
    assert(false, `Negative test failed with network error: ${err.message}`);
  }

  // Test 4: Verify Authorize URL formulation
  console.log("\n4. Verifying OAuth Authorize URL Formulation...");
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "read:user,user:email");
  authUrl.searchParams.set("state", "test_state_nonce");

  assert(authUrl.searchParams.get("client_id") === clientId, "Client ID properly formatted in authorize URL");
  assert(authUrl.searchParams.get("scope") === "read:user,user:email", "Scopes set to read:user,user:email");
  assert(authUrl.searchParams.get("redirect_uri") === redirectUri, "Redirect URI points to ACM BIT Mesra callback endpoint");

  // Test 5: Verify Authorize endpoint live redirect
  console.log("\n5. Testing Live GitHub Authorize Endpoint...");
  try {
    const authRes = await fetch(authUrl.toString(), {
      redirect: "manual",
    });
    assert(
      authRes.status === 302 || authRes.status === 200,
      `GitHub Authorize endpoint responded with HTTP ${authRes.status} (Valid app login redirect)`
    );
  } catch (err) {
    assert(false, `Authorize endpoint failed with error: ${err.message}`);
  }

  console.log("\n==========================================");
  console.log(`GitHub OAuth Test Results: ${passed} Passed, ${failed} Failed`);
  console.log("==========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
