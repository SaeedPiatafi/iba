import bcrypt from "bcryptjs";

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  console.log("=== verifyPassword called ===");
  console.log("Password:", password);
  console.log("Hash (first 30):", hashedPassword?.substring?.(0, 30) || "No hash");
  
  if (!hashedPassword) {
    console.error("No hash provided");
    return false;
  }
  
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    console.log("bcrypt.compare result:", result);
    return result;
  } catch (error) {
    console.error("bcrypt.compare error:", error);
    return false;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}
