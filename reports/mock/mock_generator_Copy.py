import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import random
from pathlib import Path

PLUM_MAIN = (43, 11, 33)
PLUM_SECONDARY = (94, 44, 77)
PLUM_OFFWHITE = (255, 244, 235)
PLUM_PINK = (255, 64, 82)
BLUE_INK = (30, 30, 120)
GRAY = (230, 230, 230)

PERSON_PROFILES = {
    "rajesh_kumar": {
        "patient_name": "Rajesh Kumar",
        "age_gender": "39 / Male",
        "city": "Bengaluru",
        "date": "01-May-2026",
        "doctor_name": "Dr. Arun Sharma",
        "doctor_qual": "MBBS, MD",
        "doctor_reg": "KA456782015",
        "provider": "City Medical Centre",
        "provider_address": "12 MG Road, Bengaluru",
        "pharmacy": "Health First Pharmacy",
        "lab": "Precision Diagnostics Pvt Ltd",
        "consultation_diagnosis": "Viral Fever with body ache",
        "consultation_medicines": [
            "1. Tab. Paracetamol 650mg --- 1-1-1 (5 days)",
            "2. Tab. Vitamin C 500mg --- 0-0-1 (7 days)",
            "3. Syrup Benadryl --- 5ml before bed"
        ],
        "consultation_bill_items": [("Consultation Fee", 1000), ("CBC Test", 300), ("Dengue NS1 Antigen Test", 200)],
        "pharmacy_bill_items": [
            ("Paracetamol 650", 37.50),
            ("Vitamin C 500", 40.00),
            ("Benadryl Syrup", 96.50)
        ],
        "lab_tests": [
            ("CBC Hemoglobin", "13.2", "g/dL", "13.0 - 17.0"),
            ("WBC Count", "9800", "/uL", "4500 - 11000"),
            ("Dengue NS1 Antigen", "NEGATIVE", "", "NEGATIVE")
        ],
        "vision_diagnosis": "Refractive error with headache",
        "vision_bill_items": [("Ophthalmology Consultation", 800), ("Vision Refraction Test", 400)],
    },
    "suresh_patil": {
        "patient_name": "Suresh Patil",
        "age_gender": "46 / Male",
        "city": "Pune",
        "date": "02-May-2026",
        "doctor_name": "Dr. Venkat Rao",
        "doctor_qual": "MS Ortho",
        "doctor_reg": "AP678902017",
        "provider": "Fortis Healthcare",
        "provider_address": "Bannerghatta Road, Bengaluru",
        "lab": "Fortis Diagnostics",
        "consultation_diagnosis": "Suspected Lumbar Disc Herniation",
        "consultation_medicines": [
            "1. Tab. Etoricoxib 60mg --- 1-0-1 (5 days)",
            "2. Tab. Pantoprazole 40mg --- 1-0-0 (5 days)",
            "3. MRI Lumbar Spine advised"
        ],
        "diagnostic_bill_items": [("MRI Lumbar Spine", 14500), ("Contrast Media", 500)],
        "lab_tests": [
            ("MRI Lumbar Spine", "Disc bulge at L4-L5", "", "Clinical correlation advised")
        ],
    },
    "priya_singh": {
        "patient_name": "Priya Singh",
        "age_gender": "31 / Female",
        "city": "Delhi",
        "date": "03-May-2026",
        "doctor_name": "Dr. Nidhi Kapoor",
        "doctor_qual": "BDS, MDS",
        "doctor_reg": "DL345672016",
        "provider": "Smile Dental Clinic",
        "provider_address": "Connaught Place, New Delhi",
        "consultation_diagnosis": "Dental caries with pain",
        "consultation_medicines": [
            "1. Tab. Amoxicillin 500mg --- 1-1-1 (5 days)",
            "2. Tab. Ibuprofen 400mg --- SOS pain",
            "3. Root canal treatment advised"
        ],
        "dental_bill_items": [("Root Canal Treatment", 8000), ("Teeth Whitening", 4000)],
    },
    "deepak_shah": {
        "patient_name": "Deepak Shah",
        "age_gender": "42 / Male",
        "city": "Chennai",
        "date": "04-May-2026",
        "doctor_name": "Dr. S. Iyer",
        "doctor_qual": "MBBS, MD Pulmonology",
        "doctor_reg": "TN567892013",
        "provider": "Apollo Hospitals",
        "provider_address": "Greams Road, Chennai",
        "consultation_diagnosis": "Acute Bronchitis",
        "consultation_medicines": [
            "1. Cap. Amoxicillin 500mg --- 1-1-1 (5 days)",
            "2. Salbutamol Inhaler --- SOS",
            "3. Steam inhalation advised"
        ],
        "consultation_bill_items": [("Consultation Fee", 1500), ("Medicines", 3000)],
    },
    "vikram_joshi": {
        "patient_name": "Vikram Joshi",
        "age_gender": "48 / Male",
        "city": "Ahmedabad",
        "date": "05-May-2026",
        "doctor_name": "Dr. Sunil Mehta",
        "doctor_qual": "MD Internal Medicine",
        "doctor_reg": "GJ567892014",
        "provider": "Shree Care Clinic",
        "provider_address": "Navrangpura, Ahmedabad",
        "consultation_diagnosis": "Type 2 Diabetes Mellitus",
        "consultation_medicines": [
            "1. Tab. Metformin 500mg --- 1-0-1",
            "2. Tab. Glimepiride 1mg --- 1-0-0",
            "3. FBS / PPBS review after 7 days"
        ],
        "consultation_bill_items": [("Consultation Fee", 1200), ("Blood Sugar Evaluation", 1800)],
    },
    "ananya_menon": {
        "patient_name": "Ananya Menon",
        "age_gender": "37 / Female",
        "city": "Kochi",
        "date": "06-May-2026",
        "doctor_name": "Vaidya T. Krishnan",
        "doctor_qual": "BAMS",
        "doctor_reg": "AYURKL23452019",
        "provider": "Ayur Wellness Centre",
        "provider_address": "MG Road, Kochi",
        "consultation_diagnosis": "Chronic Joint Pain",
        "consultation_medicines": [
            "1. Panchakarma Therapy --- 5 sessions",
            "2. Kashayam --- 10ml twice daily",
            "3. Joint oil application advised"
        ],
        "alt_bill_items": [("Panchakarma Therapy - 5 sessions", 3000), ("Consultation", 1000)],
    },
}


