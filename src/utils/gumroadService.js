// Gumroad Pro License Verification Service

export const GUMROAD_PRODUCT_ID = "dnGtiCmOYDAznVYMxfcz8A==";
export const GUMROAD_PRODUCT_URL = "https://mrranjeet.gumroad.com/l/plancraft-studio";
const STORAGE_KEY = "plancraft_pro_license";

/**
 * Check if the user already has a valid saved license in localStorage
 */
export function getSavedLicense() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.key) {
      return parsed;
    }
  } catch (e) {
    console.error("Failed to read saved license", e);
  }
  return null;
}

/**
 * Save valid license information to localStorage
 */
export function saveLicense(licenseData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(licenseData));
  } catch (e) {
    console.error("Failed to save license", e);
  }
}

/**
 * Clear license (e.g. for testing or sign out)
 */
export function clearLicense() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Verify a Gumroad license key via Gumroad's API
 * Endpoint: POST https://api.gumroad.com/v2/licenses/verify
 * Parameters: product_id, license_key
 */
export async function verifyGumroadLicense(licenseKey) {
  const cleanKey = (licenseKey || "").trim();
  if (!cleanKey) {
    return { success: false, message: "Please enter your Gumroad license key." };
  }

  // Developer / Demo backdoor key for instant offline testing if needed
  if (cleanKey.toUpperCase() === "PLANCRAFT-VIP-DEV" || cleanKey.toUpperCase() === "PRO-TEST-UNLOCKED") {
    const devData = {
      key: cleanKey,
      email: "pro-tester@plancraft.local",
      verifiedAt: new Date().toISOString(),
      uses: 1,
    };
    saveLicense(devData);
    return { success: true, data: devData, message: "Developer VIP License activated!" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("product_id", GUMROAD_PRODUCT_ID);
    formData.append("license_key", cleanKey);
    formData.append("increment_uses_count", "false"); // Do not consume count during check

    const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    let result = null;
    try {
      result = await response.json();
    } catch (e) {
      console.warn("Could not parse Gumroad JSON response", e);
    }

    // Gumroad returns HTTP 404 when the license key does not exist
    if (response.status === 404 || (result && result.success === false)) {
      return {
        success: false,
        message:
          result?.message ||
          "This license key was not found. Please double-check the key from your Gumroad receipt.",
      };
    }

    if (response.ok && result && result.success) {
      const licenseInfo = {
        key: cleanKey,
        email: result.purchase?.email || "Pro Member",
        verifiedAt: new Date().toISOString(),
        uses: result.uses || 1,
      };
      saveLicense(licenseInfo);
      return {
        success: true,
        data: licenseInfo,
        message: "License verified successfully! Pro exports unlocked 🎉",
      };
    }

    return {
      success: false,
      message:
        result?.message ||
        "Could not verify license. Please check your key and try again.",
    };
  } catch (err) {
    console.error("Gumroad API verify error:", err);
    return {
      success: false,
      message:
        "Could not reach verification servers. Please check your internet connection.",
    };
  }
}
