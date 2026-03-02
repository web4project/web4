import sodium from 'libsodium-wrappers-sumo';

let sodiumReady = false;

export async function initSodium(): Promise<void> {
  if (sodiumReady) return;
  await sodium.ready;
  sodiumReady = true;
}

export function toBase64(bytes: Uint8Array): string {
  return sodium.to_base64(bytes, sodium.base64_variants.ORIGINAL);
}

export function fromBase64(str: string): Uint8Array {
  return sodium.from_base64(str, sodium.base64_variants.ORIGINAL);
}

export function generateSalt(): string {
  const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
  return toBase64(salt);
}

export interface KDFParams {
  salt: string;
  opsLimit: number;
  memLimit: number;
}

export async function deriveKey(passphrase: string, params: KDFParams): Promise<Uint8Array> {
  await initSodium();
  const saltBytes = fromBase64(params.salt);
  return sodium.crypto_pwhash(
    sodium.crypto_secretbox_KEYBYTES,
    passphrase,
    saltBytes,
    params.opsLimit,
    params.memLimit,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );
}

export async function createVaultKey(passphrase: string): Promise<{ key: Uint8Array; params: KDFParams }> {
  await initSodium();
  const salt = generateSalt();
  const params: KDFParams = {
    salt,
    opsLimit: sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    memLimit: sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
  };
  const key = await deriveKey(passphrase, params);
  return { key, params };
}

export function encryptPayload(key: Uint8Array, payload: string): { ciphertext: string; nonce: string } {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const message = sodium.from_string(payload);
  const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key);
  return {
    ciphertext: toBase64(ciphertext),
    nonce: toBase64(nonce),
  };
}

export function decryptPayload(key: Uint8Array, ciphertext: string, nonce: string): string {
  const ciphertextBytes = fromBase64(ciphertext);
  const nonceBytes = fromBase64(nonce);
  const decrypted = sodium.crypto_secretbox_open_easy(ciphertextBytes, nonceBytes, key);
  return sodium.to_string(decrypted);
}

export function wipeKey(key: Uint8Array): void {
  sodium.memzero(key);
}
