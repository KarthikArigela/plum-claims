import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import random

class DocumentRuiner:
    
    @staticmethod
    def simulate_bad_phone_photo(image_path, output_path, blur_intensity=5, darken_factor=0.6):
        """
        Simulates a poorly lit, out-of-focus mobile phone picture of a bill.
        Perfect for TC002 (Unreadable Document).
        """
        # 1. Load image with OpenCV
        img = cv2.imread(image_path)
        
        # 2. Apply Gaussian Blur (simulating out of focus)
        # blur_intensity must be an odd number
        blur_val = blur_intensity if blur_intensity % 2 != 0 else blur_intensity + 1
        blurred = cv2.GaussianBlur(img, (blur_val, blur_val), 0)
        
        # 3. Add camera noise (simulating high ISO in low light)
        row, col, ch = blurred.shape
        gauss = np.random.normal(0, 15, (row, col, ch))
        gauss = gauss.reshape(row, col, ch)
        noisy = blurred + gauss
        noisy = np.clip(noisy, 0, 255).astype(np.uint8)
        
        # 4. Convert to PIL to drop brightness and contrast
        pil_img = Image.fromarray(cv2.cvtColor(noisy, cv2.COLOR_BGR2RGB))
        
        # Darken the image
        enhancer = ImageEnhance.Brightness(pil_img)
        darkened = enhancer.enhance(darken_factor)
        
        # Lower contrast (washed out look)
        enhancer = ImageEnhance.Contrast(darkened)
        final_img = enhancer.enhance(0.7)
        
        # 5. Apply a slight rotation (phone wasn't held straight)
        final_img = final_img.rotate(random.uniform(-2.0, 2.0), expand=True, fillcolor=(220, 220, 220))
        
        final_img.save(output_path)
        print(f"Saved bad phone photo to: {output_path}")

    @staticmethod
    def add_rubber_stamp(image_path, output_path, stamp_text, position_x, position_y):
        """
        Overlays a semi-transparent, rotated rubber stamp.
        Perfect for TC005 (Occluding the Doctor's Reg No).
        """
        # Load the base image
        base = Image.open(image_path).convert("RGBA")
        
        # Create a blank transparent layer for the stamp
        stamp_layer = Image.new("RGBA", base.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(stamp_layer)
        
        # Use a default font (or load a specific one if you download a TTF)
        # font = ImageFont.truetype("arial.ttf", 40)
        font = ImageFont.load_default() 
        
        # Draw the stamp text (Blue ink, with some transparency - Alpha 150)
        stamp_color = (20, 40, 200, 150)
        
        # Draw a bounding box for the stamp
        draw.rectangle(
            [position_x - 10, position_y - 10, position_x + 200, position_y + 40], 
            outline=stamp_color, 
            width=3
        )
        # Draw the text
        draw.text((position_x, position_y), stamp_text, fill=stamp_color, font=font)
        
        # Rotate JUST the stamp layer to make it look quickly slapped on
        stamp_layer = stamp_layer.rotate(random.uniform(-15, 15), center=(position_x, position_y))
        
        # Composite the stamp over the base document
        final = Image.alpha_composite(base, stamp_layer)
        
        # Convert back to RGB to save as JPG
        final = final.convert("RGB")
        final.save(output_path)
        print(f"Saved stamped document to: {output_path}")

# ==========================================
# HOW TO USE IT
# ==========================================
if __name__ == "__main__":
    # First, let's create a dummy "clean" image to test on using PIL
    dummy_img = Image.new('RGB', (800, 1000), color='white')
    d = ImageDraw.Draw(dummy_img)
    d.text((50, 50), "HEALTH FIRST PHARMACY", fill='black')
    d.text((50, 100), "Paracetamol 650mg - 15 Tabs - Rs 37.50", fill='black')
    d.text((50, 150), "Reg No: GJ/56789/2014", fill='black') # Target for the stamp
    dummy_img.save("clean_baseline.jpg")

    ruiner = DocumentRuiner()

    # 1. Create the TC002 Unreadable Pharmacy Bill
    ruiner.simulate_bad_phone_photo(
        image_path="clean_baseline.jpg", 
        output_path="tc002_blurry_pharmacy_bill.jpg",
        blur_intensity=7, # Increase for more blur
        darken_factor=0.5
    )

    # 2. Create the TC005 Stamped Diabetes Prescription
    ruiner.add_rubber_stamp(
        image_path="clean_baseline.jpg",
        output_path="tc005_stamped_prescription.jpg",
        stamp_text="RECEIVED - ORIGINAL",
        position_x=45,  # Placing it directly over the Reg No text
        position_y=140
    )