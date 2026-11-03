import re
import os

with open("components/HomeClient.tsx", "r", encoding="utf-8") as f:
    text = f.read()

images = set(re.findall(r"['\"](\/[^'\"\s]+\.(?:jpg|png|webp|svg))['\"]", text))
missing = [img for img in sorted(images) if not os.path.exists("public" + img.replace("/", os.sep))]
print(f"Total referenced images: {len(images)}")
print(f"Missing images: {len(missing)}")
for m in missing:
    print("  MISSING:", m)

