import cv2
import numpy as np

cap = cv2.VideoCapture("public/reference-video.mp4")
fps = 30.0

def analyze_interval(name, start_sec, end_sec, roi_func):
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(start_sec * fps))
    prev_gray = None
    motions = []
    
    start_frame = int(start_sec * fps)
    end_frame = int(end_sec * fps)
    
    for f_idx in range(start_frame, end_frame, 3):
        cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
        ret, frame = cap.read()
        if not ret: break
        
        # Crop ROI
        roi = roi_func(frame)
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        
        if prev_gray is not None and prev_gray.shape == gray.shape:
            flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
            vx = np.mean(flow[..., 0])
            vy = np.mean(flow[..., 1])
            mag = np.mean(np.sqrt(flow[..., 0]**2 + flow[..., 1]**2))
            t = f_idx / fps
            motions.append((t, vx, vy, mag))
        prev_gray = gray
        
    return motions

# 1. Bento Fluid Image (Left card image)
bento_fluid = analyze_interval(
    "Bento Fluid Image", 5.0, 7.0,
    lambda f: f[250:850, 200:700]
)

# 2. Service Stacked Deck Cards (Card image region)
deck_cards = analyze_interval(
    "Deck Cards", 7.0, 9.5,
    lambda f: f[350:850, 550:1050]
)

# 3. Lab HUD Card
lab_hud = analyze_interval(
    "Lab HUD Card", 17.0, 19.5,
    lambda f: f[650:1050, 400:1300]
)

# 4. Contact Us Docking Card
contact_dock = analyze_interval(
    "Contact Docking Card", 29.5, 32.0,
    lambda f: f[400:900, 300:1300]
)

print("=== BENTO FLUID IMAGE MOTION ===")
for t, vx, vy, mag in bento_fluid[::2]:
    print(f"{t:.2f}s | vx: {vx:+.2f}, vy: {vy:+.2f}, mag: {mag:.2f}")

print("\n=== SERVICE DECK CARDS MOTION ===")
for t, vx, vy, mag in deck_cards[::2]:
    print(f"{t:.2f}s | vx: {vx:+.2f}, vy: {vy:+.2f}, mag: {mag:.2f}")

print("\n=== LAB HUD CARD MOTION ===")
for t, vx, vy, mag in lab_hud[::2]:
    print(f"{t:.2f}s | vx: {vx:+.2f}, vy: {vy:+.2f}, mag: {mag:.2f}")

print("\n=== CONTACT DOCKING CARD MOTION ===")
for t, vx, vy, mag in contact_dock[::2]:
    print(f"{t:.2f}s | vx: {vx:+.2f}, vy: {vy:+.2f}, mag: {mag:.2f}")

