import sanitizeHtml from 'sanitize-html';
import { createSeededRandom } from './seededRandom.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Email Analysis Toy Model
 * Implements deterministic rule-based phishing detection
 */

const SHORTENERS = ['bit.ly', 't.co', 'tinyurl.com', 'ow.ly', 'is.gd', 'goo.gl', 'buff.ly', 'adf.ly'];
const URGENT_PHRASES = [
    'verify your account',
    'verify account',
    'act now',
    'act immediately',
    'suspend',
    'suspended',
    'unusual activity',
    'confirm your identity',
    'update your information',
    'click here immediately',
    'urgent',
    'immediately',
    'expire',
    'limited time'
];

/**
 * Extract URLs from email text
 */
function extractURLs(text) {
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
    const matches = [];
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        matches.push({
            url: match[0],
            start: match.index,
            end: match.index + match[0].length
        });
    }

    return matches;
}

/**
 * Extract email headers (simple parser)
 */
function extractHeaders(text) {
    const headers = {};
    const lines = text.split('\n');

    for (const line of lines) {
        if (line.trim() === '') break; // End of headers

        const match = line.match(/^([A-Za-z-]+):\s*(.+)$/);
        if (match) {
            headers[match[1].toLowerCase()] = match[2].trim();
        }
    }

    return headers;
}

/**
 * Check if URL uses a shortener service
 */
function isShortenerURL(url) {
    try {
        const urlObj = new URL(url);
        return SHORTENERS.some(shortener => urlObj.hostname.includes(shortener));
    } catch {
        return false;
    }
}

/**
 * Check if URL uses IP address instead of domain
 */
function isIPBasedURL(url) {
    try {
        const urlObj = new URL(url);
        const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
        return ipRegex.test(urlObj.hostname);
    } catch {
        return false;
    }
}

/**
 * Extract domain from URL
 */
function extractDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname;
    } catch {
        return null;
    }
}

/**
 * Analyze links in email
 */
function analyzeLinks(urls, headers, rng) {
    if (urls.length === 0) return { score: 0, highlights: [] };

    let totalScore = 0;
    const highlights = [];

    const fromDomain = headers.from ? extractDomain(`http://${headers.from.split('@')[1] || 'unknown'}`) : null;

    for (const urlInfo of urls) {
        let linkScore = 0;
        let reasons = [];

        // Check for shorteners
        if (isShortenerURL(urlInfo.url)) {
            linkScore += 0.85;
            reasons.push("shortened URL that may hide malicious destination");
        }

        // Check for IP-based URLs
        if (isIPBasedURL(urlInfo.url)) {
            linkScore += 0.7;
            reasons.push("uses IP address instead of domain name");
        }

        // Check domain mismatch
        const urlDomain = extractDomain(urlInfo.url);
        if (fromDomain && urlDomain && !urlDomain.includes(fromDomain) && !fromDomain.includes(urlDomain)) {
            linkScore += 0.15;
            reasons.push("link domain doesn't match sender domain");
        }

        // Add some deterministic variance
        linkScore += rng.nextInRange(-0.05, 0.05);
        linkScore = Math.min(1, Math.max(0, linkScore));

        if (linkScore > 0.5) {
            highlights.push({
                kind: 'link',
                text: urlInfo.url,
                start: urlInfo.start,
                end: urlInfo.end,
                reason: reasons.join('; '),
                score: Math.round(linkScore * 100) / 100
            });
        }

        totalScore += linkScore;
    }

    return {
        score: urls.length > 0 ? totalScore / urls.length : 0,
        highlights
    };
}

/**
 * Analyze text for phishing indicators
 */
function analyzeText(text, rng) {
    let score = 0;
    const highlights = [];
    const lowerText = text.toLowerCase();

    for (const phrase of URGENT_PHRASES) {
        const index = lowerText.indexOf(phrase);
        if (index !== -1) {
            score += 0.2;

            highlights.push({
                kind: 'token',
                text: text.substring(index, index + phrase.length),
                start: index,
                end: index + phrase.length,
                reason: 'urgent language attempting to create pressure',
                score: 0.72
            });
        }
    }

    // Check for credential requests
    const credentialKeywords = ['password', 'social security', 'ssn', 'credit card', 'cvv', 'pin'];
    for (const keyword of credentialKeywords) {
        if (lowerText.includes(keyword)) {
            score += 0.15;
        }
    }

    // Add deterministic variance
    score += rng.nextInRange(-0.05, 0.1);

    return {
        score: Math.min(1, Math.max(0, score)),
        highlights: highlights.slice(0, 3) // Limit to top 3
    };
}

/**
 * Check sender authenticity
 */
