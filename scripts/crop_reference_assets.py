import cv2
import os

os.makedirs('./public/assets', exist_ok=True)

# 1. Bento Fluid from sec_06.0.jpg & Molecule from sec_05.0.jpg
img6 = cv2.imread('./public/audit-frames/sec_06.0.jpg')
img5 = cv2.imread('./public/audit-frames/sec_05.0.jpg')
if img6 is not None:
    h, w, _ = img6.shape
    crop_fluid = img6[int(h*0.235):int(h*0.79), int(w*0.088):int(w*0.392)]
    cv2.imwrite('./public/assets/bento_fluid.jpg', crop_fluid)
    print("Cleaned bento_fluid.jpg")

if img5 is not None:
    h, w, _ = img5.shape
    # Card 3 in sec_05.0 is completely clean with no text
    crop_mol = img5[int(h*0.42):int(h*0.696), int(w*0.712):int(w*0.902)]
    cv2.imwrite('./public/assets/bento_molecule.jpg', crop_mol)
    print("Cleaned bento_molecule.jpg from sec_05.0 (pristine)")

# 2. Lab device background from sec_17.0.jpg (clean, no left text)
img17 = cv2.imread('./public/audit-frames/sec_17.0.jpg')
if img17 is not None:
    h, w, _ = img17.shape
    crop_device = img17[int(h*0.27):int(h*0.705), int(w*0.086):int(w*0.914)]
    cv2.imwrite('./public/assets/hud_lab_device.jpg', crop_device)
    print("Cleaned hud_lab_device.jpg from sec_17.0 (clean)")


# 3. Webinars from sec_20.0.jpg
img20 = cv2.imread('./public/audit-frames/sec_20.0.jpg')
if img20 is not None:
    h, w, _ = img20.shape
    w1 = img20[int(h*0.585):int(h*0.685), int(w*0.355):int(w*0.435)]
    w2 = img20[int(h*0.585):int(h*0.685), int(w*0.568):int(w*0.648)]
    w3 = img20[int(h*0.585):int(h*0.685), int(w*0.78):int(w*0.86)]
    cv2.imwrite('./public/assets/webinar_1.jpg', w1)
    cv2.imwrite('./public/assets/webinar_2.jpg', w2)
    cv2.imwrite('./public/assets/webinar_3.jpg', w3)
    print("Cleaned webinar images")

# 4. Sarah Mitchell photo from sec_24.0.jpg
img24 = cv2.imread('./public/audit-frames/sec_24.0.jpg')
if img24 is not None:
    h, w, _ = img24.shape
    sarah = img24[int(h*0.42):int(h*0.54), int(w*0.33):int(w*0.44)]
    cv2.imwrite('./public/assets/team_sarah.jpg', sarah)
    print("Cleaned team_sarah.jpg")

# 5. Brand Orb Chamber from sec_28.0.jpg
img28 = cv2.imread('./public/audit-frames/sec_28.0.jpg')
if img28 is not None:
    h, w, _ = img28.shape
    crop_orb = img28[int(h*0.29):int(h*0.80), int(w*0.098):int(w*0.902)]
    cv2.imwrite('./public/assets/brand_orb_chamber.jpg', crop_orb)
    print("Cleaned brand_orb_chamber.jpg")
