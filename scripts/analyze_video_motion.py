import os
import cv2
import numpy as np
import json

VIDEO_PATH = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity-ide\brain\415a6c31-def6-4bae-b5d0-a88ef544a74b\.tempmediaStorage\media_1793039934279.mp4"

def analyze_motion():
    if not os.path.exists(VIDEO_PATH):
        print(f"Error: {VIDEO_PATH} not found.")
        return

    cap = cv2.VideoCapture(VIDEO_PATH)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps

    print(f"--- Analyzing Reference Video Motion ({duration:.2f}s, {fps} fps) ---")

    # Sample key motion intervals
    sections = [
        {"name": "Hero & Concentric Rings", "start_s": 0.0, "end_s": 3.0},
        {"name": "Mission Word-by-Word Text Reveal", "start_s": 3.0, "end_s": 5.5},
        {"name": "Bento Floating Pill & Accordeon", "start_s": 5.5, "end_s": 8.5},
        {"name": "Pinned Horizontal Cards Glide", "start_s": 9.0, "end_s": 15.0},
        {"name": "Science Timeline Step Scrub", "start_s": 16.0, "end_s": 21.0},
        {"name": "Our Team 3D Tilt & Lavender Popup", "start_s": 22.0, "end_s": 24.5},
        {"name": "History Marquee & Year Selector", "start_s": 25.0, "end_s": 28.0},
        {"name": "Contact Us Card Slot-in & Form Fly-up", "start_s": 29.0, "end_s": 32.3},
    ]

    results = []

    for sec in sections:
        start_frame = int(sec["start_s"] * fps)
        end_frame = min(int(sec["end_s"] * fps), total_frames - 1)

        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
        ret, prev_frame = cap.read()
        if not ret:
            continue

        prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
        prev_gray = cv2.resize(prev_gray, (400, 300))

        magnitudes = []
        vert_displacements = []
        horiz_displacements = []

        step = 2 # process every 2nd frame for maximum speed (< 2s)
        for f_idx in range(start_frame + step, end_frame, step):
            cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
            ret, frame = cap.read()
            if not ret:
                break

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            gray = cv2.resize(gray, (400, 300))

            flow = cv2.calcOpticalFlowFarneback(prev_gray, gray, None, 0.5, 3, 15, 3, 5, 1.2, 0)
            mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])

            mean_mag = float(np.mean(mag))
            mean_dx = float(np.mean(flow[..., 0]))
            mean_dy = float(np.mean(flow[..., 1]))

            magnitudes.append(mean_mag)
            horiz_displacements.append(mean_dx)
            vert_displacements.append(mean_dy)

            prev_gray = gray

        avg_mag = float(np.mean(magnitudes)) if magnitudes else 0
        peak_mag = float(np.max(magnitudes)) if magnitudes else 0
        net_dx = float(np.sum(horiz_displacements)) if horiz_displacements else 0
        net_dy = float(np.sum(vert_displacements)) if vert_displacements else 0

        # Classify motion pattern
        if abs(net_dx) > abs(net_dy) * 1.5:
            motion_type = "Horizontal Pin / Glide"
        elif abs(net_dy) > 1.5 and abs(net_dx) < 1.0:
            motion_type = "Vertical Scroll Scrub / Fly-up"
        elif peak_mag > 3.0 and avg_mag < 1.5:
            motion_type = "Burst / Snap Trigger"
        else:
            motion_type = "Kinetic Scrub / Ambient Floating"

        results.append({
            "section": sec["name"],
            "timestamp": f"{sec['start_s']:.1f}s - {sec['end_s']:.1f}s",
            "motion_type": motion_type,
            "avg_velocity": round(avg_mag, 2),
            "peak_velocity": round(peak_mag, 2),
            "dominant_vector": f"dx={net_dx:.1f}, dy={net_dy:.1f}"
        })

    cap.release()

    print("\n--- MOTION ANALYSIS RESULTS ---")
    for r in results:
        print(f"[{r['timestamp']}] {r['section']}")
        print(f"   Type: {r['motion_type']}")
        print(f"   Velocity: Avg={r['avg_velocity']}, Peak={r['peak_velocity']} | Vector: {r['dominant_vector']}")
        print("--------------------------------------------------")

    with open("public/deep-audit/video_motion_report.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    analyze_motion()
