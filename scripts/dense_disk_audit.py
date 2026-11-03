import cv2
import numpy as np
import glob
import os

def analyze_image_sequence(pattern, roi_func=None):
    files = sorted(glob.glob(pattern))
    prev_gray = None
    results = []
    for f in files:
        img = cv2.imread(f)
        if img is None: continue
        if roi_func:
            img = roi_func(img)
        # downsample for fast optical flow
        h, w, _ = img.shape
        small = cv2.resize(img, (w // 2, h // 2))
        gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
        
        basename = os.path.basename(f)
        if prev_gray is not None and prev_gray.shape == gray.shape:
            flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
            vx = float(np.mean(flow[..., 0]))
            vy = float(np.mean(flow[..., 1]))
            mag = float(np.mean(np.sqrt(flow[..., 0]**2 + flow[..., 1]**2)))
            results.append((basename, vx, vy, mag))
        prev_gray = gray
    return results

print("=== 1. DECK CARDS (6.0s - 10.0s) ===")
deck_res = analyze_image_sequence("public/card-audit-deep/deck_*.jpg", lambda img: img[300:1000, 500:1100])
for name, vx, vy, mag in deck_res:
    print(f"{name:20s} | vx: {vx:+6.2f}, vy: {vy:+6.2f}, mag: {mag:5.2f}")

print("\n=== 2. LAB HUD CARD (16.5s - 19.5s) ===")
lab_res = analyze_image_sequence("public/card-audit-deep/lab_*.jpg", lambda img: img[600:1050, 400:1300])
for name, vx, vy, mag in lab_res:
    print(f"{name:20s} | vx: {vx:+6.2f}, vy: {vy:+6.2f}, mag: {mag:5.2f}")

print("\n=== 3. CONTACT US DOCKING (29.0s - 32.2s) ===")
contact_res = analyze_image_sequence("public/card-audit-deep/contact_*.jpg", lambda img: img[400:900, 300:1300])
for name, vx, vy, mag in contact_res:
    print(f"{name:20s} | vx: {vx:+6.2f}, vy: {vy:+6.2f}, mag: {mag:5.2f}")

