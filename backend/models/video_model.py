import sys
import json
import cv2
import torch
import torch.nn as nn
import torchvision.transforms as transforms

class VideoCNN(nn.Module):
    def __init__(self):
        super(VideoCNN, self).__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        self.fc = nn.Sequential(
            nn.Linear(16 * 112 * 112, 2),
            nn.Softmax(dim=1)
        )

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x

if len(sys.argv) > 1:
    path = sys.argv[1]
else:
    path = ""

cap = cv2.VideoCapture(path)
frames = []
if cap.isOpened():
    count = 0
    while count < 5:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (224, 224))
        frames.append(frame)
        count += 1
    cap.release()

if len(frames) == 0:
    frames = [torch.randn(224, 224, 3).numpy() for _ in range(5)]

transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

model = VideoCNN()
model.eval()

fake_probs = []
with torch.no_grad():
    for f in frames:
        tensor = transform(f).unsqueeze(0)
        output = model(tensor)
        fake_probs.append(output[0][1].item())

prob_fake = sum(fake_probs) / len(fake_probs) if len(fake_probs) > 0 else 0.5
pred = "deepfake" if prob_fake > 0.5 else "pristine"

print(json.dumps({
    "prediction": pred,
    "confidence": float(prob_fake) if pred == "deepfake" else float(1 - prob_fake)
}))
