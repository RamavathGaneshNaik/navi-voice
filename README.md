# Navi-Voice

### A Hybrid Context-Aware Real-Time Assistive Object Detection and Navigation System for the Visually Impaired

Navi-Voice is an AI-powered mobile assistive system designed to help visually impaired individuals navigate safely and independently using real-time object detection and audio feedback. The system uses the YOLOv8 deep learning model optimized with TensorFlow Lite for efficient on-device inference. 

---

## 📌 Features

* 🔍 Real-time object detection using YOLOv8
* 📱 Mobile-based assistive navigation system
* 🧠 Context-aware detection modes

  * Outdoor Navigation
  * Indoor Exploration
  * Object Identification
* 🔊 Audio feedback using Text-to-Speech (TTS)
* 📳 Haptic vibration alerts for obstacle proximity
* ⚡ TensorFlow Lite optimized model for faster inference
* 🌐 Fully offline processing (No Internet required)

---

## 🛠️ Technologies Used

### Frontend / Mobile App

* Flutter
* Dart
* CameraX API
* Text-to-Speech API

### Backend / AI

* YOLOv8
* TensorFlow Lite
* Python
* OpenCV

### Development Tools

* Android Studio
* Google Colab
* GitHub

---

## 📂 Project Structure

```bash
Navi-Voice/
│
├── assets/
│   ├── model.tflite
│   ├── labels.txt
│
├── lib/
│   ├── main.dart
│   ├── detector.dart
│   ├── voice_helper.dart
│   ├── utils.dart
│
├── android/
├── ios/
├── pubspec.yaml
└── README.md
```

---

## 🚀 How It Works

1. The smartphone camera captures live video frames.
2. Frames are preprocessed and passed to the YOLOv8 model.
3. The system detects nearby objects in real time.
4. Context-aware mode filters relevant objects.
5. Distance estimation is calculated.
6. Audio and vibration feedback are generated for the user.

---

## 📊 Performance

* Detection Accuracy (mAP@0.5): **90%+**
* Real-Time Processing Speed: **20+ FPS**
* Optimized for Android mobile devices using TensorFlow Lite. 

---

## 📱 System Requirements

### Hardware

* Android Smartphone (Android 10+)
* Minimum 4GB RAM
* 8MP Camera
* 4000mAh Battery Recommended

### Software

* Android Studio
* Flutter SDK
* TensorFlow Lite
* Python 3.x
---

## 🧠 Model Training

1. Download COCO Dataset
2. Train YOLOv8 model
3. Convert model to TensorFlow Lite

```bash
yolo train model=yolov8n.pt data=data.yaml epochs=50
```

Convert to TFLite:

```bash
python export.py --weights best.pt --include tflite
```

---

## 📖 Modules

* Data Processing Module
* Model Training Module
* Mobile Application Module
* Speech Output Module 

---

## 🎯 Objectives

* Improve mobility for visually impaired individuals
* Provide real-time navigation assistance
* Reduce dependency on traditional assistive tools
* Deliver affordable and portable assistive technology 

---

## 🔮 Future Enhancements

* GPS-based navigation
* Depth estimation
* Low-light object detection
* Sensor fusion with LiDAR/Ultrasonic sensors
* Cloud synchronization and analytics

---

## 👨‍💻 Authors

* Ramavath Ganesh Naik
* Shaik Mastanvali

### Guided By

Dr. D. Preethi
Assistant Professor
Department of Computer Science & Engineering
Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology 

---

## 📄 License

This project is developed for academic and research purposes.

---

## ⭐ Acknowledgement

We sincerely thank our faculty members, project coordinators, and institution for their support and guidance throughout the development of this project. 
