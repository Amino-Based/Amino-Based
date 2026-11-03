import cv2
import glob
import os

images = sorted(glob.glob('./public/final-animation-audit/*.jpg'))
if not images:
    print("No images found.")
    exit(0)

first_frame = cv2.imread(images[0])
height, width, layers = first_frame.shape

video_path = './public/final-animation-audit/animations_demo.mp4'
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
video = cv2.VideoWriter(video_path, fourcc, 1, (width, height))

for image in images:
    img = cv2.imread(image)
    if img is not None:
        if (img.shape[0], img.shape[1]) != (height, width):
            img = cv2.resize(img, (width, height))
        # 1.5 seconds per section frame
        for _ in range(2):
            video.write(img)

video.release()
print(f"Video saved to {video_path}")

