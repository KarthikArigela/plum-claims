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

class PlumMockEngine:
    def __init__(self):
        # Load fonts - Adjust paths as per your OS
        try:
            self.font_bold = ImageFont.truetype("arialbd.ttf", 24)
            self.font_regular = ImageFont.truetype("arial.ttf", 18)
            self.font_small = ImageFont.truetype("arial.ttf", 14)
            # Use a cursive font for diagnosis/handwriting simulation
            self.font_hand = ImageFont.truetype("DancingScript-Regular.ttf", 28)
        except:
            print("Warning: Custom fonts not found, using defaults.")
            self.font_bold = self.font_regular = self.font_small = self.font_hand = ImageFont.load_default()

    def create_base_paper(self, color=PLUM_OFFWHITE):
        """Creates an A4-style high-res canvas."""
        return Image.new('RGB', (800, 1100), color=color)

    def draw_header(self, draw, title, subtitle, reg_no):
        """Draws the professional header for doctors/hospitals."""
        draw.rectangle([0, 0, 800, 120], fill=PLUM_MAIN)
        draw.text((40, 30), title, font=self.font_bold, fill=PLUM_OFFWHITE)
        draw.text((40, 65), subtitle, font=self.font_small, fill=PLUM_OFFWHITE)
        draw.text((600, 30), "REG NO:", font=self.font_small, fill=PLUM_PINK)
        draw.text((600, 50), reg_no, font=self.font_regular, fill=PLUM_OFFWHITE)

    # ==========================================
    # DOCUMENT TYPES
    # ==========================================

    def generate_prescription(self, patient_name, diagnosis, date):
        img = self.create_base_paper()
        draw = ImageDraw.Draw(img)
        
        self.draw_header(draw, "DR. ARUN SHARMA, MBBS, MD", "City Medical Centre, 12 MG Road, Bengaluru", "KA/2015/45678")
        
        # Rx Content
        draw.text((40, 160), f"Patient: {patient_name}", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((600, 160), f"Date: {date}", font=self.font_regular, fill=PLUM_MAIN)
        draw.line([40, 200, 760, 200], fill=PLUM_SECONDARY, width=2)
        
        draw.text((40, 230), "Rx", font=self.font_bold, fill=PLUM_PINK)
        
        # The Handwriting Stress Test
        draw.text((40, 280), "Diagnosis:", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((160, 275), diagnosis, font=self.font_hand, fill=(30, 30, 120)) # Blue ink
        
        medicines = [
            "1. Tab. Paracetamol 650mg --- 1-1-1 (5 days)",
            "2. Tab. Vitamin C 500mg --- 0-0-1 (10 days)",
            "3. Syrup Benadryl --- 5ml before bed"
        ]
        y = 350
        for med in medicines:
            draw.text((60, y), med, font=self.font_regular, fill=PLUM_MAIN)
            y += 40
            
        return img

    def generate_hospital_bill(self, hospital_name, patient_name, items, total):
        img = self.create_base_paper(color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        
        # Modern Hospital Look
        draw.rectangle([0, 0, 800, 10], fill=PLUM_PINK)
        draw.text((40, 40), hospital_name.upper(), font=self.font_bold, fill=PLUM_MAIN)
        draw.text((40, 75), "TAX INVOICE / RECEIPT", font=self.font_small, fill=PLUM_SECONDARY)
        
        # Meta info
        draw.text((40, 150), f"Bill to: {patient_name}", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((600, 150), "Date: 01-Nov-2024", font=self.font_regular, fill=PLUM_MAIN)
        
        # Table Header
        draw.rectangle([40, 200, 760, 240], fill=PLUM_SECONDARY)
        draw.text((50, 210), "Description", font=self.font_regular, fill=PLUM_OFFWHITE)
        draw.text((650, 210), "Amount (₹)", font=self.font_regular, fill=PLUM_OFFWHITE)
        
        y = 260
        for item, price in items:
            draw.text((50, y), item, font=self.font_regular, fill=PLUM_MAIN)
            draw.text((650, y), f"{price:,.2f}", font=self.font_regular, fill=PLUM_MAIN)
            y += 50
            draw.line([40, y-10, 760, y-10], fill=(230, 230, 230), width=1)
            
        # Grand Total
        draw.text((500, y+20), "GRAND TOTAL:", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((650, y+20), f"₹ {total:,.2f}", font=self.font_bold, fill=PLUM_PINK)
        
        return img

    # ==========================================
    # THE "RUINER" TOOLS (OpenCV & Filters)
    # ==========================================

    def apply_perspective_warp(self, pil_img):
        """Makes the document look like a skewed phone photo."""
        open_cv_image = np.array(pil_img)
        rows, cols, ch = open_cv_image.shape
        
        # Define 4 corners of the source and move them slightly randomly
        pts1 = np.float32([[0, 0], [cols, 0], [0, rows], [cols, rows]])
        pts2 = np.float32([
            [random.randint(0, 30), random.randint(0, 30)], 
            [cols - random.randint(0, 30), random.randint(0, 30)], 
            [random.randint(0, 30), rows - random.randint(0, 30)], 
            [cols - random.randint(0, 30), rows - random.randint(0, 30)]
        ])
        
        M = cv2.getPerspectiveTransform(pts1, pts2)
        dst = cv2.warpPerspective(open_cv_image, M, (cols, rows), borderValue=(50, 50, 50))
        return Image.fromarray(dst)

    def apply_digital_chaos(self, pil_img, blur=0, noise=0, darkness=1.0):
        """Simulates low light, ISO noise, and blur."""
        # 1. Darken
        enhancer = ImageEnhance.Brightness(pil_img)
        img = enhancer.enhance(darkness)
        
        # 2. Gaussian Blur
        if blur > 0:
            img = img.filter(ImageFilter.GaussianBlur(radius=blur))
        
        # 3. ISO Noise (OpenCV)
        if noise > 0:
            cv_img = np.array(img)
            n = np.random.normal(0, noise, cv_img.shape)
            cv_img = np.clip(cv_img + n, 0, 255).astype(np.uint8)
            img = Image.fromarray(cv_img)
            
        return img

    def add_rubber_stamp(self, pil_img, text="PAID", color=(20, 40, 180, 180)):
        """Adds an ink stamp that overlaps text."""
        overlay = Image.new('RGBA', pil_img.size, (0,0,0,0))
        d = ImageDraw.Draw(overlay)
        # Draw a messy circle/rect stamp
        coords = [450, 700, 650, 800]
        d.rectangle(coords, outline=color, width=5)
        d.text((470, 730), text, font=self.font_bold, fill=color)
        
        # Rotate the stamp randomly
        overlay = overlay.rotate(random.randint(-20, 20), resample=Image.BICUBIC)
        
        # Merge
        pil_img = pil_img.convert("RGBA")
        combined = Image.alpha_composite(pil_img, overlay)
        return combined.convert("RGB")

# ==========================================
# RUN GENERATION
# ==========================================
if __name__ == "__main__":
    engine = PlumMockEngine()
    
    if not os.path.exists("mocks"): os.makedirs("mocks")

    # 1. TC004 - Clean Happy Path (Rajesh Kumar)
    rx = engine.generate_prescription("Rajesh Kumar", "Viral Fever and URI", "01-Nov-2024")
    rx.save("mocks/tc004_prescription.jpg")
    
    bill_items = [("Consultation Fee", 1000), ("CBC Test", 300), ("Dengue NS1", 200)]
    bill = engine.generate_hospital_bill("Apollo Hospitals", "Rajesh Kumar", bill_items, 1500)
    bill.save("mocks/tc004_apollo_bill.jpg")

    # 2. TC002 - The "Unreadable" Horror (Blurry Pharmacy)
    pharma_items = [("Amoxicillin", 120), ("Paracetamol", 40)]
    pharma_bill = engine.generate_hospital_bill("HealthFirst Pharmacy", "Sneha Reddy", pharma_items, 160)
    pharma_bill = engine.apply_digital_chaos(pharma_bill, blur=4, noise=30, darkness=0.5)
    pharma_bill = engine.apply_perspective_warp(pharma_bill)
    pharma_bill.save("mocks/tc002_blurry_pharma.jpg")

    # 3. TC011 - The "Stamp Over Text" (Low Confidence)
    kavita_rx = engine.generate_prescription("Kavita Nair", "Severe Osteoarthritis", "28-Oct-2024")
    kavita_rx = engine.add_rubber_stamp(kavita_rx, "DUPLICATE COPY", color=(180, 20, 20, 150))
    kavita_rx.save("mocks/tc011_stamped_rx.jpg")

    # 4. TC007 - The High Value MRI (Fortis)
    mri_items = [("MRI Lumbar Spine", 14500), ("Contrast Media", 500)]
    mri_bill = engine.generate_hospital_bill("Fortis Healthcare", "Suresh Patil", mri_items, 15000)
    mri_bill.save("mocks/tc007_fortis_mri.jpg")

    print("Success! 6 mock documents generated in /mocks folder.")