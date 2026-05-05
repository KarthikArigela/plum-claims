import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import random
import os

# Plum Brand Colors
PLUM_MAIN = (43, 11, 33)       # #2b0b21
PLUM_SECONDARY = (94, 44, 77)  # #5e2c4d
PLUM_OFFWHITE = (255, 244, 235) # #fff4eb
PLUM_PINK = (255, 64, 82)      # #ff4052

class PlumStressEngine:
    def __init__(self):
        # Paths for Windows/Linux - Adjust if necessary
        self.font_path = "arial.ttf" 
        self.hand_font_path = "DancingScript-Regular.ttf" # Download this!
        
        try:
            self.f_h1 = ImageFont.truetype("arialbd.ttf", 32)
            self.f_h2 = ImageFont.truetype("arialbd.ttf", 20)
            self.f_body = ImageFont.truetype("arial.ttf", 16)
            self.f_hand = ImageFont.truetype(self.hand_font_path, 26)
            self.f_hand_small = ImageFont.truetype(self.hand_font_path, 20)
        except:
            self.f_h1 = self.f_h2 = self.f_body = self.f_hand = self.f_hand_small = ImageFont.load_default()

    def create_canvas(self):
        return Image.new('RGB', (850, 1200), color=PLUM_OFFWHITE)

    # ==========================================
    # CORE DOCUMENT GENERATORS
    # ==========================================

    def generate_lab_report(self, patient_name, tests):
        img = self.create_canvas()
        draw = ImageDraw.Draw(img)
        
        # Header
        draw.rectangle([0, 0, 850, 150], fill=PLUM_MAIN)
        draw.text((40, 40), "PRECISION DIAGNOSTICS", font=self.f_h1, fill=PLUM_OFFWHITE)
        draw.text((40, 85), "NABL ACCREDITED LAB | Reg: LAB-KA-9921", font=self.f_body, fill=PLUM_PINK)
        
        # Patient Info
        draw.text((40, 180), f"Patient: {patient_name}", font=self.f_h2, fill=PLUM_MAIN)
        draw.text((600, 180), "Date: 01-Nov-2024", font=self.f_body, fill=PLUM_MAIN)
        draw.line([40, 220, 810, 220], fill=PLUM_SECONDARY, width=2)
        
        # Table Header
        draw.text((50, 240), "TEST NAME", font=self.f_h2, fill=PLUM_SECONDARY)
        draw.text((400, 240), "RESULT", font=self.f_h2, fill=PLUM_SECONDARY)
        draw.text((600, 240), "NORMAL RANGE", font=self.f_h2, fill=PLUM_SECONDARY)
        
        y = 280
        for test, res, range_val in tests:
            draw.text((50, y), test, font=self.f_body, fill=PLUM_MAIN)
            draw.text((400, y), res, font=self.f_h2, fill=(20, 80, 20)) # Dark Green Result
            draw.text((600, y), range_val, font=self.f_body, fill=(100, 100, 100))
            y += 45
            draw.line([40, y-5, 810, y-5], fill=(220, 220, 220), width=1)
            
        return img

    def generate_dental_bill(self, patient_name, items):
        img = self.create_canvas()
        draw = ImageDraw.Draw(img)
        
        # Elegant Dental Header
        draw.rectangle([0, 0, 850, 100], fill=PLUM_SECONDARY)
        draw.text((40, 35), "SMILE CARE DENTAL", font=self.f_h1, fill=PLUM_OFFWHITE)
        
        draw.text((40, 130), f"BILLING TO: {patient_name}", font=self.f_h2, fill=PLUM_MAIN)
        
        y = 200
        total = 0
        for item, price in items:
            draw.text((50, y), item, font=self.f_body, fill=PLUM_MAIN)
            draw.text((650, y), f"Rs. {price}", font=self.f_body, fill=PLUM_MAIN)
            total += price
            y += 50
        
        draw.line([500, y, 750, y], fill=PLUM_MAIN, width=2)
        draw.text((500, y+20), "NET PAYABLE:", font=self.f_h2, fill=PLUM_PINK)
        draw.text((650, y+20), f"₹ {total}", font=self.f_h1, fill=PLUM_PINK)
        
        return img

    # ==========================================
    # THE "CRAZY" RUINER TOOLS
    # ==========================================

    def add_handwritten_correction(self, pil_img, x, y, old_val, new_val):
        """Crosses out a printed value and writes a new one by hand."""
        draw = ImageDraw.Draw(pil_img)
        # Scratch out
        draw.line([x-5, y+10, x+80, y+5], fill=(200, 0, 0), width=3)
        # New value in "handwriting"
        draw.text((x+90, y-5), f"Rs. {new_val}", font=self.f_hand, fill=(20, 20, 150))
        return pil_img

    def apply_coffee_stain(self, pil_img):
        """Adds a nasty brown alpha-blended stain."""
        stain_layer = Image.new('RGBA', pil_img.size, (0,0,0,0))
        draw = ImageDraw.Draw(stain_layer)
        # Create a random blob
        draw.ellipse([100, 100, 350, 350], fill=(139, 69, 19, 60)) # Brown alpha 60
        draw.ellipse([150, 150, 300, 300], fill=(139, 69, 19, 40)) 
        
        pil_img = pil_img.convert("RGBA")
        combined = Image.alpha_composite(pil_img, stain_layer)
        return combined.convert("RGB")

    def apply_extreme_perspective(self, pil_img):
        """Extreme skew - as if the user is holding the paper at a 45 degree angle."""
        cv_img = np.array(pil_img)
        h, w = cv_img.shape[:2]
        src = np.float32([[0,0], [w,0], [0,h], [w,h]])
        # Push top-right and bottom-right way in
        dst = np.float32([[0,0], [w*0.8, h*0.2], [0,h], [w*0.7, h*0.9]])
        M = cv2.getPerspectiveTransform(src, dst)
        dst_img = cv2.warpPerspective(cv_img, M, (w, h), borderValue=PLUM_MAIN)
        return Image.fromarray(dst_img)

    def apply_lighting_shadow(self, pil_img):
        """Simulates a phone/head shadow in a dark room."""
        cv_img = np.array(pil_img).astype(float)
        h, w = cv_img.shape[:2]
        
        # Create a gradient mask
        mask = np.ones((h, w), dtype=float)
        # Darken the bottom-left corner significantly
        for i in range(h):
            mask[i, :] *= (i / h) * 0.8 + 0.2
            
        mask = cv2.GaussianBlur(mask, (201, 201), 0)
        for c in range(3):
            cv_img[:,:,c] *= mask
            
        return Image.fromarray(np.clip(cv_img, 0, 255).astype(np.uint8))

