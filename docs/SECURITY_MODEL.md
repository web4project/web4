# Security model (overview)

Web4Project aims to keep your data **user-owned**, **local**, and **encrypted**.

## Goals

- **Confidentiality**: vault contents are not readable without the passphrase.
- **Integrity**: tampering with encrypted data should be detected.
- **Portability**: users can export/import an encrypted vault across devices.
- **No backend required**: the app works offline and does not need accounts.

## Non-goals

- **Passphrase recovery**: if the passphrase is lost, the vault cannot be recovered (by design).
- **Protecting a compromised device**: if malware is running on the device, it may capture keystrokes or read decrypted data while the vault is unlocked.

## Where data lives

- Vault data is stored in **IndexedDB** on the user’s device.
- Exported backups are encrypted and intended to be safe to store/transfer like any other secret file.

## Cryptography (high level)

The app encrypts on-device using:

- **Argon2id** for key derivation (from a user passphrase)
- **XSalsa20-Poly1305** for authenticated encryption

Implementation details live in the code (see `src/lib/crypto.ts`).

## Threat model notes

- Prefer long, unique passphrases.
- Treat exported vault files as sensitive.
- Lock the vault when not in use.
