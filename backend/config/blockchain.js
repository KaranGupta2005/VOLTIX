import crypto from "crypto";

export const logDecisionToBlockchain = async (decisionObj) => {

  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(decisionObj))
    .digest("hex");

  // In real world → send to chain
  // For now store in DB or file

  console.log("🔐 Blockchain hash logged:", hash);

  return hash;
};