class PlumMockEngine:
    def __init__(self):
        try:
            self.font_bold = ImageFont.truetype("arialbd.ttf", 24)
            self.font_regular = ImageFont.truetype("arial.ttf", 18)
            self.font_small = ImageFont.truetype("arial.ttf", 14)
            self.font_hand = ImageFont.truetype("DancingScript-Regular.ttf", 28)
        except Exception:
            print("Warning: Custom fonts not found, using defaults.")
            self.font_bold = ImageFont.load_default()
            self.font_regular = ImageFont.load_default()
            self.font_small = ImageFont.load_default()
            self.font_hand = ImageFont.load_default()

    def create_base_paper(self, color=PLUM_OFFWHITE):
        return Image.new("RGB", (800, 1100), color=color)

    def draw_header(self, draw, title, subtitle, reg_no):
        draw.rectangle([0, 0, 800, 120], fill=PLUM_MAIN)
        draw.text((40, 30), title, font=self.font_bold, fill=PLUM_OFFWHITE)
        draw.text((40, 65), subtitle, font=self.font_small, fill=PLUM_OFFWHITE)
        draw.text((600, 30), "REG NO:", font=self.font_small, fill=PLUM_PINK)
        draw.text((600, 50), reg_no, font=self.font_regular, fill=PLUM_OFFWHITE)

    def generate_prescription(self, patient_name, diagnosis, date, doctor_name, doctor_qual, provider, provider_address, doctor_reg, medicines=None, tests_ordered=None):
        img = self.create_base_paper()
        draw = ImageDraw.Draw(img)
        self.draw_header(draw, f"{doctor_name}, {doctor_qual}", f"{provider}, {provider_address}", doctor_reg)
        draw.text((40, 160), f"Patient: {patient_name}", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((520, 160), f"Date: {date}", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((40, 190), "Age / Gender: See file record", font=self.font_small, fill=PLUM_SECONDARY)
        draw.line([40, 220, 760, 220], fill=PLUM_SECONDARY, width=2)
        draw.text((40, 245), "Rx", font=self.font_bold, fill=PLUM_PINK)
        draw.text((40, 295), "Diagnosis:", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((170, 290), diagnosis, font=self.font_hand, fill=BLUE_INK)

        y = 360
        for med in medicines or []:
            draw.text((60, y), med, font=self.font_regular, fill=PLUM_MAIN)
            y += 40

        if tests_ordered:
            y += 20
            draw.text((40, y), "Investigations / Advice:", font=self.font_bold, fill=PLUM_MAIN)
            y += 40
            for test in tests_ordered:
                draw.text((60, y), f"- {test}", font=self.font_regular, fill=PLUM_MAIN)
                y += 32

        draw.text((520, 980), "Doctor Signature", font=self.font_small, fill=PLUM_SECONDARY)
        draw.line([500, 965, 730, 965], fill=PLUM_SECONDARY, width=1)
        return img

    def generate_hospital_bill(self, hospital_name, patient_name, items, total, date, subtitle="TAX INVOICE / RECEIPT"):
        img = self.create_base_paper(color=(255, 255, 255))
        draw = ImageDraw.Draw(img)

        draw.rectangle([0, 0, 800, 10], fill=PLUM_PINK)
        draw.text((40, 40), hospital_name.upper(), font=self.font_bold, fill=PLUM_MAIN)
        draw.text((40, 75), subtitle, font=self.font_small, fill=PLUM_SECONDARY)
        draw.text((40, 150), f"Bill to: {patient_name}", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((560, 150), f"Date: {date}", font=self.font_regular, fill=PLUM_MAIN)

        draw.rectangle([40, 200, 760, 240], fill=PLUM_SECONDARY)
        draw.text((50, 210), "Description", font=self.font_regular, fill=PLUM_OFFWHITE)
        draw.text((650, 210), "Amount (Rs)", font=self.font_regular, fill=PLUM_OFFWHITE)

        y = 260
        for item, price in items:
            draw.text((50, y), item, font=self.font_regular, fill=PLUM_MAIN)
            draw.text((650, y), f"{price:,.2f}", font=self.font_regular, fill=PLUM_MAIN)
            y += 50

        draw.line([40, y - 10, 760, y - 10], fill=GRAY, width=1)
        draw.text((500, y + 20), "GRAND TOTAL:", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((650, y + 20), f"Rs {total:,.2f}", font=self.font_bold, fill=PLUM_PINK)
        return img

    def generate_pharmacy_bill(self, pharmacy_name, patient_name, doctor_name, items, date):
        total = sum(price for _, price in items)
        img = self.create_base_paper(color=(255, 255, 255))
        draw = ImageDraw.Draw(img)

        draw.rectangle([0, 0, 800, 10], fill=PLUM_PINK)
        draw.text((40, 40), pharmacy_name.upper(), font=self.font_bold, fill=PLUM_MAIN)
        draw.text((40, 75), "PHARMACY BILL", font=self.font_small, fill=PLUM_SECONDARY)
        draw.text((40, 140), f"Patient: {patient_name}", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((40, 170), f"Prescribing Doctor: {doctor_name}", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((560, 140), f"Date: {date}", font=self.font_regular, fill=PLUM_MAIN)

        draw.rectangle([40, 220, 760, 260], fill=PLUM_SECONDARY)
        draw.text((50, 230), "Medicine", font=self.font_regular, fill=PLUM_OFFWHITE)
        draw.text((650, 230), "Amount", font=self.font_regular, fill=PLUM_OFFWHITE)

        y = 280
        for item, price in items:
            draw.text((50, y), item, font=self.font_regular, fill=PLUM_MAIN)
            draw.text((650, y), f"{price:,.2f}", font=self.font_regular, fill=PLUM_MAIN)
            y += 45

        discount = round(total * 0.05, 2)
        net = round(total - discount, 2)
        y += 10
        draw.text((500, y), "Subtotal", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((650, y), f"{total:,.2f}", font=self.font_regular, fill=PLUM_MAIN)
        y += 35
        draw.text((500, y), "Discount", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((650, y), f"-{discount:,.2f}", font=self.font_regular, fill=PLUM_MAIN)
        y += 45
        draw.text((500, y), "Net Amount", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((650, y), f"Rs {net:,.2f}", font=self.font_bold, fill=PLUM_PINK)
        return img

    def generate_lab_report(self, lab_name, patient_name, ref_doctor, tests, date):
        img = self.create_base_paper(color=(252, 252, 252))
        draw = ImageDraw.Draw(img)
        self.draw_header(draw, lab_name, "NABL Accredited Laboratory", "KA-NABL-1234")
        draw.text((40, 150), f"Patient: {patient_name}", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((40, 180), f"Ref Doctor: {ref_doctor}", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((540, 150), f"Report Date: {date}", font=self.font_regular, fill=PLUM_MAIN)

        draw.rectangle([40, 230, 760, 270], fill=PLUM_SECONDARY)
        draw.text((50, 240), "Test Name", font=self.font_regular, fill=PLUM_OFFWHITE)
        draw.text((330, 240), "Result", font=self.font_regular, fill=PLUM_OFFWHITE)
        draw.text((470, 240), "Unit", font=self.font_regular, fill=PLUM_OFFWHITE)
        draw.text((560, 240), "Normal Range / Remarks", font=self.font_regular, fill=PLUM_OFFWHITE)

        y = 290
        for name, result, unit, ref_range in tests:
            draw.text((50, y), name, font=self.font_small, fill=PLUM_MAIN)
            draw.text((330, y), result, font=self.font_small, fill=PLUM_MAIN)
            draw.text((470, y), unit, font=self.font_small, fill=PLUM_MAIN)
            draw.text((560, y), ref_range, font=self.font_small, fill=PLUM_MAIN)
            y += 45

        draw.text((40, y + 40), "Pathologist: Dr. Meena Pillai", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((40, y + 70), "Reg No: KA890122018", font=self.font_regular, fill=PLUM_MAIN)
        return img

    def generate_dental_report(self, clinic_name, patient_name, diagnosis, procedure, date, doctor_name, doctor_reg):
        img = self.create_base_paper()
        draw = ImageDraw.Draw(img)
        self.draw_header(draw, clinic_name, "Dental Evaluation Report", doctor_reg)
        draw.text((40, 160), f"Patient: {patient_name}", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((540, 160), f"Date: {date}", font=self.font_regular, fill=PLUM_MAIN)
        draw.text((40, 240), "Clinical Findings:", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((60, 290), diagnosis, font=self.font_regular, fill=PLUM_MAIN)
        draw.text((40, 360), "Recommended Procedure:", font=self.font_bold, fill=PLUM_MAIN)
        draw.text((60, 410), procedure, font=self.font_regular, fill=PLUM_MAIN)
        draw.text((40, 500), f"Consultant: {doctor_name}", font=self.font_regular, fill=PLUM_MAIN)
        return img

    def apply_perspective_warp(self, pil_img):
        open_cv_image = np.array(pil_img)
        rows, cols, _ = open_cv_image.shape

        pts1 = np.float32([[0, 0], [cols, 0], [0, rows], [cols, rows]])
        pts2 = np.float32([
            [random.randint(0, 30), random.randint(0, 30)],
            [cols - random.randint(0, 30), random.randint(0, 30)],
            [random.randint(0, 30), rows - random.randint(0, 30)],
            [cols - random.randint(0, 30), rows - random.randint(0, 30)],
        ])

        matrix = cv2.getPerspectiveTransform(pts1, pts2)
        dst = cv2.warpPerspective(open_cv_image, matrix, (cols, rows), borderValue=(50, 50, 50))
        return Image.fromarray(dst)

    def apply_digital_chaos(self, pil_img, blur=0, noise=0, darkness=1.0):
        img = ImageEnhance.Brightness(pil_img).enhance(darkness)
        if blur > 0:
            img = img.filter(ImageFilter.GaussianBlur(radius=blur))
        if noise > 0:
            cv_img = np.array(img)
            n = np.random.normal(0, noise, cv_img.shape)
            cv_img = np.clip(cv_img + n, 0, 255).astype(np.uint8)
            img = Image.fromarray(cv_img)
        return img

    def add_rubber_stamp(self, pil_img, text="PAID", color=(20, 40, 180, 180)):
        overlay = Image.new("RGBA", pil_img.size, (0, 0, 0, 0))
        d = ImageDraw.Draw(overlay)
        coords = [450, 700, 680, 800]
        d.rectangle(coords, outline=color, width=5)
        d.text((470, 730), text, font=self.font_bold, fill=color)
        overlay = overlay.rotate(random.randint(-20, 20), resample=Image.BICUBIC)
        base = pil_img.convert("RGBA")
        combined = Image.alpha_composite(base, overlay)
        return combined.convert("RGB")

    def maybe_ruin(self, img, scenario, doc_type):
        if scenario == "unreadable" and doc_type in {"PHARMACY_BILL", "HOSPITAL_BILL"}:
            img = self.apply_digital_chaos(img, blur=4, noise=28, darkness=0.55)
            img = self.apply_perspective_warp(img)
        elif scenario == "stamped" and doc_type in {"PRESCRIPTION", "HOSPITAL_BILL"}:
            img = self.add_rubber_stamp(img, "DUPLICATE COPY", color=(180, 20, 20, 150))
        elif scenario == "phone_photo":
            img = self.apply_perspective_warp(img)
            img = self.apply_digital_chaos(img, blur=1, noise=10, darkness=0.92)
        return img

    def save_img(self, img, path):
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(str(path))

    def generate_case_bundle(self, person_key, category, scenario="clean", root="mocks"):
        profile = PERSON_PROFILES[person_key]
        patient = profile["patient_name"]
        folder = Path(root) / person_key / category.lower() / scenario
        generated = []

        if category == "CONSULTATION":
            rx = self.generate_prescription(
                patient, profile["consultation_diagnosis"], profile["date"],
                profile["doctor_name"], profile["doctor_qual"], profile["provider"],
                profile["provider_address"], profile["doctor_reg"],
                medicines=profile["consultation_medicines"],
                tests_ordered=[item[0] for item in profile.get("consultation_bill_items", [])[1:]] or None,
            )
            bill_items = profile.get("consultation_bill_items", [("Consultation Fee", 1000)])
            bill = self.generate_hospital_bill(profile["provider"], patient, bill_items, sum(x[1] for x in bill_items), profile["date"])
            docs = [
                ("prescription.jpg", self.maybe_ruin(rx, scenario, "PRESCRIPTION")),
                ("hospital_bill.jpg", self.maybe_ruin(bill, scenario, "HOSPITAL_BILL")),
            ]

        elif category == "DIAGNOSTIC":
            tests = [t[0] for t in profile.get("lab_tests", [])] or ["MRI Lumbar Spine"]
            rx = self.generate_prescription(
                patient, profile["consultation_diagnosis"], profile["date"],
                profile["doctor_name"], profile["doctor_qual"], profile["provider"],
                profile["provider_address"], profile["doctor_reg"],
                medicines=profile["consultation_medicines"], tests_ordered=tests,
            )
            lab = self.generate_lab_report(profile.get("lab", "Precision Diagnostics Pvt Ltd"), patient, profile["doctor_name"], profile.get("lab_tests", []), profile["date"])
            bill_items = profile.get("diagnostic_bill_items") or profile.get("consultation_bill_items") or [("MRI Scan", 15000)]
            bill = self.generate_hospital_bill(profile["provider"], patient, bill_items, sum(x[1] for x in bill_items), profile["date"], subtitle="DIAGNOSTIC BILL")
            docs = [
                ("prescription.jpg", self.maybe_ruin(rx, scenario, "PRESCRIPTION")),
                ("lab_report.jpg", self.maybe_ruin(lab, scenario, "LAB_REPORT")),
                ("hospital_bill.jpg", self.maybe_ruin(bill, scenario, "HOSPITAL_BILL")),
            ]

        elif category == "PHARMACY":
            rx = self.generate_prescription(
                patient, profile["consultation_diagnosis"], profile["date"],
                profile["doctor_name"], profile["doctor_qual"], profile["provider"],
                profile["provider_address"], profile["doctor_reg"],
                medicines=profile["consultation_medicines"],
            )
            pharmacy_name = profile.get("pharmacy", "Health First Pharmacy")
            pbill = self.generate_pharmacy_bill(pharmacy_name, patient, profile["doctor_name"], profile.get("pharmacy_bill_items", [("Medicine A", 100.0)]), profile["date"])
            docs = [
                ("prescription.jpg", self.maybe_ruin(rx, scenario, "PRESCRIPTION")),
                ("pharmacy_bill.jpg", self.maybe_ruin(pbill, scenario, "PHARMACY_BILL")),
            ]

        elif category == "DENTAL":
            bill_items = profile.get("dental_bill_items", [("Dental Procedure", 5000)])
            bill = self.generate_hospital_bill(profile["provider"], patient, bill_items, sum(x[1] for x in bill_items), profile["date"], subtitle="DENTAL BILL")
            rx = self.generate_prescription(
                patient, profile["consultation_diagnosis"], profile["date"],
                profile["doctor_name"], profile["doctor_qual"], profile["provider"],
                profile["provider_address"], profile["doctor_reg"],
                medicines=profile["consultation_medicines"],
            )
            report = self.generate_dental_report(profile["provider"], patient, profile["consultation_diagnosis"], "Root Canal Treatment advised; cosmetic whitening optional", profile["date"], profile["doctor_name"], profile["doctor_reg"])
            docs = [
                ("hospital_bill.jpg", self.maybe_ruin(bill, scenario, "HOSPITAL_BILL")),
                ("prescription.jpg", self.maybe_ruin(rx, scenario, "PRESCRIPTION")),
                ("dental_report.jpg", self.maybe_ruin(report, scenario, "DENTAL_REPORT")),
            ]

        elif category == "VISION":
            rx = self.generate_prescription(
                patient, profile.get("vision_diagnosis", "Vision strain"), profile["date"],
                profile["doctor_name"], profile["doctor_qual"], profile["provider"],
                profile["provider_address"], profile["doctor_reg"],
                medicines=["1. Eye drops --- 1 drop twice daily", "2. Computer vision rest advised"],
            )
            bill_items = profile.get("vision_bill_items", [("Vision Consultation", 700), ("Refraction Test", 300)])
            bill = self.generate_hospital_bill(profile["provider"], patient, bill_items, sum(x[1] for x in bill_items), profile["date"], subtitle="VISION CONSULTATION BILL")
            docs = [
                ("prescription.jpg", self.maybe_ruin(rx, scenario, "PRESCRIPTION")),
                ("hospital_bill.jpg", self.maybe_ruin(bill, scenario, "HOSPITAL_BILL")),
            ]

        elif category == "ALTERNATIVE_MEDICINE":
            rx = self.generate_prescription(
                patient, profile["consultation_diagnosis"], profile["date"],
                profile["doctor_name"], profile["doctor_qual"], profile["provider"],
                profile["provider_address"], profile["doctor_reg"],
                medicines=profile["consultation_medicines"],
            )
            bill_items = profile.get("alt_bill_items", [("Alternative Therapy", 3000), ("Consultation", 1000)])
            bill = self.generate_hospital_bill(profile["provider"], patient, bill_items, sum(x[1] for x in bill_items), profile["date"], subtitle="AYURVEDA / WELLNESS BILL")
            docs = [
                ("prescription.jpg", self.maybe_ruin(rx, scenario, "PRESCRIPTION")),
                ("hospital_bill.jpg", self.maybe_ruin(bill, scenario, "HOSPITAL_BILL")),
            ]
        else:
            raise ValueError(f"Unsupported category: {category}")

        for filename, img in docs:
            out = folder / filename
            self.save_img(img, out)
            generated.append(str(out))

        return generated


if __name__ == "__main__":
    engine = PlumMockEngine()
    Path("mocks").mkdir(exist_ok=True)

    plans = [
        ("rajesh_kumar", "CONSULTATION", "clean"),
        ("rajesh_kumar", "DIAGNOSTIC", "clean"),
        ("rajesh_kumar", "PHARMACY", "clean"),
        ("rajesh_kumar", "PHARMACY", "unreadable"),
        ("suresh_patil", "DIAGNOSTIC", "clean"),
        ("priya_singh", "DENTAL", "clean"),
        ("deepak_shah", "CONSULTATION", "clean"),
        ("vikram_joshi", "CONSULTATION", "clean"),
        ("ananya_menon", "ALTERNATIVE_MEDICINE", "stamped"),
    ]

    all_files = []
    for person_key, category, scenario in plans:
        all_files.extend(engine.generate_case_bundle(person_key, category, scenario=scenario, root="mocks"))

    print("Generated files:")
    for f in all_files:
        print(" -", f)