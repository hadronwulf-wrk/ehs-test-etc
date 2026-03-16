import { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: "company", label: "Company", icon: "building" },
  { id: "event", label: "Event Details", icon: "calendar" },
  { id: "vaccines", label: "Vaccines", icon: "syringe" },
  { id: "review", label: "Review & Book", icon: "check" },
];

const VACCINES = [
  { id: "flu", name: "Influenza (Flu)", desc: "Seasonal flu protection", price: 35, popular: true },
  { id: "covid", name: "COVID-19", desc: "Updated booster available", price: 0, popular: true },
  { id: "hepb", name: "Hepatitis B", desc: "3-dose series", price: 65, popular: false },
  { id: "hepa", name: "Hepatitis A", desc: "2-dose series", price: 75, popular: false },
  { id: "tdap", name: "Tdap", desc: "Tetanus, diphtheria, pertussis", price: 55, popular: false },
  { id: "mmr", name: "MMR", desc: "Measles, mumps, rubella", price: 85, popular: false },
  { id: "varicella", name: "Varicella", desc: "Chickenpox vaccine", price: 140, popular: false },
  { id: "pneumo", name: "Pneumococcal", desc: "Pneumonia prevention", price: 120, popular: false },
  { id: "meningitis", name: "Meningococcal", desc: "Meningitis A, C, W, Y", price: 145, popular: false },
  { id: "tb", name: "TB Screening", desc: "Tuberculosis test (TST/IGRA)", price: 45, popular: true },
];

const ADDONS = [
  { id: "biometric", name: "Biometric Screening", desc: "BMI, blood pressure, cholesterol, glucose", price: 40 },
  { id: "consent", name: "Digital Consent Management", desc: "E-signatures & HIPAA-compliant forms", price: 0 },
  { id: "reporting", name: "Compliance Reporting", desc: "Participation reports & vaccination records", price: 0 },
  { id: "multilingual", name: "Multilingual Staff", desc: "Spanish, Mandarin, and more", price: 0 },
];

const EMPLOYEE_RANGES = [
  "25–50",
  "51–100",
  "101–250",
  "251–500",
  "500+",
];

const INDUSTRIES = [
  "Healthcare",
  "Manufacturing",
  "Education",
  "Corporate / Office",
  "Government",
  "Hospitality",
  "Retail",
  "Construction",
  "Transportation / Logistics",
  "Other",
];

/* ── icons as inline SVG ── */
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    building: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22V18h6v4" /><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M12 6h.01M12 10h.01M12 14h.01" />
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </svg>
    ),
    syringe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    chevronRight: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),
    chevronLeft: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    star: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7L2 9.4h7.6z" />
      </svg>
    ),
    phone: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    info: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    mapPin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    x: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
  };
  return icons[name] || null;
};