function checkSender(headers, urls, rng) {
    let score = 1.0; // Start with high trust

    if (!headers.from) {
        score -= 0.5;
    }

    const fromDomain = headers.from ? extractDomain(`http://${headers.from.split('@')[1] || 'unknown'}`) : null;

    // Check if links point to different domains
    if (fromDomain && urls.length > 0) {
        const linkDomains = urls.map(u => extractDomain(u.url)).filter(Boolean);
        const mismatchCount = linkDomains.filter(d => !d.includes(fromDomain) && !fromDomain.includes(d)).length;

        if (mismatchCount === linkDomains.length && linkDomains.length > 0) {
            score -= 0.8; // Major red flag
        }
    }

    // Add deterministic variance
    score += rng.nextInRange(-0.05, 0.05);

    return Math.min(1, Math.max(0, score));
}

/**
 * Generate sanitized HTML preview with highlights
 */
async function generateHighlightedHTML(text, highlights, staticDir, jobId) {
    // Sort highlights by position (reverse) to avoid offset issues
    const sortedHighlights = [...highlights].sort((a, b) => b.start - a.start);

    let htmlContent = sanitizeHtml(text, {
        allowedTags: [],
        allowedAttributes: {}
    }).replace(/\n/g, '<br>');

    // Insert highlight spans
    for (const highlight of sortedHighlights) {
        const before = htmlContent.substring(0, highlight.start);
        const highlighted = htmlContent.substring(highlight.start, highlight.end);
        const after = htmlContent.substring(highlight.end);

        const colorClass = highlight.score >= 0.8 ? 'high-risk' : highlight.score >= 0.5 ? 'medium-risk' : 'low-risk';

        htmlContent = before +
            `<span class="highlight ${colorClass}" data-reason="${sanitizeHtml(highlight.reason)}" data-score="${highlight.score}">${highlighted}</span>` +
            after;
    }

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Preview</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
      background: #1a1a1a;
      color: #e0e0e0;
      line-height: 1.6;
    }
    .highlight {
      padding: 2px 4px;
      border-radius: 3px;
      cursor: help;
      position: relative;
    }
    .highlight.high-risk {
      background: rgba(239, 68, 68, 0.3);
      border: 1px solid #ef4444;
    }
    .highlight.medium-risk {
      background: rgba(251, 191, 36, 0.3);
      border: 1px solid #fbbf24;
    }
    .highlight.low-risk {
      background: rgba(59, 130, 246, 0.3);
      border: 1px solid #3b82f6;
    }
    .highlight:hover::after {
      content: attr(data-reason) " (Score: " attr(data-score) ")";
      position: absolute;
      bottom: 100%;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      border-radius: 4px;
      white-space: nowrap;
      z-index: 1000;
      font-size: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

    const jobDir = path.join(staticDir, `job-${jobId}`);
    await fs.mkdir(jobDir, { recursive: true });

    const htmlPath = path.join(jobDir, 'email-preview.html');
    await fs.writeFile(htmlPath, fullHTML, 'utf-8');

    return `/static/job-${jobId}/email-preview.html`;
}

/**
 * Main email analysis function
 */
export async function analyzeEmail(jobId, payload, staticDir) {
    const rng = createSeededRandom(jobId, payload);

    const headers = extractHeaders(payload);
    const urls = extractURLs(payload);

    // Analyze components
    const linkAnalysis = analyzeLinks(urls, headers, rng);
    const textAnalysis = analyzeText(payload, rng);
    const senderScore = checkSender(headers, urls, rng);

    // Calculate weighted confidence
    const confidence = (
        0.4 * linkAnalysis.score +
        0.35 * textAnalysis.score +
        0.25 * (1 - senderScore)
    );

    // Determine verdict
    let verdict = 'safe';
    if (confidence >= 0.8) {
        verdict = 'phishing';
    } else if (confidence >= 0.5) {
        verdict = 'suspicious';
    }

    // Combine highlights
    const allHighlights = [...linkAnalysis.highlights, ...textAnalysis.highlights];

    // Generate explanations
    const explanations = [];
    if (linkAnalysis.score >= 0.7) {
        explanations.push('Suspicious links detected with potential redirects or mismatched domains');
    }
    if (textAnalysis.score >= 0.5) {
        explanations.push('Urgent language and pressure tactics commonly used in phishing');
    }
    if (senderScore < 0.3) {
        explanations.push('Sender domain does not match link destinations');
    }

    // Generate highlighted HTML
    const htmlUrl = await generateHighlightedHTML(payload, allHighlights, staticDir, jobId);

    return {
        verdict,
        confidence: Math.round(confidence * 100) / 100,
        score_map: {
            text_model: Math.round(textAnalysis.score * 100) / 100,
            link_analysis: Math.round(linkAnalysis.score * 100) / 100,
            sender_checks: Math.round(senderScore * 100) / 100
        },
        highlights: allHighlights,
        explanations,
        visuals: {
            highlighted_email_html: htmlUrl,
            heatmap_url: null
        }
    };
}
