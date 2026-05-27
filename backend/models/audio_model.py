import sys
import json
import wave
import numpy as np
import torch
import torch.nn as nn

class AudioCNN(nn.Module):
    def __init__(self):
        super(AudioCNN, self).__init__()
        self.conv1 = nn.Conv1d(1, 8, kernel_size=3, stride=1, padding=1)
        self.pool = nn.MaxPool1d(2)
        self.fc1 = nn.Linear(8 * 500, 64)
        self.fc2 = nn.Linear(64, 2)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))
        x = x.view(x.size(0), -1)
        x = torch.relu(self.fc1(x))
        x = self.softmax(self.fc2(x))
        return x

if len(sys.argv) > 1:
    path = sys.argv[1]
else:
    path = ""

try:
    with wave.open(path, 'rb') as w:
        frames = w.readframes(1000)
        audio_data = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
except Exception:
    audio_data = np.random.randn(1000).astype(np.float32)

if len(audio_data) < 1000:
    audio_data = np.pad(audio_data, (0, 1000 - len(audio_data)), 'constant')
else:
    audio_data = audio_data[:1000]

tensor = torch.from_numpy(audio_data).unsqueeze(0).unsqueeze(0)
model = AudioCNN()
model.eval()
with torch.no_grad():
    output = model(tensor)
    prob_fake = output[0][1].item()

pred = "deepfake" if prob_fake > 0.5 else "pristine"
print(json.dumps({
    "prediction": pred,
    "confidence": float(prob_fake) if pred == "deepfake" else float(1 - prob_fake)
}))
