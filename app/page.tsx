"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UploadedFile {
  file: File;
  declaredType: string;
  previewUrl: string;
}

function Dropdown<T extends { id: string; label?: string; name?: string }>({
  options, value, onChange, label, getLabel,
}: {
  options: T[];
  value: T;
  onChange: (val: T) => void;
  label: string;
  getLabel: (item: T) => string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!value) return null;

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">{label}</label>
      <div
        onClick={() => setOpen(!open)}
        className={`w-full bg-plum-main/80 border ${open ? "border-plum-pink" : "border-plum-secondary"} rounded-md px-4 py-3 text-plum-offwhite text-base cursor-pointer flex justify-between items-center transition-colors hover:border-plum-pink`}
      >
        <span className="select-none truncate">{getLabel(value)}</span>
        <svg className={`w-4 h-4 text-plum-muted transition-transform duration-200 shrink-0 ml-2 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && (
        <ul className="absolute z-50 w-full mt-1 bg-plum-main border border-plum-secondary rounded-md shadow-2xl overflow-hidden py-1 max-h-52 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt.id}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`px-4 py-2.5 cursor-pointer text-base transition-colors select-none ${value.id === opt.id ? "bg-plum-pink/10 text-plum-pink font-medium" : "text-plum-offwhite hover:bg-plum-pink hover:text-white"}`}
            >
              {getLabel(opt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SubmitClaim() {
  const router = useRouter();

  const [policyData, setPolicyData] = useState<{
    members: { id: string; name: string; relationship: string }[];
    categories: { id: string; label: string }[];
    documentTypes: string[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/policy")
      .then((r) => r.json())
      .then(setPolicyData);
  }, []);

  const MEMBERS = policyData?.members ?? [];
  const CATEGORIES = policyData?.categories ?? [];
  const DOC_TYPES = policyData?.documentTypes ?? [];

  const [member, setMember] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [treatmentDate, setTreatmentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [hospitalName, setHospitalName] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set defaults once policy data is loaded
  useEffect(() => {
    if (policyData) {
      if (!member && MEMBERS.length > 0) setMember(MEMBERS[0]);
      if (!category && CATEGORIES.length > 0) setCategory(CATEGORIES[0]);
    }
  }, [policyData, member, category, MEMBERS, CATEGORIES]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList) => {
    const added: UploadedFile[] = Array.from(incoming).map((file, i) => ({
      file,
      declaredType: DOC_TYPES[i % DOC_TYPES.length] ?? "PRESCRIPTION",
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles(prev => [...prev, ...added]);
  }, [DOC_TYPES]);

  const removeFile = (idx: number) => {
    setFiles(prev => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const updateDocType = (idx: number, type: string) => {
    setFiles(prev => prev.map((f, i) => i === idx ? { ...f, declaredType: type } : f));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (files.length === 0) {
      setError("Please upload at least one document.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const claimData = {
        memberId:       member.id,
        policyId:       "PLUM_GHI_2024",
        claimCategory:  category.id,
        treatmentDate,
        claimedAmount:  parseFloat(amount),
        hospitalName:   hospitalName || undefined,
      };
      formData.append("claimData", JSON.stringify(claimData));

      files.forEach(f => {
        formData.append("documents", f.file);
        formData.append("documentTypes", f.declaredType);
      });

      const res = await fetch("/api/claims", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      const result = await res.json();

      // Store result in sessionStorage — results page reads this
      sessionStorage.setItem(`claim_${result.claimId}`, JSON.stringify(result));

      router.push(`/claims/${result.claimId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-6">

      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-plum-offwhite mb-2">
          Submit a claim, <em className="text-plum-muted">effortlessly.</em>
        </h1>
        <p className="text-plum-muted text-sm sm:text-base leading-relaxed">
          Upload your medical documents below. Our AI checks them instantly so you get paid faster.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-plum-secondary/30 border border-plum-secondary rounded-xl p-5 sm:p-7 flex flex-col gap-5 shadow-2xl relative overflow-visible backdrop-blur-sm">

        {/* Pink accent bar */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-plum-main via-plum-pink to-plum-main rounded-t-xl" />

        {/* Member */}
        <Dropdown
          options={MEMBERS}
          value={member}
          onChange={setMember}
          label="Member"
          getLabel={m => `${m.id} — ${m.name}`}
        />

        {/* Category + Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
          <Dropdown
            options={CATEGORIES}
            value={category}
            onChange={setCategory}
            label="Category"
            getLabel={c => c.label}
          />
          <div>
            <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="w-full bg-plum-main/80 border border-plum-secondary rounded-md px-4 py-3 text-plum-offwhite text-base focus:outline-none focus:border-plum-pink transition-colors"
            />
          </div>
        </div>

        {/* Treatment Date + Hospital */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">Treatment Date</label>
            <input
              type="date"
              value={treatmentDate}
              max={new Date().toISOString().split("T")[0]} // Prevent years like 275760
              onChange={e => setTreatmentDate(e.target.value)}
              required
              className="w-full bg-plum-main/80 border border-plum-secondary rounded-md px-4 py-[11px] text-plum-offwhite text-base focus:outline-none focus:border-plum-pink transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">Hospital Name <span className="text-plum-muted/50 normal-case font-normal">(optional)</span></label>
            <input
              type="text"
              value={hospitalName}
              onChange={e => setHospitalName(e.target.value)}
              placeholder="e.g. Apollo Hospitals"
              className="w-full bg-plum-main/80 border border-plum-secondary rounded-md px-4 py-3 text-plum-offwhite text-base focus:outline-none focus:border-plum-pink transition-colors placeholder-plum-muted/40"
            />
          </div>
        </div>

        {/* File Upload Zone */}
        <div>
          <label className="block text-xs font-semibold text-plum-muted uppercase tracking-wider mb-2">Upload Documents</label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            className="border border-dashed border-plum-secondary bg-plum-main/40 rounded-md p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:bg-plum-secondary/50 transition-colors cursor-pointer group active:bg-plum-secondary/70"
          >
            <div className="w-10 h-10 rounded-full bg-plum-secondary flex items-center justify-center mb-3 group-hover:bg-plum-pink transition-colors">
              <svg className="w-5 h-5 text-plum-offwhite" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-plum-offwhite mb-1">Tap to upload or drag files here</p>
            <p className="text-xs text-plum-muted">PDF, JPG, PNG (Max 5MB each)</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,application/pdf"
              capture="environment"
              className="hidden"
              onChange={e => { if (e.target.files) addFiles(e.target.files); }}
            />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {files.map((f, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-plum-main/60 border border-plum-secondary rounded-md px-3 py-2">
                  <div className="w-8 h-8 rounded bg-plum-secondary/50 flex items-center justify-center shrink-0 text-xs text-plum-muted font-mono">
                    {f.file.name.endsWith(".pdf") ? "PDF" : "IMG"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-plum-offwhite truncate">{f.file.name}</p>
                    <select
                      value={f.declaredType}
                      onChange={e => updateDocType(idx, e.target.value)}
                      className="mt-1 bg-plum-main border border-plum-secondary rounded text-xs text-plum-muted px-2 py-1 focus:outline-none focus:border-plum-pink w-full"
                    >
                      {DOC_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                  <button type="button" onClick={() => removeFile(idx)} className="text-plum-muted hover:text-plum-pink transition-colors shrink-0 p-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-plum-pink/10 border border-plum-pink/40 rounded-md px-4 py-3 text-sm text-plum-pink">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full bg-plum-pink hover:bg-[#e03848] active:scale-[0.98] text-white font-semibold py-3.5 rounded-md flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-lg shadow-[0_4px_14px_rgba(255,64,82,0.3)] select-none"
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Analysing Documents...
            </>
          ) : (
            <>Submit Claim <span className="text-xl font-light leading-none">→</span></>
          )}
        </button>

      </form>
    </div>
  );
}