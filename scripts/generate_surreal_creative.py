import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def make_surreal_creative():
    bg_path = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity\brain\d2b6008f-10fc-4e86-8225-f22a7908262b\.user_uploaded\media_1793211320023_4df6230d.jpg"
    vial_path = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity\brain\d2b6008f-10fc-4e86-8225-f22a7908262b\.user_uploaded\media_1793210368198_a7919fc2.png"
    
    out_dir = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity\brain\d2b6008f-10fc-4e86-8225-f22a7908262b"
    out_png = os.path.join(out_dir, "semaglutide_surreal_creative.png")
    out_public_png = r"c:\Users\ADIL RAZA KHAN\OneDrive\Desktop\Amino-Based\public\semaglutide-surreal-creative.png"
    out_public_webp = r"c:\Users\ADIL RAZA KHAN\OneDrive\Desktop\Amino-Based\public\semaglutide-surreal-creative.webp"

    print("Step 1: Reading and inpainting frosted glass card...")
    img = cv2.imread(bg_path)
    h, w = img.shape[:2] # 1024, 819

    # Clean the frosted glass area (x: 290..530, y: 445..760)
    # The text is bright white and the button is dark black
    roi = img[445:760, 290:530]
    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    text_mask = np.zeros_like(gray_roi)
    text_mask[gray_roi > 185] = 255
    text_mask[gray_roi < 65] = 255
    
    kernel = np.ones((5, 5), np.uint8)
    dilated_mask = cv2.dilate(text_mask, kernel, iterations=1)
    
    inpainted_roi = cv2.inpaint(roi, dilated_mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)
    
    # Smooth the frosted card surface slightly to remove any residual artifacts
    # while preserving edge boundaries
    blurred_frosted = cv2.bilateralFilter(inpainted_roi, d=9, sigmaColor=35, sigmaSpace=35)
    
    # Blend smoothed frosted area inside the card
    inner_mask = np.zeros((315, 240), dtype=np.uint8)
    cv2.rectangle(inner_mask, (10, 5), (230, 305), 255, -1)
    inner_mask = cv2.GaussianBlur(inner_mask, (15, 15), 0) / 255.0
    inner_mask = np.repeat(inner_mask[:, :, np.newaxis], 3, axis=2)
    
    final_roi = (blurred_frosted * inner_mask + roi * (1 - inner_mask)).astype(np.uint8)
    img[445:760, 290:530] = final_roi
    
    # Convert to PIL RGBA
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    canvas = Image.fromarray(img_rgb).convert("RGBA")

    # Step 2: Scale up for high-definition supersampling (2x: 1638 x 2048)
    print("Step 2: Supersampling to 2x (1638 x 2048)...")
    W2, H2 = w * 2, h * 2
    canvas_hq = canvas.resize((W2, H2), Image.Resampling.LANCZOS)

    # In 2x coordinates:
    # Circle window center: (410 * 2, 336 * 2) = (820, 672)
    # Circle radius: 114 * 2 = 228 px (diameter = 456 px)
    # Frosted shelf junction is around y = 448 * 2 = 896 px
    circle_cx = 820
    circle_cy = 672
    circle_r = 228
    shelf_y = 890

    # Step 3: Size and position the vial
    print("Step 3: Positioning authentic Semaglutide vial...")
    vial = Image.open(vial_path).convert("RGBA")
    vw, vh = vial.size
    
    # We want the vial to fit inside and slightly overlap the circular portal:
    # Target vial height = ~460 px (in 2x coords), width = ~306 px
    target_vh = 460
    target_vw = int(vw * (target_vh / vh))
    vial_scaled = vial.resize((target_vw, target_vh), Image.Resampling.LANCZOS)
    
    # Base of vial should rest right at shelf_y (890 px)
    # So top of vial is at shelf_y - target_vh + 25 = 890 - 460 + 25 = 455 px
    # Cap of vial rises to y = 455 px (circle top is 672 - 228 = 444 px) -> fits inside the circular window!
    vx = circle_cx - target_vw // 2
    vy = shelf_y - target_vh + 22
    vial_base = vy + target_vh - 12
    
    # Step 4: Add soft contact shadow & reflection onto frosted shelf
    print("Step 4: Adding contact shadow and reflection onto frosted glass...")
    shadow_layer = Image.new("RGBA", (W2, H2), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_layer)
    
    # Contact shadow
    cw = int(target_vw * 0.70)
    ch = 22
    s_draw.ellipse(
        [circle_cx - cw // 2, vial_base - ch // 2, circle_cx + cw // 2, vial_base + ch // 2],
        fill=(10, 18, 28, 160)
    )
    
    # Wider soft ambient shadow
    aw = int(target_vw * 0.95)
    ah = 45
    s_draw.ellipse(
        [circle_cx - aw // 2, vial_base - ah // 2 + 5, circle_cx + aw // 2, vial_base + ah // 2 + 5],
        fill=(20, 35, 55, 75)
    )
    
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=8))
    canvas_hq = Image.alpha_composite(canvas_hq, shadow_layer)
    
    # Composite the vial
    canvas_hq.alpha_composite(vial_scaled, (vx, vy))

    # Step 5: Render crisp modern typography onto frosted card
    print("Step 5: Rendering typography on frosted glass card...")
    t_draw = ImageDraw.Draw(canvas_hq)
    
    font_bold = "C:/Windows/Fonts/segoeuib.ttf"
    font_reg = "C:/Windows/Fonts/segoeui.ttf"
    font_sb = "C:/Windows/Fonts/seguisb.ttf"
    
    # Fonts sized for 2x canvas
    f_cat = ImageFont.truetype(font_sb, 22)
    f_title = ImageFont.truetype(font_reg, 54) # Large clean title matching "Moon"
    f_sub1 = ImageFont.truetype(font_reg, 26)
    f_sub2 = ImageFont.truetype(font_reg, 26)
    f_price = ImageFont.truetype(font_reg, 30)
    f_btn = ImageFont.truetype(font_sb, 28)
    f_tag = ImageFont.truetype(font_reg, 20)
    
    c_white = (255, 255, 255, 245)
    c_offwhite = (240, 240, 245, 215)
    c_dim = (220, 225, 235, 175)
    
    card_cx = circle_cx # 820 px
    
    # 1. Category label: "RESEARCH PEPTIDE" (subtle, elegant tracking)
    cat_text = "RESEARCH PEPTIDE"
    bb_cat = t_draw.textbbox((0, 0), cat_text, font=f_cat)
    w_cat = bb_cat[2] - bb_cat[0]
    y_cat = 930
    t_draw.text((card_cx - w_cat // 2, y_cat), cat_text, font=f_cat, fill=c_dim)
    
    # 2. Hero Title: "Semaglutide" (smooth, clean, prominent)
    title_text = "Semaglutide"
    bb_title = t_draw.textbbox((0, 0), title_text, font=f_title)
    w_title = bb_title[2] - bb_title[0]
    y_title = 968
    t_draw.text((card_cx - w_title // 2, y_title), title_text, font=f_title, fill=c_white)
    
    # 3. Sub details: "10 mg" and "Purity ≥ 99%"
    sub1_text = "10 mg"
    sub2_text = "Purity ≥ 99% · HPLC Tested"
    bb_sub1 = t_draw.textbbox((0, 0), sub1_text, font=f_sub1)
    w_sub1 = bb_sub1[2] - bb_sub1[0]
    bb_sub2 = t_draw.textbbox((0, 0), sub2_text, font=f_sub2)
    w_sub2 = bb_sub2[2] - bb_sub2[0]
    
    y_sub1 = 1045
    y_sub2 = 1082
    t_draw.text((card_cx - w_sub1 // 2, y_sub1), sub1_text, font=f_sub1, fill=c_offwhite)
    t_draw.text((card_cx - w_sub2 // 2, y_sub2), sub2_text, font=f_sub2, fill=c_offwhite)
    
    # 4. Price: "$79.99"
    price_text = "$79.99"
    bb_price = t_draw.textbbox((0, 0), price_text, font=f_price)
    w_price = bb_price[2] - bb_price[0]
    y_price = 1145
    t_draw.text((card_cx - w_price // 2, y_price), price_text, font=f_price, fill=c_white)
    
    # 5. Apple Pay / Order Button (Black pill button matching reference)
    btn_w = 360
    btn_h = 76
    btn_x0 = card_cx - btn_w // 2
    btn_y0 = 1205
    btn_x1 = card_cx + btn_w // 2
    btn_y1 = btn_y0 + btn_h
    
    # Draw sleek dark pill button with subtle border
    btn_layer = Image.new("RGBA", (W2, H2), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(btn_layer)
    b_draw.rounded_rectangle([btn_x0, btn_y0, btn_x1, btn_y1], radius=btn_h // 2, fill=(20, 22, 26, 235), outline=(255, 255, 255, 45), width=2)
    canvas_hq = Image.alpha_composite(canvas_hq, btn_layer)
    
    # Button Text: " Pay" or "Order Now"
    t_draw = ImageDraw.Draw(canvas_hq)
    btn_text = " Pay"
    bb_btn = t_draw.textbbox((0, 0), btn_text, font=f_btn)
    w_btn = bb_btn[2] - bb_btn[0]
    h_btn = bb_btn[3] - bb_btn[1]
    t_draw.text((card_cx - w_btn // 2, btn_y0 + (btn_h - h_btn) // 2 - 3), btn_text, font=f_btn, fill=(255, 255, 255, 255))
    
    # 6. Tagline below button
    tag_text = "Pure. Verified. Lab Grade."
    bb_tag = t_draw.textbbox((0, 0), tag_text, font=f_tag)
    w_tag = bb_tag[2] - bb_tag[0]
    y_tag = 1300
    t_draw.text((card_cx - w_tag // 2, y_tag), tag_text, font=f_tag, fill=c_dim)

    # Step 6: Downsample to standard web resolution (1024 x 1280 or original 819 x 1024)
    print("Step 6: Saving web assets...")
    canvas_rgb = canvas_hq.convert("RGB")
    
    # Save master high-resolution
    canvas_rgb.save(out_png, "PNG", quality=98)
    
    # Save web resolution (1024 x 1280) for web
    final_web = canvas_rgb.resize((1024, 1280), Image.Resampling.LANCZOS)
    final_web.save(out_public_png, "PNG", quality=95)
    final_web.save(out_public_webp, "WEBP", quality=92)
    
    print(f"Surreal creative generated successfully!\nMaster: {out_png}\nPublic PNG: {out_public_png}\nPublic WEBP: {out_public_webp}")

if __name__ == "__main__":
    make_surreal_creative()
