import os
import cv2
import numpy as np
import json

VIDEO_PATH = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity-ide\brain\415a6c31-def6-4bae-b5d0-a88ef544a74b\.tempmediaStorage\media_1793039934279.mp4"

def track_scrolling():
    if not os.path.exists(VIDEO_PATH):
        print(f"Error: {VIDEO_PATH} not found.")
        return

    cap = cv2.VideoCapture(VIDEO_PATH)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    print(f"--- Tracking Scroll Travel & Displacements across {duration:.2f}s ({fps} fps) ---")

    # We track vertical displacement across the entire video
    ret, prev_frame = cap.read()
    if not ret:
        return

    prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    # Focus on the central 60% of the screen to track global page translation
    crop_x1, crop_x2 = int(w * 0.2), int(w * 0.8)
    prev_center = prev_gray[:, crop_x1:crop_x2]

    frame_step = 3
    scroll_events = []
    current_y = 0

    frame_y_offsets = [0]
    timestamps = [0.0]

    for f_idx in range(frame_step, total_frames, frame_step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        center = gray[:, crop_x1:crop_x2]

        # Template matching or phase correlation to find vertical shift
        shift = cv2.phaseCorrelate(np.float32(prev_center), np.float32(center))
        dy = shift[0][1] # dy is vertical pixel movement

        # If significant confidence and realistic scroll delta
        if abs(dy) < h * 0.5:
            current_y += dy

        t = f_idx / fps
        frame_y_offsets.append(round(float(current_y), 1))
        timestamps.append(round(float(t), 2))

        prev_center = center

    cap.release()

    # Define key milestone sections
    milestones = [
        {"name": "Hero to Mission Text", "start": 1.5, "end": 4.5},
        {"name": "Mission to Bento Cards", "start": 4.5, "end": 8.0},
        {"name": "Services Horizontal Glide", "start": 8.5, "end": 14.5},
        {"name": "Science Timeline Scrub", "start": 15.0, "end": 21.0},
        {"name": "Our Team Pinned Tilt & Popup", "start": 21.5, "end": 24.5},
        {"name": "History Reel 2009-2026", "start": 25.0, "end": 28.0},
        {"name": "Contact Us Slot-in & Form", "start": 28.5, "end": 32.0},
    ]

    summary = []
    for m in milestones:
        # find closest indices
        idx1 = min(range(len(timestamps)), key=lambda i: abs(timestamps[i] - m["start"]))
        idx2 = min(range(len(timestamps)), key=lambda i: abs(timestamps[i] - m["end"]))
        travel_px = abs(frame_y_offsets[idx2] - frame_y_offsets[idx1])
        duration_s = m["end"] - m["start"]
        summary.append({
            "section": m["name"],
            "timestamp": f"{m['start']}s - {m['end']}s",
            "scroll_travel_px": round(travel_px * 2.2, 0), # scaled to viewport resolution
            "duration_s": duration_s
        })

    print("\n--- MEASURED SCROLL TRAVEL FOR EACH SECTION ---")
    for s in summary:
        print(f"[{s['timestamp']}] {s['section']}: ~{int(s['scroll_travel_px'])}px scroll travel")

    with open("public/deep-audit/scroll_travel_data.json", "w") as f:
        json.dump(summary, f, indent=2)

if __name__ == "__main__":
    track_scrolling()
