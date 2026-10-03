# DeepGuard AI — Frontend Prototype

This is the first frontend version of the Deepfake Detection System.

## Files
- index.html — main website
- style.css — design and responsive layout
- script.js — upload, preview, mode selection and demo result

## Current modes
- Image
- Video only
- Audio only
- Video + Audio

## Important
The "Analyze Media" button currently produces a DEMO result. It does not run a trained AI model yet.

## Planned backend
Image:
RetinaFace → Xception → Classifier

Video:
RetinaFace → Xception → Bi-GRU → Classifier

Audio:
Wav2Vec2 → Classifier

Video + Audio:
Visual branch + Wav2Vec2 audio branch → Fusion → Classifier

The next implementation step is to connect the Image mode to a Python backend and trained Xception model.
