import sys
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

train_emails = [
    "Hey, are we still meeting for lunch today?",
    "Please review the attached project proposal.",
    "Can you send me the guidelines for the next sprint?",
    "Your account has been suspended! Click here to verify your credentials.",
    "Urgent: Immediate password reset required for your security.",
    "Congratulations! You won a $1000 gift card. Claim now at this link."
]
train_labels = [0, 0, 0, 1, 1, 1]

pipeline = Pipeline([
    ('vectorizer', TfidfVectorizer()),
    ('classifier', LogisticRegression())
])
pipeline.fit(train_emails, train_labels)

if len(sys.argv) > 1:
    text = sys.argv[1]
else:
    text = ""

prob = pipeline.predict_proba([text])[0][1]
pred = "phishing" if prob > 0.5 else "safe"

print(json.dumps({
    "prediction": pred,
    "confidence": float(prob) if pred == "phishing" else float(1 - prob)
}))
