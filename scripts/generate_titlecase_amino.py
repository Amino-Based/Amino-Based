import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def generate_perfect_titlecase_amino():
    font_size = 420
    font = ImageFont.truetype('C:/Windows/Fonts/segoeuib.ttf', font_size)
    
    # Text
    text = "Amino"
    
    # 1. Measure and position each glyph
    base_w = 2800
    base_h = 900
    
    canvas_txt = Image.new('L', (base_w, base_h), 0)
    draw = ImageDraw.Draw(canvas_txt)
    
    letter_spacing = 35
    x = 120
    y_draw = 150
    
    glyph_info = []
    for ch in text:
        bbox = font.getbbox(ch)
        w = bbox[2] - bbox[0]
        # render single glyph on temporary canvas to get exact mask
        tmp = Image.new('L', (base_w, base_h), 0)
        tmp_draw = ImageDraw.Draw(tmp)
        tmp_draw.text((x, y_draw), ch, font=font, fill=255)
        arr = np.array(tmp)
        draw.text((x, y_draw), ch, font=font, fill=255)
        
        y_idxs, x_idxs = np.where(arr > 10)
        glyph_info.append({
            'char': ch,
            'x': x,
            'x_min': x_idxs.min(),
            'x_max': x_idxs.max(),
            'y_min': y_idxs.min(),
            'y_max': y_idxs.max(),
            'mask': arr
        })
        x += w + letter_spacing
        
    full_txt = np.array(canvas_txt)
    y_idxs, x_idxs = np.where(full_txt > 10)
    
    total_x_min, total_x_max = x_idxs.min(), x_idxs.max()
    y_cap_top = glyph_info[0]['y_min']  # Top of 'A'
    y_baseline = max(g['y_max'] for g in glyph_info) # Baseline
    y_x_top = glyph_info[1]['y_min']    # Top of 'm'
    
    letter_h = y_baseline - y_x_top
    total_h = y_baseline - y_cap_top
    
    print(f"Cap top: {y_cap_top}, X-height top: {y_x_top}, Baseline: {y_baseline}")
    print(f"Letter x-height: {letter_h}, Total height: {total_h}")
    
    # Where does the bottom cut happen?
    # In Cilo: bottom is sliced halfway through the bottom curve of 'o' and baseline!
    # About 72% down from x_height_top to baseline
    cut_y = y_x_top + int(letter_h * 0.74)
    print(f"Cut line at y = {cut_y} (slicing {y_baseline - cut_y}px above baseline)")
    
    # Where does the downward vertical streak start?
    # For 'A': starts below the crossbar (around y_x_top + 40)
    # For 'm', 'n', 'o': starts around 42% down the x-height
    # For 'i': dot is completely crisp! streak only starts on the lower half of the stem!
    
    streak_src = np.zeros_like(full_txt, dtype=np.float32)
    
    for g in glyph_info:
        ch = g['char']
        m = g['mask'].astype(np.float32) / 255.0
        
        if ch == 'A':
            split = y_x_top + int(letter_h * 0.35)
        elif ch == 'i':
            # find dot vs stem gap in 'i'
            # stem top is around y_x_top
            split = y_x_top + int(letter_h * 0.40)
        else:
            split = y_x_top + int(letter_h * 0.42)
            
        weight = np.zeros(base_h, dtype=np.float32)
        for y in range(base_h):
            if y < split - 15:
                weight[y] = 0.0
            elif y > split + 20:
                weight[y] = 1.0
            else:
                weight[y] = (y - (split - 15)) / 35.0
                
        # For 'i', explicitly zero out anything in the dot region!
        if ch == 'i':
            dot_bottom = y_x_top - 10
            for y in range(dot_bottom):
                weight[y] = 0.0
                
        streak_src += m * weight[:, None]
        
    streak_src = np.clip(streak_src, 0.0, 1.0)
    
    # Downward exponential decay vertical accumulation (smooth motion light smear)
    decay = 0.985
    trail = np.zeros_like(streak_src)
    accum = np.zeros(base_w, dtype=np.float32)
    
    for y in range(y_cap_top, cut_y + 120):
        if y >= base_h:
            break
        accum = accum * decay + streak_src[y, :] * 0.12
        trail[y, :] = accum
        
    # Apply subtle horizontal Gaussian blur to trail
    trail_soft = cv2.GaussianBlur(trail, (25, 1), sigmaX=8, sigmaY=0)
    trail_soft = np.clip(trail_soft * 3.3, 0, 1.0) * 255.0
    
    # Composite: Top part pure sharp text, lower part blended with blur
    composite = np.maximum(full_txt.astype(np.float32), trail_soft)
    
    # Slice at cut_y!
    y_crop_start = max(0, y_cap_top - 20)
    y_crop_end = cut_y
    
    cropped = composite[y_crop_start:y_crop_end, total_x_min - 40 : total_x_max + 40]
    
    h_out, w_out = cropped.shape
    out_rgba = np.zeros((h_out, w_out, 4), dtype=np.uint8)
    out_rgba[:, :, 0] = 255
    out_rgba[:, :, 1] = 255
    out_rgba[:, :, 2] = 255
    out_rgba[:, :, 3] = np.clip(cropped, 0, 255).astype(np.uint8)
    
    # Save both titlecase assets
    out_path_title = 'public/assets/footer_halfway_cut_Amino.png'
    Image.fromarray(out_rgba).save(out_path_title, format='PNG')
    print(f"Saved {out_path_title}: {w_out}x{h_out}")
    
    # Save preview card
    card_bg = np.full((h_out + 60, w_out + 80, 3), 13, dtype=np.uint8)
    alpha = out_rgba[:, :, 3].astype(float) / 255.0
    for c in range(3):
        card_bg[20:20+h_out, 40:40+w_out, c] = (
            card_bg[20:20+h_out, 40:40+w_out, c] * (1.0 - alpha) + 255 * alpha
        ).astype(np.uint8)
        
    preview_path = 'public/assets/preview_halfway_cut_Amino.png'
    Image.fromarray(card_bg).save(preview_path)
    print(f"Saved preview: {preview_path}")

if __name__ == '__main__':
    generate_perfect_titlecase_amino()
