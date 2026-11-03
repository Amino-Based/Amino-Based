import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def generate_halfway_cut_amino():
    # Large scale for pristine high-DPI rendering
    font_size = 380
    font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', font_size)
    
    # 1. Measure each glyph so we can space them cleanly like reference
    glyphs = ['a', 'm', 'i', 'n', 'o']
    glyph_imgs = []
    
    # Target canvas
    base_w = 2400
    base_h = 700
    
    # Render with custom tracking
    canvas_txt = Image.new('L', (base_w, base_h), 0)
    draw = ImageDraw.Draw(canvas_txt)
    
    # Let's space letters gracefully
    x = 100
    letter_spacing = 35 # generous tracking like modern brand wordmarks
    
    positions = []
    for ch in glyphs:
        # get bbox for this char
        bbox = font.getbbox(ch)
        w = bbox[2] - bbox[0]
        positions.append((ch, x, 80))
        draw.text((x, 80), ch, font=font, fill=255)
        x += w + letter_spacing
        
    total_w = x - letter_spacing + 100
    
    # Crop canvas horizontally to exact content with margin
    txt_arr = np.array(canvas_txt)
    y_idxs, x_idxs = np.where(txt_arr > 5)
    
    x_min, x_max = x_idxs.min(), x_idxs.max()
    y_top = y_idxs.min()  # dot of 'i' top
    
    # Find x-height top (top of 'a')
    # Let's find top of 'a':
    a_box = font.getbbox('a')
    # The baseline is font ascender
    # Let's measure the x-height baseline
    # All letters except dot of i share top around y_top + dot_gap
    # Let's find the y-range of letters 'a', 'm', 'n', 'o'
    crop_x_height = txt_arr[:, x_min:x_min+200]
    y_a = np.where(crop_x_height > 10)[0]
    x_height_top = y_a.min()
    full_baseline = y_a.max()
    letter_h = full_baseline - x_height_top
    
    print(f"Metrics: y_top={y_top}, x_height_top={x_height_top}, baseline={full_baseline}, letter_h={letter_h}")
    
    # In reference Cilo:
    # 1. Top ~45% of letter is 100% crisp, sharp vector edges.
    # 2. Downward vertical streaks begin at ~45% of letter height.
    # 3. Bottom of letters is cut off at ~74% of letter height.
    
    split_y = x_height_top + int(letter_h * 0.44)
    cut_y = x_height_top + int(letter_h * 0.74) # Halfway cut line!
    
    print(f"Split blur starts at y={split_y}, Cut line is at y={cut_y}")
    
    # Prepare source for vertical downward streaks
    # We only take pixels below split_y so top remains 100% vector-crisp
    # Also for 'i', we make sure dot is NOT streaked down into the stem!
    streak_src = np.zeros_like(txt_arr, dtype=np.float32)
    
    # For pixels below split_y, take txt_arr
    mask_lower = np.zeros_like(txt_arr, dtype=np.float32)
    # Smooth transition from split_y-15 to split_y+20
    for y in range(base_h):
        if y < split_y - 15:
            weight = 0.0
        elif y > split_y + 20:
            weight = 1.0
        else:
            weight = (y - (split_y - 15)) / 35.0
        mask_lower[y, :] = weight
        
    streak_src = (txt_arr.astype(np.float32) / 255.0) * mask_lower
    
    # Generate vertical motion blur (downward smear)
    # The reference has downward vertical motion trails:
    # Strong vertical kernel, subtle horizontal spread
    # We do a downward exponential decay / accumulation
    trail = np.zeros_like(streak_src)
    decay = 0.985  # slow decay so it maintains strong brightness at the cut line
    
    # Directional downward sweep
    accum = np.zeros(base_w, dtype=np.float32)
    for y in range(split_y - 20, cut_y + 100):
        if y >= base_h:
            break
        accum = accum * decay + streak_src[y, :] * 0.12
        trail[y, :] = accum
        
    # Apply subtle horizontal Gaussian blur to trail so it softens like light
    trail_soft = cv2.GaussianBlur(trail, (25, 1), sigmaX=8, sigmaY=0)
    
    # Scale trail intensity so it matches reference
    trail_soft = np.clip(trail_soft * 3.2, 0, 1.0) * 255.0
    
    # Now composite:
    # Top part: pure txt_arr
    # Lower part: max of txt_arr and trail_soft
    composite = np.maximum(txt_arr.astype(np.float32), trail_soft)
    
    # Now slice at cut_y!
    # The canvas height is from y_top - 15 to cut_y
    y_crop_start = max(0, y_top - 20)
    y_crop_end = cut_y
    
    cropped_composite = composite[y_crop_start:y_crop_end, x_min-40:x_max+40]
    
    # Build 4-channel RGBA
    h_out, w_out = cropped_composite.shape
    out_rgba = np.zeros((h_out, w_out, 4), dtype=np.uint8)
    out_rgba[:, :, 0] = 255
    out_rgba[:, :, 1] = 255
    out_rgba[:, :, 2] = 255
    out_rgba[:, :, 3] = np.clip(cropped_composite, 0, 255).astype(np.uint8)
    
    # Save the asset
    out_path = 'public/assets/footer_halfway_cut_amino.png'
    Image.fromarray(out_rgba).save(out_path, format='PNG')
    print(f"Saved {out_path} with size {w_out}x{h_out}")
    
    # Create preview on dark background and on gray background outside card
    card_bg = np.full((h_out + 60, w_out + 80, 3), 13, dtype=np.uint8) # #0D0D0D
    alpha = out_rgba[:, :, 3].astype(float) / 255.0
    
    # Place at bottom of card (docked right at bottom edge)
    y_card_bottom = h_out
    for c in range(3):
        card_bg[20:20+h_out, 40:40+w_out, c] = (
            card_bg[20:20+h_out, 40:40+w_out, c] * (1.0 - alpha) + 255 * alpha
        ).astype(np.uint8)
        
    preview_path = 'public/assets/preview_halfway_cut_amino.png'
    Image.fromarray(card_bg).save(preview_path)
    print(f"Saved preview: {preview_path}")

if __name__ == '__main__':
    generate_halfway_cut_amino()