/* ── Animated Step Indicator ── */
const StepIndicator = ({ currentStep }) => (
  <div style={styles.stepBar}>
    <div style={styles.stepTrack}>
      {STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isComplete = i < currentStep;
        return (
          <div key={step.id} style={styles.stepItem}>
            <div
              style={{
                ...styles.stepDot,
                ...(isActive ? styles.stepDotActive : {}),
                ...(isComplete ? styles.stepDotComplete : {}),
              }}
            >
              {isComplete ? (
                <Icon name="check" size={14} color="#fff" />
              ) : (
                <span style={{ fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>{i + 1}</span>
              )}
            </div>
            <span
              style={{
                ...styles.stepLabel,
                ...(isActive ? styles.stepLabelActive : {}),
                ...(isComplete ? styles.stepLabelComplete : {}),
              }}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  ...styles.stepConnector,
                  ...(isComplete ? styles.stepConnectorComplete : {}),
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

/* ── Step 1: Company ── */
const CompanyStep = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  return (
    <div style={styles.stepContent}>
      <div style={styles.stepHeader}>
        <h2 style={styles.stepTitle}>Tell us about your company</h2>
        <p style={styles.stepSubtitle}>We'll use this to customize your onsite vaccination plan.</p>
      </div>

      <div style={styles.formGrid2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Company Name *</label>
          <input style={styles.input} placeholder="Acme Corporation" value={data.companyName || ""} onChange={e => update("companyName", e.target.value)} />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Industry *</label>
          <select style={styles.select} value={data.industry || ""} onChange={e => update("industry", e.target.value)}>
            <option value="">Select industry</option>
            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <div style={styles.formGrid2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Contact Name *</label>
          <input style={styles.input} placeholder="Jane Smith" value={data.contactName || ""} onChange={e => update("contactName", e.target.value)} />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Job Title</label>
          <input style={styles.input} placeholder="HR Director" value={data.jobTitle || ""} onChange={e => update("jobTitle", e.target.value)} />
        </div>
      </div>

      <div style={styles.formGrid2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email Address *</label>
          <input style={styles.input} type="email" placeholder="jane@acme.com" value={data.email || ""} onChange={e => update("email", e.target.value)} />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Phone Number *</label>
          <input style={styles.input} type="tel" placeholder="(555) 123-4567" value={data.phone || ""} onChange={e => update("phone", e.target.value)} />
        </div>
      </div>
    </div>
  );
};

/* ── Step 2: Event Details ── */
const EventStep = ({ data, onChange }) => {
  const update = (field, value) => onChange({ ...data, [field]: value });
  return (
    <div style={styles.stepContent}>
      <div style={styles.stepHeader}>
        <h2 style={styles.stepTitle}>Where and when?</h2>
        <p style={styles.stepSubtitle}>Tell us about your worksite so we can plan the right team and supplies.</p>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Worksite Address *</label>
        <input style={styles.input} placeholder="123 Corporate Blvd, Suite 400" value={data.address || ""} onChange={e => update("address", e.target.value)} />
      </div>

      <div style={styles.formGrid3}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>City *</label>
          <input style={styles.input} placeholder="Dallas" value={data.city || ""} onChange={e => update("city", e.target.value)} />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>State *</label>
          <input style={styles.input} placeholder="TX" maxLength={2} value={data.state || ""} onChange={e => update("state", e.target.value.toUpperCase())} />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>ZIP Code *</label>
          <input style={styles.input} placeholder="75201" maxLength={5} value={data.zip || ""} onChange={e => update("zip", e.target.value)} />
        </div>
      </div>

      <div style={styles.formGrid2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Preferred Date *</label>
          <input style={styles.input} type="date" value={data.preferredDate || ""} onChange={e => update("preferredDate", e.target.value)} />
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Alternate Date</label>
          <input style={styles.input} type="date" value={data.altDate || ""} onChange={e => update("altDate", e.target.value)} />
        </div>
      </div>

      <div style={styles.formGrid2}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Estimated Employees *</label>
          <select style={styles.select} value={data.employeeRange || ""} onChange={e => update("employeeRange", e.target.value)}>
            <option value="">Select range</option>
            {EMPLOYEE_RANGES.map(r => <option key={r} value={r}>{r} employees</option>)}
          </select>
        </div>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Multiple Locations?</label>
          <select style={styles.select} value={data.multiLocation || "no"} onChange={e => update("multiLocation", e.target.value)}>
            <option value="no">No, single site</option>
            <option value="yes">Yes, multiple sites</option>
          </select>
        </div>
      </div>

      {data.multiLocation === "yes" && (
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Number of Locations</label>
          <input style={styles.input} type="number" placeholder="e.g. 5" min="2" value={data.locationCount || ""} onChange={e => update("locationCount", e.target.value)} />
        </div>
      )}

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Special Instructions</label>
        <textarea style={styles.textarea} placeholder="Loading dock access, security check-in requirements, parking details, etc." rows={3} value={data.notes || ""} onChange={e => update("notes", e.target.value)} />
      </div>
    </div>
  );
};

/* ── Step 3: Vaccines ── */
const VaccineStep = ({ data, onChange }) => {
  const selectedVax = data.selectedVaccines || [];
  const selectedAddons = data.selectedAddons || [];

  const toggleVax = (id) => {
    const next = selectedVax.includes(id) ? selectedVax.filter(v => v !== id) : [...selectedVax, id];
    onChange({ ...data, selectedVaccines: next });
  };
  const toggleAddon = (id) => {
    const next = selectedAddons.includes(id) ? selectedAddons.filter(a => a !== id) : [...selectedAddons, id];
    onChange({ ...data, selectedAddons: next });
  };

  return (
    <div style={styles.stepContent}>
      <div style={styles.stepHeader}>
        <h2 style={styles.stepTitle}>Select vaccines & services</h2>
        <p style={styles.stepSubtitle}>Choose the vaccines your workforce needs. We'll bring everything onsite.</p>
      </div>

      <div style={styles.sectionLabel}>
        <Icon name="syringe" size={16} />
        <span>Vaccines & Screenings</span>
      </div>

      <div style={styles.vaccineGrid}>
        {VACCINES.map(v => {
          const isSelected = selectedVax.includes(v.id);
          return (
            <button
              key={v.id}
              onClick={() => toggleVax(v.id)}
              style={{
                ...styles.vaccineCard,
                ...(isSelected ? styles.vaccineCardSelected : {}),
              }}
            >
              <div style={styles.vaccineCardTop}>
                <div style={styles.vaccineInfo}>
                  <span style={{ ...styles.vaccineName, ...(isSelected ? { color: "#0B4F6C" } : {}) }}>{v.name}</span>
                  <span style={styles.vaccineDesc}>{v.desc}</span>
                </div>
                <div style={{ ...styles.vaccineCheck, ...(isSelected ? styles.vaccineCheckActive : {}) }}>
                  {isSelected && <Icon name="check" size={13} color="#fff" />}
                </div>
              </div>
              <div style={styles.vaccineCardBottom}>
                {v.popular && <span style={styles.popularBadge}>Popular</span>}
                <span style={styles.vaccinePrice}>
                  {v.price === 0 ? "No cost" : `$${v.price}`}
                  <span style={styles.vaccinePricePer}>/person</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ ...styles.sectionLabel, marginTop: 32 }}>
        <Icon name="plus" size={16} />
        <span>Add-On Services</span>
      </div>

      <div style={styles.addonGrid}>
        {ADDONS.map(a => {
          const isSelected = selectedAddons.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => toggleAddon(a.id)}
              style={{
                ...styles.addonCard,
                ...(isSelected ? styles.addonCardSelected : {}),
              }}
            >
              <div style={{ ...styles.vaccineCheck, ...(isSelected ? styles.vaccineCheckActive : {}), width: 20, height: 20 }}>
                {isSelected && <Icon name="check" size={11} color="#fff" />}
              </div>
              <div>
                <span style={{ ...styles.vaccineName, fontSize: 13.5, ...(isSelected ? { color: "#0B4F6C" } : {}) }}>{a.name}</span>
                <span style={{ ...styles.vaccineDesc, fontSize: 12 }}>{a.desc}</span>
              </div>
              <span style={{ ...styles.vaccinePrice, fontSize: 13, marginLeft: "auto" }}>
                {a.price === 0 ? "Included" : `+$${a.price}/person`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ── Step 4: Review ── */
const ReviewStep = ({ companyData, eventData, vaccineData }) => {
  const selectedVax = vaccineData.selectedVaccines || [];
  const selectedAddons = vaccineData.selectedAddons || [];
  const vaxItems = VACCINES.filter(v => selectedVax.includes(v.id));
  const addonItems = ADDONS.filter(a => selectedAddons.includes(a.id));

  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div style={styles.stepContent}>
      <div style={styles.stepHeader}>
        <h2 style={styles.stepTitle}>Review your request</h2>
        <p style={styles.stepSubtitle}>Confirm the details below. Our team will reach out within one business day with your custom quote.</p>
      </div>

      {/* Company */}
      <div style={styles.reviewSection}>
        <div style={styles.reviewSectionHeader}>
          <Icon name="building" size={16} color="#0B4F6C" />
          <span style={styles.reviewSectionTitle}>Company</span>
        </div>
        <div style={styles.reviewGrid}>
          <div style={styles.reviewItem}><span style={styles.reviewLabel}>Company</span><span style={styles.reviewValue}>{companyData.companyName || "—"}</span></div>
          <div style={styles.reviewItem}><span style={styles.reviewLabel}>Industry</span><span style={styles.reviewValue}>{companyData.industry || "—"}</span></div>
          <div style={styles.reviewItem}><span style={styles.reviewLabel}>Contact</span><span style={styles.reviewValue}>{companyData.contactName || "—"}{companyData.jobTitle ? `, ${companyData.jobTitle}` : ""}</span></div>
          <div style={styles.reviewItem}><span style={styles.reviewLabel}>Email</span><span style={styles.reviewValue}>{companyData.email || "—"}</span></div>
          <div style={styles.reviewItem}><span style={styles.reviewLabel}>Phone</span><span style={styles.reviewValue}>{companyData.phone || "—"}</span></div>
        </div>
      </div>

      {/* Event */}
      <div style={styles.reviewSection}>
        <div style={styles.reviewSectionHeader}>
          <Icon name="mapPin" size={16} color="#0B4F6C" />
          <span style={styles.reviewSectionTitle}>Event Details</span>
        </div>
        <div style={styles.reviewGrid}>
          <div style={styles.reviewItem}><span style={styles.reviewLabel}>Location</span><span style={styles.reviewValue}>{[eventData.address, eventData.city, eventData.state, eventData.zip].filter(Boolean).join(", ") || "—"}</span></div>
          <div style={styles.reviewItem}><span style={styles.reviewLabel}>Preferred Date</span><span style={styles.reviewValue}>{formatDate(eventData.preferredDate)}</span></div>
          {eventData.altDate && <div style={styles.reviewItem}><span style={styles.reviewLabel}>Alternate Date</span><span style={styles.reviewValue}>{formatDate(eventData.altDate)}</span></div>}
          <div style={styles.reviewItem}><span style={styles.reviewLabel}>Est. Employees</span><span style={styles.reviewValue}>{eventData.employeeRange || "—"}</span></div>
          {eventData.multiLocation === "yes" && <div style={styles.reviewItem}><span style={styles.reviewLabel}>Locations</span><span style={styles.reviewValue}>{eventData.locationCount || "Multiple"}</span></div>}
          {eventData.notes && <div style={{...styles.reviewItem, gridColumn: "1/-1"}}><span style={styles.reviewLabel}>Notes</span><span style={styles.reviewValue}>{eventData.notes}</span></div>}
        </div>
      </div>

      {/* Vaccines */}
      <div style={styles.reviewSection}>
        <div style={styles.reviewSectionHeader}>
          <Icon name="syringe" size={16} color="#0B4F6C" />
          <span style={styles.reviewSectionTitle}>Selected Vaccines & Services</span>
        </div>
        {vaxItems.length === 0 && addonItems.length === 0 ? (
          <p style={{ color: "#94A3B8", fontSize: 14, margin: 0 }}>No vaccines or services selected.</p>
        ) : (
          <div style={styles.reviewTagList}>
            {vaxItems.map(v => (
              <span key={v.id} style={styles.reviewTag}>
                {v.name}
                <span style={styles.reviewTagPrice}>{v.price === 0 ? "No cost" : `$${v.price}/person`}</span>
              </span>
            ))}
            {addonItems.map(a => (
              <span key={a.id} style={{ ...styles.reviewTag, background: "#F0FDF4", borderColor: "#BBF7D0" }}>
                {a.name}
                <span style={styles.reviewTagPrice}>{a.price === 0 ? "Included" : `+$${a.price}/person`}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimerBox}>
        <Icon name="info" size={16} color="#0B4F6C" />
        <p style={styles.disclaimerText}>
          By submitting, you're requesting a custom quote — not placing an order. Our team will confirm pricing, availability, and logistics within one business day. No obligation, no payment required now.
        </p>
      </div>
    </div>
  );
};

/* ── Submitted State ── */
const SubmittedScreen = ({ onReset }) => (
  <div style={styles.submittedWrap}>
    <div style={styles.submittedIcon}>
      <Icon name="check" size={36} color="#fff" />
    </div>
    <h2 style={styles.submittedTitle}>Request Submitted!</h2>
    <p style={styles.submittedDesc}>
      Thank you for your interest in onsite vaccination services. A member of our team will contact you within one business day with a customized quote and next steps.
    </p>
    <div style={styles.submittedCta}>
      <span style={styles.submittedCtaLabel}>Need something sooner?</span>
      <a href="tel:+18005551234" style={styles.phoneLink}>
        <Icon name="phone" size={15} /> (800) 555-1234
      </a>
    </div>
    <button onClick={onReset} style={styles.resetBtn}>Submit Another Request</button>
  </div>
);

/* ═══════════════════════════ MAIN APP ═══════════════════════════ */
export default function OnsiteVaxBooker() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [companyData, setCompanyData] = useState({});
  const [eventData, setEventData] = useState({});
  const [vaccineData, setVaccineData] = useState({ selectedVaccines: [], selectedAddons: [] });

  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [step]);

  const canProceed = () => {
    if (step === 0) return companyData.companyName && companyData.industry && companyData.contactName && companyData.email && companyData.phone;
    if (step === 1) return eventData.address && eventData.city && eventData.state && eventData.zip && eventData.preferredDate && eventData.employeeRange;
    if (step === 2) return (vaccineData.selectedVaccines?.length || 0) > 0;
    return true;
  };

  const handleSubmit = () => setSubmitted(true);

  const handleReset = () => {
    setStep(0);
    setSubmitted(false);
    setCompanyData({});
    setEventData({});
    setVaccineData({ selectedVaccines: [], selectedAddons: [] });
  };

  return (
    <div style={styles.pageWrap}>
      {/* Decorative bg */}
      <div style={styles.bgGrad} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}><Icon name="shield" size={20} color="#fff" /></div>
            <div>
              <span style={styles.logoText}>VaxOnsite</span>
              <span style={styles.logoSub}>Workplace Immunization Services</span>
            </div>
          </div>
          <a href="tel:+18005551234" style={styles.headerPhone}>
            <Icon name="phone" size={15} /> (800) 555-1234
          </a>
        </div>
      </header>

      <main style={styles.main}>
        {submitted ? (
          <div style={styles.card}><SubmittedScreen onReset={handleReset} /></div>
        ) : (
          <>
            <StepIndicator currentStep={step} />

            <div style={styles.card} ref={contentRef}>
              {step === 0 && <CompanyStep data={companyData} onChange={setCompanyData} />}
              {step === 1 && <EventStep data={eventData} onChange={setEventData} />}
              {step === 2 && <VaccineStep data={vaccineData} onChange={setVaccineData} />}
              {step === 3 && <ReviewStep companyData={companyData} eventData={eventData} vaccineData={vaccineData} />}

              {/* Nav */}
              <div style={styles.navRow}>
                {step > 0 && (
                  <button style={styles.backBtn} onClick={() => setStep(s => s - 1)}>
                    <Icon name="chevronLeft" size={16} /> Back
                  </button>
                )}
                <div style={{ flex: 1 }} />
                {step < STEPS.length - 1 ? (
                  <button
                    style={{ ...styles.nextBtn, ...(canProceed() ? {} : styles.nextBtnDisabled) }}
                    disabled={!canProceed()}
                    onClick={() => setStep(s => s + 1)}
                  >
                    Continue <Icon name="chevronRight" size={16} />
                  </button>
                ) : (
                  <button style={styles.submitBtn} onClick={handleSubmit}>
                    Submit Quote Request
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Trust bar */}
        <div style={styles.trustBar}>
          <span style={styles.trustItem}><Icon name="shield" size={14} color="#0B4F6C" /> HIPAA Compliant</span>
          <span style={styles.trustDot}>·</span>
          <span style={styles.trustItem}><Icon name="check" size={14} color="#0B4F6C" /> Licensed Pharmacists</span>
          <span style={styles.trustDot}>·</span>
          <span style={styles.trustItem}><Icon name="users" size={14} color="#0B4F6C" /> 5,000+ Events Completed</span>
        </div>
      </main>

      {/* fonts */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F1F5F9; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #0B4F6C !important; box-shadow: 0 0 0 3px rgba(11,79,108,.12) !important; }
        ::placeholder { color: #94A3B8; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════ STYLES ═══════════════════════════ */
const styles = {
  pageWrap: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#F1F5F9",
    color: "#1E293B",
    position: "relative",
    overflow: "hidden",
  },
  bgGrad: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    height: 320,
    background: "linear-gradient(135deg, #0B4F6C 0%, #14919B 60%, #0AD3B5 100%)",
    zIndex: 0,
  },

  /* Header */
  header: {
    position: "relative",
    zIndex: 10,
    padding: "16px 24px",
  },
  headerInner: {
    maxWidth: 880,
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: {
    width: 38, height: 38, borderRadius: 10,
    background: "rgba(255,255,255,.18)",
    display: "flex", alignItems: "center", justifyContent: "center",
    backdropFilter: "blur(8px)",
  },
  logoText: { display: "block", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1 },
  logoSub: { display: "block", fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 400, letterSpacing: "0.02em" },
  headerPhone: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 13.5, fontWeight: 600, color: "#fff",
    textDecoration: "none",
    background: "rgba(255,255,255,.15)",
    padding: "8px 14px",
    borderRadius: 8,
    backdropFilter: "blur(8px)",
    transition: "background .15s",
  },

  /* Main */
  main: {
    position: "relative",
    zIndex: 10,
    maxWidth: 880,
    margin: "0 auto",
    padding: "0 24px 40px",
  },

  /* Step Indicator */
  stepBar: {
    margin: "20px 0 24px",
    animation: "fadeUp .5s ease both",
  },
  stepTrack: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  stepItem: { display: "flex", alignItems: "center", gap: 8 },
  stepDot: {
    width: 28, height: 28, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(255,255,255,.2)",
    color: "rgba(255,255,255,.6)",
    fontSize: 12,
    transition: "all .25s",
    flexShrink: 0,
  },
  stepDotActive: {
    background: "#fff",
    color: "#0B4F6C",
    boxShadow: "0 2px 12px rgba(0,0,0,.15)",
  },
  stepDotComplete: {
    background: "#0AD3B5",
    color: "#fff",
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "rgba(255,255,255,.5)",
    transition: "color .25s",
    whiteSpace: "nowrap",
  },
  stepLabelActive: { color: "#fff", fontWeight: 600 },
  stepLabelComplete: { color: "rgba(255,255,255,.75)" },
  stepConnector: {
    width: 40,
    height: 2,
    background: "rgba(255,255,255,.2)",
    margin: "0 12px",
    borderRadius: 1,
    transition: "background .25s",
  },
  stepConnectorComplete: { background: "#0AD3B5" },

  /* Card */
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 4px 24px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.04)",
    overflow: "hidden",
    animation: "fadeUp .45s ease both",
    animationDelay: ".1s",
  },

  /* Step Content */
  stepContent: { padding: "32px 36px 12px" },
  stepHeader: { marginBottom: 28 },
  stepTitle: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#0F172A",
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 14.5,
    color: "#64748B",
    lineHeight: 1.5,
  },

  /* Form fields */
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 },
  label: {
    fontSize: 12.5,
    fontWeight: 600,
    color: "#475569",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    fontFamily: "'DM Mono', monospace",
  },
  input: {
    height: 44,
    padding: "0 14px",
    fontSize: 14.5,
    fontFamily: "'DM Sans', sans-serif",
    border: "1.5px solid #E2E8F0",
    borderRadius: 10,
    color: "#1E293B",
    background: "#FAFBFC",
    transition: "border-color .15s, box-shadow .15s",
    width: "100%",
  },
  select: {
    height: 44,
    padding: "0 14px",
    fontSize: 14.5,
    fontFamily: "'DM Sans', sans-serif",
    border: "1.5px solid #E2E8F0",
    borderRadius: 10,
    color: "#1E293B",
    background: "#FAFBFC",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    width: "100%",
    cursor: "pointer",
  },
  textarea: {
    padding: "12px 14px",
    fontSize: 14.5,
    fontFamily: "'DM Sans', sans-serif",
    border: "1.5px solid #E2E8F0",
    borderRadius: 10,
    color: "#1E293B",
    background: "#FAFBFC",
    resize: "vertical",
    width: "100%",
    lineHeight: 1.5,
  },
  formGrid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0 20px",
  },
  formGrid3: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "0 20px",
  },

  /* Vaccines */
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    fontWeight: 700,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontFamily: "'DM Mono', monospace",
    marginBottom: 14,
  },
  vaccineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
  },
  vaccineCard: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: "14px 16px",
    border: "1.5px solid #E2E8F0",
    borderRadius: 12,
    background: "#FAFBFC",
    cursor: "pointer",
    textAlign: "left",
    transition: "all .15s",
    fontFamily: "'DM Sans', sans-serif",
  },
  vaccineCardSelected: {
    borderColor: "#0B4F6C",
    background: "#F0F9FF",
    boxShadow: "0 0 0 3px rgba(11,79,108,.08)",
  },
  vaccineCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  vaccineInfo: { display: "flex", flexDirection: "column", gap: 2 },
  vaccineName: { fontSize: 14, fontWeight: 600, color: "#1E293B" },
  vaccineDesc: { fontSize: 12, color: "#94A3B8", lineHeight: 1.4 },
  vaccineCheck: {
    width: 22, height: 22, borderRadius: 6,
    border: "1.5px solid #CBD5E1",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    transition: "all .15s",
    background: "#fff",
  },
  vaccineCheckActive: {
    background: "#0B4F6C",
    borderColor: "#0B4F6C",
  },
  vaccineCardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  popularBadge: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#0B4F6C",
    background: "#E0F2FE",
    padding: "3px 8px",
    borderRadius: 5,
    fontFamily: "'DM Mono', monospace",
  },
  vaccinePrice: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },
  vaccinePricePer: {
    fontSize: 11,
    fontWeight: 400,
    color: "#94A3B8",
  },

  /* Addons */
  addonGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  addonCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    border: "1.5px solid #E2E8F0",
    borderRadius: 12,
    background: "#FAFBFC",
    cursor: "pointer",
    textAlign: "left",
    transition: "all .15s",
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
  },
  addonCardSelected: {
    borderColor: "#0B4F6C",
    background: "#F0F9FF",
    boxShadow: "0 0 0 3px rgba(11,79,108,.08)",
  },

  /* Review */
  reviewSection: {
    padding: "20px 0",
    borderBottom: "1px solid #F1F5F9",
  },
  reviewSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  reviewSectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0B4F6C",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    fontFamily: "'DM Mono', monospace",
  },
  reviewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 24px",
  },
  reviewItem: { display: "flex", flexDirection: "column", gap: 2 },
  reviewLabel: { fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em", fontFamily: "'DM Mono', monospace" },
  reviewValue: { fontSize: 14.5, color: "#1E293B", lineHeight: 1.4 },
  reviewTagList: { display: "flex", flexWrap: "wrap", gap: 8 },
  reviewTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 500,
    padding: "8px 14px",
    borderRadius: 8,
    background: "#F0F9FF",
    border: "1px solid #BAE6FD",
    color: "#0F172A",
  },
  reviewTagPrice: {
    fontSize: 11.5,
    fontWeight: 600,
    color: "#64748B",
    fontFamily: "'DM Mono', monospace",
  },

  disclaimerBox: {
    display: "flex",
    gap: 12,
    padding: "16px 18px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: 10,
    marginTop: 24,
    alignItems: "flex-start",
  },
  disclaimerText: { fontSize: 13, color: "#64748B", lineHeight: 1.55, margin: 0 },

  /* Nav */
  navRow: {
    display: "flex",
    alignItems: "center",
    padding: "18px 36px 28px",
    gap: 12,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    color: "#64748B",
    background: "transparent",
    border: "1.5px solid #E2E8F0",
    borderRadius: 10,
    cursor: "pointer",
    transition: "all .15s",
  },
  nextBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "12px 28px",
    fontSize: 14.5,
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    color: "#fff",
    background: "linear-gradient(135deg, #0B4F6C, #14919B)",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(11,79,108,.25)",
    transition: "all .15s",
  },
  nextBtnDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 32px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    color: "#fff",
    background: "linear-gradient(135deg, #0AD3B5 0%, #0B4F6C 100%)",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "0 2px 12px rgba(10,211,181,.3)",
    transition: "all .15s",
  },

  /* Trust bar */
  trustBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: "20px 0",
    fontSize: 12,
    color: "#64748B",
    fontWeight: 500,
    animation: "fadeUp .5s ease both",
    animationDelay: ".25s",
  },
  trustItem: { display: "flex", alignItems: "center", gap: 5 },
  trustDot: { color: "#CBD5E1" },

  /* Submitted */
  submittedWrap: {
    padding: "56px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  submittedIcon: {
    width: 68, height: 68, borderRadius: "50%",
    background: "linear-gradient(135deg, #0AD3B5, #14919B)",
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 24,
    boxShadow: "0 4px 20px rgba(10,211,181,.3)",
  },
  submittedTitle: { fontSize: 24, fontWeight: 700, color: "#0F172A", marginBottom: 10, letterSpacing: "-0.03em" },
  submittedDesc: { fontSize: 15, color: "#64748B", lineHeight: 1.6, maxWidth: 440, marginBottom: 28 },
  submittedCta: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 28,
  },
  submittedCtaLabel: { fontSize: 13, color: "#94A3B8", fontWeight: 500 },
  phoneLink: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 16, fontWeight: 700, color: "#0B4F6C", textDecoration: "none",
  },
  resetBtn: {
    padding: "10px 22px",
    fontSize: 13.5,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
    color: "#64748B",
    background: "#F1F5F9",
    border: "1px solid #E2E8F0",
    borderRadius: 8,
    cursor: "pointer",
  },
};
