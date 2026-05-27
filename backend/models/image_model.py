import sys
import json
import cv2
import torch
import torch.nn as nn
import torchvision.transforms as transforms

class DeepfakeCNN(nn.Module):
    def __init__(self):
        super(DeepfakeCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(16, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2)
        )
        self.classifier = nn.Sequential(
            nn.Linear(32 * 56 * 56, 128),
            nn.ReLU(),
            nn.Linear(128, 2),
            nn.Softmax(dim=1)
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)
        return x

if len(sys.argv) > 1:
    path = sys.argv[1]
else:
    path = ""

img = cv2.imread(path)
if img is None:
    img = torch.randn(224, 224, 3).numpy()

img = cv2.resize(img, (224, 224))
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])
tensor = transform(img).unsqueeze(0)

model = DeepfakeCNN()
model.eval()
with torch.no_grad():
    output = model(tensor)
    prob_fake = output[0][1].item()

pred = "deepfake" if prob_fake > 0.5 else "pristine"
print(json.dumps({
    "prediction": pred,
    "confidence": float(prob_fake) if pred == "deepfake" else float(1 - prob_fake)
}))
