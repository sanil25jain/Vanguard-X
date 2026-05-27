# Vanguard X

![Version](https://img.shields.io/badge/version-1.1.0-cyan)
![License](https://img.shields.io/badge/license-MIT-purple)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

**AI-Powered Phishing & Deepfake Detection Platform**

End-to-end phishing and deepfake detection with explainable AI

## Project info

🛡️ Analyze emails, images, videos, and audio for phishing attempts and deepfake manipulation using deterministic ML toy models.

**Live URL**: https://vanguard-x.netlify.app

## ✨ Features

- 🎨 Full-screen 3D Spline model integration
- 🔒 Phishing email detection
- 🎭 Deepfake media analysis
- ⚡ Real-time threat assessment
- 📊 Confidence score visualization
- 🌙 Professional dark theme with neon accents
- 📱 Fully responsive design


## 📧 Contact

For questions or support, please open an issue on GitHub.


## Features-

✅ **Multi-Format Analysis**: Email, image, video, audio  

✅ **Deterministic ML**: Seeded toy models for reproducible results  **Use GitHub Codespaces**

✅ **Dark Neon UI**: Interactive dashboard with confidence gauges  

✅ **Security**: API auth, rate limiting, auto-expiring jobs (24h TTL)  - Navigate to the main page of your repository.

✅ **Explainable AI**: Detailed reasons and remediation steps  - Click on the "Code" button (green button) near the top right.

✅ **Accessible**: ARIA labels, keyboard navigation, high contrast  - Select the "Codespaces" tab.



### Email (Phishing Detection)
- Confidence ≥ 0.80 → `phishing`
- Confidence 0.50-0.79 → `suspicious`
- Confidence < 0.50 → `safe`

**Rules:**
- Shorteners (bit.ly, t.co) → +0.85 score
- IP-based URLs → +0.70 score
- Urgent phrases → +0.20 per phrase

### Image/Video (Deepfake Detection)
- Confidence ≥ 0.80 → `deepfake`
- Confidence 0.50-0.79 → `suspicious`
- Confidence < 0.50 → `real`


## File Size Limits

| Type | Max Size |
|------|----------|
| Email | 1 MB |
| Image | 10 MB |
| Video | 100 MB |
| Audio | 20 MB |


## Security Features

🔒 API key authentication  
🔒 Rate limiting (20 req/min per IP)  
🔒 Input validation & file size limits  
🔒 HTML sanitization  
🔒 Sandboxed iframe previews  
🔒 Auto-delete jobs after 24h  
🔒 No raw content logging  

## Accessibility

♿ Keyboard navigation (Tab, Ctrl+Enter)  
♿ ARIA labels and roles  
♿ High contrast mode support  
♿ Reduced motion support  
♿ Screen reader friendly  



