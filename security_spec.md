# Security Specification & Threat Model - Kamakhya Tours Settings

This document outlines the security architecture, invariants, and threat vectors for the dynamic site-settings collection.

## 1. Data Invariants
* **Read Integrity**: Any guest user can read `/settings/site` to view the live WhatsApp numbers, promotional banners, packages, and hero carousels.
* **Write Integrity**: No anonymous, arbitrary guest can write or mutate `/settings/site`.
* **Pincode Safety**: Admin updates to `/settings/site` are allowed if they match the current administrative PIN (proving possession of the access token) or if they are authenticated as the project administrator.
* **Immortal Pin Field**: The PIN itself cannot be updated unless the request validates against the correct historical PIN value.

---

## 2. The "Dirty Dozen" Payloads (Update/Mutation Attempts)

These JSON payloads represent malicious or invalid attempts to hijack, poison, or corrupt the settings document. They must always return `PERMISSION_DENIED` on writes.

### Payload 1: Unauthorized Global Overwrite (No Pincode)
```json
{
  "whatsappNumber": "111111111111",
  "promotionalOffer": "Hacked Offer",
  "adminPin": "9999",
  "carouselSlides": [],
  "packages": []
}
```

### Payload 2: Price Poisoning (Nullifying base values)
```json
{
  "whatsappNumber": "916003031569",
  "promotionalOffer": "Offer",
  "adminPin": "1234",
  "carouselSlides": [],
  "packages": null
}
```

### Payload 3: Injected Admin Override Field
```json
{
  "whatsappNumber": "916003031569",
  "promotionalOffer": "Alert",
  "adminPin": "1234",
  "carouselSlides": [],
  "packages": [],
  "role": "hacker_superuser"
}
```

### Payload 4: Arbitrary Float / Non-Numeric WhatsApp Channel
```json
{
  "whatsappNumber": 918000000000.5,
  "promotionalOffer": "Custom Offer",
  "adminPin": "1234",
  "carouselSlides": [],
  "packages": []
}
```

### Payload 5: Empty Pincode De-authorization
```json
{
  "whatsappNumber": "916003031569",
  "promotionalOffer": "Custom Offer",
  "adminPin": "",
  "carouselSlides": [],
  "packages": []
}
```

### Payload 6: Oversized Alert Bloat Attack (Denial of Wallet, 1MB string)
```json
{
  "whatsappNumber": "916003031569",
  "promotionalOffer": "STRING_OF_1_MILLION_CHARACTERS...",
  "adminPin": "1234",
  "carouselSlides": [],
  "packages": []
}
```

### Payload 7: Corrupted Array Type mismatch (carouselSlides is string)
```json
{
  "whatsappNumber": "916003031569",
  "promotionalOffer": "Custom Offer",
  "adminPin": "1234",
  "carouselSlides": "not-an-array",
  "packages": []
}
```

### Payload 8: Direct delete attempt of core settings
(Action: Delete request of `/settings/site`)

### Payload 9: Forged Timestamp Verification Spoofing
```json
{
  "whatsappNumber": "916003031569",
  "promotionalOffer": "Offer",
  "adminPin": "1234",
  "carouselSlides": [],
  "packages": [],
  "updatedAt": "2020-01-01T00:00:00Z"
}
```

### Payload 10: Injecting executable strings/SQL indicators as phone channel
```json
{
  "whatsappNumber": "916003; DROP TABLE users;",
  "promotionalOffer": "Offer",
  "adminPin": "1234",
  "carouselSlides": [],
  "packages": []
}
```

### Payload 11: Attempting to bypass strict structure keys
```json
{
  "whatsappNumber": "916003031569",
  "promotionalOffer": "Offer",
  "adminPin": "1234",
  "carouselSlides": [],
  "packages": [],
  "vandalism": true
}
```

### Payload 12: Changing the Admin PIN to a non-string number
```json
{
  "whatsappNumber": "916003031569",
  "promotionalOffer": "Offer",
  "adminPin": 7777,
  "carouselSlides": [],
  "packages": []
}
```

---

## 3. Threat Model Evaluation & Test Specifications
The system checks that only valid admin calls possessing the active PIN from the prior resource state are processed. If any validation or auth credentials differ, updates fail immediately.
