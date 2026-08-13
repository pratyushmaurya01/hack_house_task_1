import os
import requests
import uuid
from PIL import Image, ImageDraw, ImageFont, ExifTags
import pillow_heif

pillow_heif.register_heif_opener()

BASE_DIR = os.path.dirname(__file__)
FONTS_DIR = os.path.join(BASE_DIR, "fonts")
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
TEMPLATE_PATH = os.path.join(ASSETS_DIR, "template.png")

os.makedirs(FONTS_DIR, exist_ok=True)

FONTS = {
    "Montserrat-Black": "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat-Black.ttf",
    "Montserrat-Bold": "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat-Bold.ttf",
    "Montserrat-Medium": "https://github.com/google/fonts/raw/main/ofl/montserrat/Montserrat-Medium.ttf",
    "IBMPlexMono-Medium": "https://github.com/google/fonts/raw/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf",
}

def get_font(name, size):
    path = os.path.join(FONTS_DIR, f"{name}.ttf")
    if not os.path.exists(path):
        url = FONTS.get(name)
        if url:
            try:
                r = requests.get(url, timeout=10)
                with open(path, "wb") as f:
                    f.write(r.content)
            except:
                pass
    try:
        return ImageFont.truetype(path, size)
    except IOError:
        return ImageFont.load_default()

def fix_orientation(img):
    try:
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break
        exif = img._getexif()
        if exif is not None:
            orientation = exif.get(orientation)
            if orientation == 3: img = img.rotate(180, expand=True)
            elif orientation == 6: img = img.rotate(270, expand=True)
            elif orientation == 8: img = img.rotate(90, expand=True)
    except:
        pass
    return img

def crop_center_square(img):
    w, h = img.size
    min_dim = min(w, h)
    return img.crop(((w - min_dim)//2, (h - min_dim)//2, (w + min_dim)//2, (h + min_dim)//2))

def get_builder_title(stack):
    stack = stack.lower()
    if "front" in stack or "ui" in stack or "react" in stack: return "PIXEL ARCHITECT"
    if "back" in stack or "api" in stack or "node" in stack or "python" in stack: return "API ALCHEMIST"
    if "ai" in stack or "ml" in stack or "data" in stack: return "MODEL WHISPERER"
    if "design" in stack or "figma" in stack: return "INTERFACE ALCHEMIST"
    if "full" in stack: return "STACK SHIFTER"
    if "devops" in stack or "cloud" in stack: return "INFRASTRUCTURE WIZARD"
    if "sec" in stack or "cyber" in stack: return "BYTE GUARDIAN"
    if "student" in stack: return "NEXT-GEN BUILDER"
    if "found" in stack or "prod" in stack: return "IDEA ENGINEER"
    return "VISIONARY BUILDER"

def get_stack_text(stack, optional_text):
    s = stack.upper()
    if "FRONTEND" in s: return "REACT • TAILWINDCSS • TYPESCRIPT • NEXT.JS"
    if "BACKEND" in s: return "PYTHON • FASTAPI • POSTGRES • DOCKER"
    if "FULL STACK" in s: return "REACT • NODE.JS • TYPESCRIPT • SQL"
    if "AI" in s: return "PYTHON • PYTORCH • LLMS • LANGCHAIN"
    if "DESIGNER" in s: return "FIGMA • UI/UX • PROTOTYPING • WIREFRAMING"
    if optional_text: return optional_text.upper()
    return "HTML • CSS • JAVASCRIPT • GIT"

def generate_card(photo_path: str, name: str, stack: str, optional_text: str, output_dir: str):
    try:
        user_img = Image.open(photo_path).convert("RGBA")
    except Exception as e:
        raise ValueError(f"Could not read image: {str(e)}")
        
    # Load Transparent Template
    TEMPLATE_TRANS_PATH = os.path.join(ASSETS_DIR, "template_transparent.png")
    if not os.path.exists(TEMPLATE_TRANS_PATH):
        raise ValueError("Transparent template image is missing.")
    template = Image.open(TEMPLATE_TRANS_PATH).convert("RGBA")
    
    # Create a blank canvas to hold the photo at the bottom layer
    canvas = Image.new("RGBA", template.size, (0, 0, 0, 0))
    
    # Process Photo
    user_img = fix_orientation(user_img)
    user_img = crop_center_square(user_img)
    
    box_size = 572
    user_img = user_img.resize((box_size, box_size), Image.Resampling.LANCZOS)
    
    # Rounded corners for photo (to prevent corners sticking out)
    mask = Image.new("L", (box_size, box_size), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle((0, 0, box_size, box_size), radius=36, fill=255)
    
    user_photo = Image.new("RGBA", (box_size, box_size), (0, 0, 0, 0))
    user_photo.paste(user_img, (0, 0), mask=mask)
    
    # Paste photo onto the BLANK CANVAS first (Bottom Layer)
    box_x = 562
    box_y = 515
    canvas.paste(user_photo, (box_x, box_y), user_photo)
    
    # Paste the transparent TEMPLATE over the photo (Top Layer)
    canvas.paste(template, (0, 0), template)
    
    # Now draw all text on top of this final canvas
    draw = ImageDraw.Draw(canvas)
    
    # Fonts
    font_name = get_font("Montserrat-Black", 110)
    font_role = get_font("IBMPlexMono-Medium", 42)
    font_callsign = get_font("Montserrat-Bold", 46)
    font_stack = get_font("IBMPlexMono-Medium", 32)
    
    center_x = template.width // 2
    
    # Name
    display_name = name.upper()
    draw.text((center_x, 1220), display_name, font=font_name, fill="#FFFFFF", anchor="mm")
    
    # Role
    role_text = f"Role: {stack.upper()}"
    draw.text((center_x, 1340), role_text, font=font_role, fill="#e2e8f0", anchor="mm")
    
    # Call Sign (Pink Pill)
    call_sign = get_builder_title(stack)
    call_sign_prefix = "Call Sign: "
    
    prefix_bbox = draw.textbbox((0,0), call_sign_prefix, font=font_role)
    pill_bbox = draw.textbbox((0,0), call_sign, font=font_callsign)
    
    prefix_w = prefix_bbox[2] - prefix_bbox[0]
    pill_w = pill_bbox[2] - pill_bbox[0] + 80
    
    total_w = prefix_w + 20 + pill_w
    start_x = center_x - (total_w // 2)
    
    draw.text((start_x, 1440), call_sign_prefix, font=font_role, fill="#e2e8f0", anchor="lm")
    
    pill_x = start_x + prefix_w + 20
    pill_y = 1440 - 45
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + 90], radius=45, fill="#E91E63")
    draw.text((pill_x + (pill_w//2), 1440), call_sign, font=font_callsign, fill="#FFFFFF", anchor="mm")
    
    # Stack string
    stack_string = get_stack_text(stack, optional_text)
    draw.text((center_x, 1580), stack_string, font=font_stack, fill="#f5c842", anchor="mm")
    
    # Save
    card_id = str(uuid.uuid4())
    safe_name = "".join(c for c in name.lower().replace(" ", "-") if c.isalnum() or c == "-")
    filename = f"hhgoa26-{safe_name}-{card_id[:8]}.png"
    filepath = os.path.join(output_dir, filename)
    
    canvas.save(filepath, "PNG")
    
    return card_id, filename
