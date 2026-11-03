import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def build_creative():
    W, H = 2400, 2400
    
    # Paths
    vial_path = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity\brain\d2b6008f-10fc-4e86-8225-f22a7908262b\.user_uploaded\media_1793210368198_a7919fc2.png"
    tex_top_path = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity\brain\d2b6008f-10fc-4e86-8225-f22a7908262b\clinical_liquid_droplets_macro_1793210684263.jpg"
    tex_left_path = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity\brain\d2b6008f-10fc-4e86-8225-f22a7908262b\peptide_molecular_macro_1793210689489.jpg"
    tex_right_path = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity\brain\d2b6008f-10fc-4e86-8225-f22a7908262b\biotech_water_caustics_macro_bleed_1793210712942.jpg"
    
    output_dir = r"C:\Users\ADIL RAZA KHAN\.gemini\antigravity\brain\d2b6008f-10fc-4e86-8225-f22a7908262b"
    out_2400 = os.path.join(output_dir, "semaglutide_creative_hq_2400.png")
    out_1200 = os.path.join(output_dir, "semaglutide_creative_web_1200.png")
    out_public = r"c:\Users\ADIL RAZA KHAN\OneDrive\Desktop\Amino-Based\public\semaglutide-creative.png"

    print("Step 1: Creating studio lighting gradient background...")
    # Soft, clinical white-to-light-cyan background
    bg = Image.new("RGBA", (W, H), (255, 255, 255, 255))
    
    cx_light = W * 0.50
    cy_light = H * 0.44
    max_d = math.hypot(cx_light, cy_light) * 1.05
    
    y_grid, x_grid = np.ogrid[:H, :W]
    dist = np.sqrt((x_grid - cx_light)**2 + (y_grid - cy_light)**2) / max_d
    dist = np.clip(dist, 0.0, 1.0)
    
    # Pure white (#FFFFFF) at center-top -> delicate ice blue / slate (#EBF3F9) at corners
    r = (255 - dist * 16).astype(np.uint8)
    g = (255 - dist * 10).astype(np.uint8)
    b = (255 - dist * 4).astype(np.uint8)
    
    # Soft vertical gradient enhancement
    y_fac = (y_grid / float(H)).astype(np.float32)
    r = np.clip(r.astype(np.float32) - y_fac * 5, 0, 255).astype(np.uint8)
    g = np.clip(g.astype(np.float32) - y_fac * 4, 0, 255).astype(np.uint8)
    b = np.clip(b.astype(np.float32) - y_fac * 2, 0, 255).astype(np.uint8)
    
    bg_arr = np.dstack((r, g, b, np.full((H, W), 255, dtype=np.uint8)))
    canvas = Image.fromarray(bg_arr, mode="RGBA")
    
    # Step 2: Segmented Arc Geometry
    print("Step 2: Calculating segmented arc geometry...")
    cx = W // 2           # 1200
    cy = int(H * 0.485)    # 1164
    r_out = int(W * 0.385) # 924 px
    r_in = int(W * 0.260)  # 624 px
    thickness = r_out - r_in # 300 px
    
    print(f"Arc geometry: center=({cx}, {cy}), r_out={r_out}, r_in={r_in}, thickness={thickness}")

    def get_arc_mask(start_deg, end_deg, r_inner, r_outer):
        mask = Image.new("L", (W, H), 0)
        draw = ImageDraw.Draw(mask)
        steps = max(60, int(abs(end_deg - start_deg) * 3))
        
        pts = []
        for i in range(steps + 1):
            theta = math.radians(start_deg + (end_deg - start_deg) * (i / steps))
            pts.append((cx + r_outer * math.cos(theta), cy + r_outer * math.sin(theta)))
            
        for i in range(steps + 1):
            theta = math.radians(end_deg - (end_deg - start_deg) * (i / steps))
            pts.append((cx + r_inner * math.cos(theta), cy + r_inner * math.sin(theta)))
            
        draw.polygon(pts, fill=255)
        return mask

    # 3 Segments:
    # Top: centered at 270 deg (spans 220 to 320 -> 100 deg)
    # Left: spans 140 to 214 -> 74 deg
    # Right: spans 326 to 400 (40 deg) -> 74 deg
    # Dividers: 6 degrees gap between segments
    # Bottom opening: 40 deg to 140 deg (100 degrees open at bottom)
    segments = [
        {
            "name": "left",
            "start": 140.0,
            "end": 214.0,
            "tex_path": tex_left_path,
            "zoom": 1.25,
            "center_angle": 177.0,
        },
        {
            "name": "top",
            "start": 220.0,
            "end": 320.0,
            "tex_path": tex_top_path,
            "zoom": 1.15,
            "center_angle": 270.0,
        },
        {
            "name": "right",
            "start": 326.0,
            "end": 400.0,
            "tex_path": tex_right_path,
            "zoom": 1.25,
            "center_angle": 363.0,
        }
    ]

    # Pre-render Ring Soft Drop Shadow for realistic depth
    print("Step 3: Rendering floating halo ambient shadow...")
    ring_shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(ring_shadow_layer)
    for seg in segments:
        m = get_arc_mask(seg['start'], seg['end'], r_in, r_out)
        # Paste shadow color
        shadow_patch = Image.new("RGBA", (W, H), (15, 35, 65, 45))
        ring_shadow_layer.paste(shadow_patch, (0, 0), m)
        
    ring_shadow_layer = ring_shadow_layer.filter(ImageFilter.GaussianBlur(radius=28))
    # Offset shadow slightly down-right
    shadow_offset = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow_offset.paste(ring_shadow_layer, (10, 16))
    canvas = Image.alpha_composite(canvas, shadow_offset)

    # Step 4: Render Segments with Textures & Glass Bevel
    print("Step 4: Compositing high-detail macro textures into arc segments...")
    for seg in segments:
        mask = get_arc_mask(seg['start'], seg['end'], r_in, r_out)
        tex = Image.open(seg['tex_path']).convert("RGBA")
        
        tw, th = tex.size
        # Calculate target position for sector center
        theta_c = math.radians(seg['center_angle'])
        r_mid = (r_out + r_in) / 2
        sec_cx = cx + r_mid * math.cos(theta_c)
        sec_cy = cy + r_mid * math.sin(theta_c)
        
        # Scale texture so it covers the segment area richly
        scale = max(W / tw, H / th) * seg['zoom']
        nw, nh = int(tw * scale), int(th * scale)
        tex_resized = tex.resize((nw, nh), Image.Resampling.LANCZOS)
        
        # Center texture on the segment's optical center
        crop_x = int(sec_cx - nw / 2)
        crop_y = int(sec_cy - nh / 2)
        
        # Bounding canvas for texture placement
        tex_canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        tex_canvas.paste(tex_resized, (crop_x, crop_y))
        
        # Add delicate inner rim glow to make texture look encapsulated
        canvas.paste(tex_canvas, (0, 0), mask)

    # Step 5: Clean Bevel Strokes and Dividers
    print("Step 5: Applying precision borders & divider seams...")
    stroke_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    stroke_draw = ImageDraw.Draw(stroke_layer)
    
    for seg in segments:
        steps = max(60, int(abs(seg['end'] - seg['start']) * 3))
        outer_pts = []
        inner_pts = []
        for i in range(steps + 1):
            theta = math.radians(seg['start'] + (seg['end'] - seg['start']) * (i / steps))
            outer_pts.append((cx + r_out * math.cos(theta), cy + r_out * math.sin(theta)))
            inner_pts.append((cx + r_in * math.cos(theta), cy + r_in * math.sin(theta)))
            
        # Outer rim highlight
        for i in range(len(outer_pts) - 1):
            stroke_draw.line([outer_pts[i], outer_pts[i+1]], fill=(255, 255, 255, 200), width=4)
            stroke_draw.line([inner_pts[i], inner_pts[i+1]], fill=(255, 255, 255, 200), width=4)
            
        # Radial ends
        stroke_draw.line([inner_pts[0], outer_pts[0]], fill=(255, 255, 255, 240), width=4)
        stroke_draw.line([inner_pts[-1], outer_pts[-1]], fill=(255, 255, 255, 240), width=4)
        
    canvas = Image.alpha_composite(canvas, stroke_layer)

    # Step 6: Vial Sizing, Shadows, and Placement
    print("Step 6: Positioning product vial with studio shadows...")
    vial_img = Image.open(vial_path).convert("RGBA")
    vw, vh = vial_img.size
    
    # Balanced proportion: Vial height = 1260 px, width = 839 px
    target_vh = 1260
    target_vw = int(vw * (target_vh / vh)) # 839 px
    vial_scaled = vial_img.resize((target_vw, target_vh), Image.Resampling.LANCZOS)
    
    vx = cx - target_vw // 2
    # Vertically positioned so the vial cap overlaps inner rim top gracefully,
    # and the base rests naturally in the lower opening
    vy = cy - int(target_vh * 0.47) # vy approx 570, base approx 1830
    vial_base_y = vy + target_vh - 40
    
    # Realistic 3-layer floor shadow
    vial_shadow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vial_shadow_draw = ImageDraw.Draw(vial_shadow_layer)
    
    # Layer A: Tight, sharp contact shadow at direct glass-table contact
    cw = int(target_vw * 0.58)
    ch = 44
    vial_shadow_draw.ellipse(
        [cx - cw // 2, vial_base_y - ch // 2, cx + cw // 2, vial_base_y + ch // 2],
        fill=(10, 22, 38, 175)
    )
    
    # Layer B: Mid-occlusion shadow
    mw = int(target_vw * 0.76)
    mh = 85
    vial_shadow_draw.ellipse(
        [cx - mw // 2 + 8, vial_base_y - mh // 2 + 10, cx + mw // 2 + 8, vial_base_y + mh // 2 + 10],
        fill=(18, 38, 62, 90)
    )
    
    # Layer C: Diffuse soft ambient falloff spreading subtly to the right (key light from upper left)
    aw = int(target_vw * 0.98)
    ah = 140
    vial_shadow_draw.ellipse(
        [cx - aw // 2 + 20, vial_base_y - ah // 2 + 20, cx + aw // 2 + 20, vial_base_y + ah // 2 + 20],
        fill=(25, 48, 78, 45)
    )
    
    vial_shadow_layer = vial_shadow_layer.filter(ImageFilter.GaussianBlur(radius=22))
    canvas = Image.alpha_composite(canvas, vial_shadow_layer)
    
    # Paste the crisp alpha-channel vial in the center
    canvas.alpha_composite(vial_scaled, (vx, vy))

    # Step 7: Typography & Clinical Feature Blocks
    print("Step 7: Rendering crisp typography and callout copy...")
    text_draw = ImageDraw.Draw(canvas)
    
    font_bold_path = "C:/Windows/Fonts/segoeuib.ttf"
    font_reg_path = "C:/Windows/Fonts/segoeui.ttf"
    font_sb_path = "C:/Windows/Fonts/seguisb.ttf"
    
    # Sizing for 2400x2400 canvas
    font_top_title = ImageFont.truetype(font_bold_path, 52)
    font_top_sub = ImageFont.truetype(font_reg_path, 32)
    
    font_side_title = ImageFont.truetype(font_bold_path, 48)
    font_side_sub = ImageFont.truetype(font_reg_path, 30)
    
    c_title = (12, 23, 38, 255)      # Deep clinical navy/charcoal
    c_sub = (75, 90, 110, 255)       # Balanced slate grey
    
    # --- Top Callout (Centered directly above the arc) ---
    top_t = "Purity Verified ≥ 99%"
    top_s = "Independently verified for absolute research integrity"
    
    tb_t = text_draw.textbbox((0, 0), top_t, font=font_top_title)
    w_top_t = tb_t[2] - tb_t[0]
    tb_s = text_draw.textbbox((0, 0), top_s, font=font_top_sub)
    w_top_s = tb_s[2] - tb_s[0]
    
    y_top = int(H * 0.055) # approx y = 132
    text_draw.text((cx - w_top_t // 2, y_top), top_t, font=font_top_title, fill=c_title)
    text_draw.text((cx - w_top_s // 2, y_top + 68), top_s, font=font_top_sub, fill=c_sub)
    
    # --- Bottom-Left Callout ---
    # Left aligned, below the left sector
    left_t1 = "Lyophilized Bio-Matrix"
    left_s1 = "Preserved under vacuum for"
    left_s2 = "maximum molecular stability"
    
    x_left = int(W * 0.075)  # 180 px
    y_left = int(H * 0.815)  # 1956 px
    
    text_draw.text((x_left, y_left), left_t1, font=font_side_title, fill=c_title)
    text_draw.text((x_left, y_left + 64), left_s1, font=font_side_sub, fill=c_sub)
    text_draw.text((x_left, y_left + 106), left_s2, font=font_side_sub, fill=c_sub)
    
    # --- Bottom-Right Callout ---
    # Left-aligned in bottom-right corner, below the right sector (matching reference!)
    right_t1 = "GLP-1 Receptor Agonist"
    right_s1 = "High-affinity targeted sequence"
    right_s2 = "for precision metabolic research"
    
    x_right = int(W * 0.590) # 1416 px
    y_right = int(H * 0.815) # 1956 px
    
    text_draw.text((x_right, y_right), right_t1, font=font_side_title, fill=c_title)
    text_draw.text((x_right, y_right + 64), right_s1, font=font_side_sub, fill=c_sub)
    text_draw.text((x_right, y_right + 106), right_s2, font=font_side_sub, fill=c_sub)

    # Step 8: Save Outputs
    print("Step 8: Saving pristine 2400x2400 HQ and 1200x1200 web versions...")
    canvas_rgb = canvas.convert("RGB")
    canvas_rgb.save(out_2400, "PNG", quality=98)
    
    # Downscale with Lanczos for subpixel antialiasing
    canvas_1200 = canvas_rgb.resize((1200, 1200), Image.Resampling.LANCZOS)
    canvas_1200.save(out_1200, "PNG", quality=95)
    
    # Also save to public for website
    canvas_1200.save(out_public, "PNG", quality=95)
    
    # Also save a webp version for high performance Next.js web loading
    out_webp = r"c:\Users\ADIL RAZA KHAN\OneDrive\Desktop\Amino-Based\public\semaglutide-creative.webp"
    canvas_1200.save(out_webp, "WEBP", quality=92)
    
    print("All creatives saved successfully!")
    print(f"- 2400px HQ: {out_2400}")
    print(f"- 1200px Web: {out_1200}")
    print(f"- Public PNG: {out_public}")
    print(f"- Public WEBP: {out_webp}")

if __name__ == "__main__":
    build_creative()
