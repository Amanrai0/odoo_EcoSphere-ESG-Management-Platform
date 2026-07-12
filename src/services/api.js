/**
 * EcoSphere API Service client SDK.
 * 
 * Grouping all endpoints into this file makes it easy for Tanisha, Aman, Kunal, and Ayush
 * to transition the app from mock states to active HTTP requests.
 */

const API_BASE_URL = "/api/v1"; // Proxied by Vite config to backend address (e.g. http://localhost:8069)

// Helper to handle general requests with auth token headers
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("auth_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    let errorMessage = "An API error occurred.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // JSON parse failed, use default message
    }
    throw new Error(errorMessage);
  }
  
  // Return null for empty response body (like file downloads or deletions)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  }
  return response;
}

export const api = {
  // === Ayush: Auth & Profiles ===
  auth: {
    login: async (email, password) => {
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
      }
      return data;
    },
    getProfile: () => request("/profile"),
    logout: () => {
      localStorage.removeItem("auth_token");
    }
  },

  // === Ayush: Departments & Scores ===
  departments: {
    list: () => request("/departments"),
    scores: () => request("/departments/scores"),
    create: (deptData) => request("/departments", {
      method: "POST",
      body: JSON.stringify(deptData)
    })
  },

  // === Tanisha: Environmental ===
  environmental: {
    listTransactions: () => request("/carbon-transactions"),
    createTransaction: (txData) => request("/carbon-transactions", {
      method: "POST",
      body: JSON.stringify(txData),
    }),
    previewEmissions: (calcData) => request("/carbon-transactions/calculate", {
      method: "POST",
      body: JSON.stringify(calcData),
    }),
    listGoals: () => request("/environmental-goals"),
    createGoal: (goalData) => request("/environmental-goals", {
      method: "POST",
      body: JSON.stringify(goalData),
    }),
  },

  // === Aman: Social & CSR ===
  social: {
    listActivities: () => request("/csr-activities"),
    createActivity: (activityData) => request("/csr-activities", {
      method: "POST",
      body: JSON.stringify(activityData),
    }),
    participate: (activityId, proofUrl) => request(`/csr-activities/${activityId}/participate`, {
      method: "POST",
      body: JSON.stringify({ proof_url: proofUrl }),
    }),
    moderateParticipation: (participationId, approval_status) => request(`/csr-participations/${participationId}`, {
      method: "PUT",
      body: JSON.stringify({ approval_status }),
    }),
  },

  // === Kunal: Governance ===
  governance: {
    listPolicies: () => request("/policies"),
    acknowledgePolicy: (policyId) => request(`/policies/${policyId}/acknowledge`, {
      method: "POST",
    }),
    listAudits: () => request("/audits"),
    createAudit: (auditData) => request("/audits", {
      method: "POST",
      body: JSON.stringify(auditData),
    }),
    listComplianceIssues: () => request("/compliance-issues"),
    createComplianceIssue: (issueData) => request("/compliance-issues", {
      method: "POST",
      body: JSON.stringify(issueData),
    }),
    resolveComplianceIssue: (issueId) => request(`/compliance-issues/${issueId}/resolve`, {
      method: "POST", // or PUT depending on backend route choice
    }),
  },

  // === Ayush: Gamification & Rewards ===
  gamification: {
    getLeaderboard: () => request("/leaderboard"),
    listRewards: () => request("/rewards"),
    redeemReward: (rewardId) => request(`/rewards/${rewardId}/redeem`, {
      method: "POST",
    }),
    listChallenges: () => request("/challenges"),
    startChallenge: (challengeId) => request(`/challenges/${challengeId}/start`, {
      method: "POST",
    })
  },

  // === Ayush: Reports & Global Config ===
  system: {
    getSettings: () => request("/settings"),
    updateSettings: (settingsData) => request("/settings", {
      method: "PUT",
      body: JSON.stringify(settingsData),
    }),
    generateCustomReport: async (filters, format) => {
      const response = await request("/reports/custom", {
        method: "POST",
        body: JSON.stringify({ filters, format }),
      });
      return response; // will return raw response stream for file download
    }
  }
};
