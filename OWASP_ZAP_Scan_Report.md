# OWASP ZAP Vulnerability Assessment Report

**Target Host:** `https://api.portfolio-mheepooh.online/`  
**Scan Date:** June 18, 2026  
**Scanner Version:** ZAP 2.17.0  
**Assessment Type:** Automated Active & Passive Web Vulnerability Scan  

---

## 1. Executive Summary

An automated vulnerability scan was performed on the target API endpoint using OWASP ZAP. The system demonstrated high security resilience, resulting in **zero (0) Critical** and **zero (0) Medium** severity vulnerabilities. 

Only **three (3) Low** severity vulnerabilities and **one (1) Informational** alert were identified. These findings primarily relate to missing defensive HTTP response headers and wildcard Cross-Origin Resource Sharing (CORS) configurations. Implementing these security configurations will further harden the system against clickjacking, MIME-sniffing, and cross-domain data leakage.

---

## 2. Summary of Alerts

| Alert Name | Risk Level | Instances | Status / Remediation |
|---|---|---|---|
| **Strict-Transport-Security Header Not Set** | 🟡 Low | 3 | Missing HSTS headers |
| **X-Content-Type-Options Header Missing** | 🟡 Low | 2 | Missing security MIME header |
| **Cross-Domain Misconfiguration** | 🟡 Low | 2 | Wildcard CORS configuration |
| **Re-examine Cache-control Directives** | 🔵 Informational | 2 | Cache policy optimization |

---

## 3. Detailed Findings & Remediation

### Finding 1: Strict-Transport-Security Header Not Set
* **Risk Level:** Low
* **Category:** OWASP A05:2021-Security Misconfiguration

#### Description
The HTTP Strict Transport Security (HSTS) header is not enforced by the web server. HSTS tells web browsers that they should only interact with the server using secure HTTPS connections, preventing man-in-the-middle (MitM) attackers from redirecting users to insecure HTTP endpoints.

#### Remediation
Configure Nginx to send the `Strict-Transport-Security` header in HTTPS responses.
Add the following line inside the `server` (listening on port 443) block in `nginx/default.conf`:
```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

---

### Finding 2: X-Content-Type-Options Header Missing
* **Risk Level:** Low
* **Category:** OWASP A05:2021-Security Misconfiguration

#### Description
The `X-Content-Type-Options` HTTP response header is missing. Without this header, browsers may attempt to "sniff" (guess) the MIME type of a file based on its content rather than relying on the `Content-Type` header sent by the server. Attackers can exploit this by uploading malicious scripts disguised as images or text files.

#### Remediation
Ensure Nginx instructs the browser not to sniff the content type.
Add the following line inside the `server` block in `nginx/default.conf`:
```nginx
add_header X-Content-Type-Options "nosniff" always;
```

---

### Finding 3: Cross-Domain Misconfiguration (Wildcard CORS)
* **Risk Level:** Low
* **Category:** OWASP A05:2021-Security Misconfiguration

#### Description
The API returns `Access-Control-Allow-Origin: *` in its response headers. While a wildcard origin is acceptable for public APIs, it allows any domain to read the API responses. If the API is updated in the future to handle sensitive private data or session cookies, wildcard CORS could allow malicious sites to steal user data.

#### Remediation
1. For public endpoints, wildcard is acceptable.
2. If credentials or cookies are introduced, restrict the origin to trusted domains only:
```javascript
// In Node.js server
res.writeHead(statusCode, {
  'Access-Control-Allow-Origin': 'https://portfolio-mheepooh.online', // Restrict to front-end domain
  'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
  ...
})
```

---

### Finding 4: Re-examine Cache-control Directives
* **Risk Level:** Informational
* **Category:** Information Disclosure

#### Description
The server does not specify a strict caching policy for data-heavy endpoints. Browsers or intermediate proxy servers may cache response data. For static assets, caching is desired; however, for dynamic API responses (like posts or analytics), caching should be explicitly controlled or disabled to prevent information leaks.

#### Remediation
For dynamic endpoints, Nginx or Node.js should return strict Cache-Control headers to prevent local caching:
```nginx
add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" always;
```

---

## 4. Hardening Recommendations

To completely resolve the header findings, the following security configuration block is recommended to be added to Nginx (`nginx/default.conf`):

```nginx
# Security Headers
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none';" always;
```