# ==========================================
# TEST CASE SUITE
# ==========================================
if __name__ == "__main__":
    engine = PlumStressEngine()
    if not os.path.exists("stress_test"): os.makedirs("stress_test")

    # 1. TC003 - The "Identity Fraud" (Mismatch)
    # Prescription is for Rajesh, but this Bill is for Arjun Mehta
    mismatch_bill = engine.generate_dental_bill("ARJUN MEHTA", [("Consultation", 1000)])
    mismatch_bill.save("stress_test/tc003_mismatched_name_bill.jpg")

    # 2. TC006 - Mixed Dental (Covered + Excluded + Handwritten Correction)
    dental_bill = engine.generate_dental_bill("Priya Singh", [
        ("Root Canal Treatment", 8000),
        ("Cosmetic Teeth Whitening", 4000)
    ])
    # Clerk corrected the price by hand!
    dental_bill = engine.add_handwritten_correction(dental_bill, 650, 250, 4000, 4500)
    dental_bill.save("stress_test/tc006_dental_mixed_corrected.jpg")

    # 3. TC011 - Component Failure (Extreme Perspective + Shadow + Stain)
    lab_tests = [
        ("Hemoglobin", "13.2", "13-17 g/dL"),
        ("WBC Count", "9800", "4500-11000"),
        ("Platelets", "1.8L", "1.5L-4.5L")
    ]
    crazy_doc = engine.generate_lab_report("Kavita Nair", lab_tests)
    crazy_doc = engine.apply_coffee_stain(crazy_doc)
    crazy_doc = engine.apply_lighting_shadow(crazy_doc)
    crazy_doc = engine.apply_extreme_perspective(crazy_doc)
    crazy_doc.save("stress_test/tc011_damaged_lab_report.jpg")

    # 4. TC002 - Unreadable (The "Blackout" Photo)
    unreadable = engine.generate_lab_report("Sneha Reddy", [("Glucose", "110", "70-100")])
    enhancer = ImageEnhance.Brightness(unreadable)
    unreadable = enhancer.enhance(0.1) # Pitch black
    unreadable.save("stress_test/tc002_blackout_photo.jpg")

    print("Success! Extreme stress-test documents generated in /stress_test")

    # Add this to your plum_stress_engine.py

# 1. Doc 9 - TC012: The Excluded Obesity Claim
tests_anita = [("BMI Analysis", "37.5", "18-25"), ("Bariatric Eval", "Recommended", "-")]
doc_9 = engine.generate_lab_report("Anita Desai", tests_anita)
# Add "Obesity Treatment" text explicitly
draw = ImageDraw.Draw(doc_9)
draw.text((40, 350), "Diagnosis: Morbid Obesity - Bariatric Consultation", font=engine.f_h2, fill=PLUM_MAIN)
doc_9.save("stress_test/tc012_obesity_exclusion.jpg")

# 2. Doc 10 - TC008: The Over-Limit Bill (₹7,500)
items_amit = [("Specialist Consultation", 2000), ("Emergency Observation", 5500)]
doc_10 = engine.generate_hospital_bill("City Clinic", "Amit Verma", items_amit, 7500)
doc_10.save("stress_test/tc008_over_limit_bill.jpg")