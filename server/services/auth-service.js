import { createHmac, timingSafeEqual } from "node:crypto";
import { SignJWT } from "jose";

const jwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  return new TextEncoder().encode(secret);
};

const bridgeSecret = () => {
  const secret = process.env.AUTH_BRIDGE_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_BRIDGE_SECRET must contain at least 32 characters");
  }
  return secret;
};

const googleAssertionPayload = ({ name, email, image }) =>
  JSON.stringify({ name, email, image });

export const sanitizeUser = (user) => ({
  id: String(user.id),
  name: user.name,
  email: user.email,
  image: user.image ?? null,
});

export const createAccessToken = async (user) =>
  new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("dashboard-api")
    .setAudience("dashboard-admin-api")
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRES_IN || "1h")
    .sign(jwtSecret());

export const verifyGoogleAssertion = (req) => {
  const timestamp = req.get("x-auth-timestamp");
  const signature = req.get("x-auth-signature");
  const timestampSeconds = Number(timestamp);

  if (
    !timestamp ||
    !signature ||
    !Number.isInteger(timestampSeconds) ||
    Math.abs(Date.now() / 1000 - timestampSeconds) > 60
  ) {
    return false;
  }

  try {
    const expected = createHmac("sha256", bridgeSecret())
      .update(
        `${timestamp}.${googleAssertionPayload({
          name: req.body?.name,
          email: req.body?.email,
          image: req.body?.image ?? null,
        })}`
      )
      .digest();
    const supplied = Buffer.from(signature, "hex");

    return (
      supplied.length === expected.length &&
      timingSafeEqual(supplied, expected)
    );
  } catch {
    return false;
  }
};
