import jwt from "jsonwebtoken";

type MilitaryActionPayload = { requestId: string | number; action: "approve" | "reject" };

const SECRET = process.env.PAYLOAD_SECRET || "";

export function signMilitaryActionToken(payload: MilitaryActionPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyMilitaryActionToken(token: string): MilitaryActionPayload | null {
  try {
    return jwt.verify(token, SECRET) as MilitaryActionPayload;
  } catch {
    return null;
  }
}
