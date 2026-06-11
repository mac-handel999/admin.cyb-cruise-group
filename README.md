# 🌐 CYB CRUISE GROUP (2024/2025 SET)
> **Securing the Roster Matrix.** A high-tech, responsive, and secure student directory platform designed exclusively for the Cybersecurity class group.

Developed and Engineered by: **{FABIAN CODES HQ}**

---

## 🚀 Overview
**CYB CRUISE GROUP** is a custom-built web directory platform that serves as a central hub for the 2024/2025 Cybersecurity student set. It features a fast, responsive frontend search engine, single-row mobile navigation, data obfuscation layers, and a restricted-access administrative control suite tailored for the Course Representative.

---

## 🛠️ Key Features & Ecosystem Integration

The web application acts as a secure command terminal, seamlessly bridging the core class roster engine with an array of dedicated academic and technical tools:

### 1. Active Directory Search Engine & Core Lists
* **Interactive Class Lists:** Instant client-side lookup filtering through all 241 student records by **Full Name** or **Registration Number**.
* **Profile Card Generator:** A custom DOM engine that generates clean, modern profile cards for isolated matches.

### 2. Integrated Academic & Threat Analysis Modules
* 📊 **CGPA Calculator (`cgpa-calc-woad.vercel.app`)** – A built-in academic tracking utility optimized for students to compute and analyze their cumulative grade point averages on the fly.
* 🛡️ **CYB Vigilan-Teem (`cyber-vtem.vercel.app`)** – The centralized class-group security defense initiative portal tracking collaborative security targets.
* 🔍 **URL Checker (`url-checker-gules.vercel.app`)** – A live link parsing application designed to scan, analyze, and flag malicious vectors, keeping peers safe from web-based threats.
* 📦 **CYB Stack (`cyber-stack.vercel.app`)** – A structured library architecture containing vital engineering documentation, tools, and technical resources.
* 📰 **CYB News (`cyber-news.pxxl.xyz`)** – A dedicated security intelligence feed keeping the set informed about global vulnerabilities, exploits, and departmental updates.

### 3. Course Representative Master Suite (Protected)
* **Global Excel Export:** Allows the course rep to download the full, multi-column class roster cleanly as a compiled CSV table with one click.
* **Master PDF Print Driver:** Compiles all 241 student records dynamically into a printable viewport matrix for instant browser-to-PDF compilation.

---

## 🔐 Architecture & Security Implementation

As a security-focused application running in a frontend context, the project implements several defensive layers to enforce data integrity:

* **Base64 Payload Obfuscation:** The student roster array is compiled, encoded, and fetched as a scrambled cipher data block (`students.json`). This prevents regular web inspectors from sniffing or copying plain-text registration indexes from the browser Network tab.
* **XSS Sanitization Matrix:** All real-time input fields are handled through a defensive regex sanitization hook to neutralize potential Cross-Site Scripting (`<script>`, html wrappers, or slash vectors) injections.
* **Cryptographic Identity Challenge:** Administrative download functions are gated behind a secure console verification block. User registration credential strings are immediately hashed using standard client-side **SHA-256 (Secure Hash Algorithm)** engines to match hardcoded keys without exposing raw administrative credentials in plain text.

---

## 💻 Tech Stack
* **Frontend Structure:** HTML5 (Semantic Layouts)
* **Interface Styling:** CSS3 (Custom Responsive Grid Layouts, Hardware-Accelerated Swipes, SOC-Inspired Hex Palettes: Deep Dark-Blue & Ox-Blood)
* **Application Logic:** Vanilla JavaScript (ES6+, Web Crypto API, Asynchronous File Streams)
* **Development Target Environments:** Fully optimized for compiling inside lightweight mobile environments like Acode and Spck IDEs, as well as desktop viewports.

---

## 📦 Local Deployment Instructions

1. **Clone or Download the Workspace:**
   Ensure the core files are resting inside the same root directory:
   ```text
   ├── index.html
   ├── directory.html
   ├── app.js
   └── students.json (Base64 Encoded Payload)


   © 2026 {FABIAN CODES HQ} | All Rights Reserved. Protecting Class Integrity through Code.
