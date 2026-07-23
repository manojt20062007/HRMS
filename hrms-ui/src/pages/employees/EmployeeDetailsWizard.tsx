import React, { useState, useRef } from 'react';
import { ArrowLeft, Check, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Step2Family,
  Step3Bank,
  Step4Address,
  Step5Qualification,
  Step6Experience,
  Step7Certificates,
  Step8Professional
} from './wizard/Steps';

const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Family' },
  { id: 3, label: 'Bank' },
  { id: 4, label: 'Address' },
  { id: 5, label: 'Qualification' },
  { id: 6, label: 'Experience' },
  { id: 7, label: 'Certificates' },
  { id: 8, label: 'Professional' },
];

// File Upload Component
const FileInput = ({
  label,
  hint,
  accept,
  value,
  onChange,
  viewUrl,
}: {
  label: string;
  hint?: string;
  accept: string;
  value: File | null;
  onChange: (f: File | null) => void;
  viewUrl?: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {hint && <span className="text-xs text-slate-500 font-normal ml-1">({hint})</span>}
        <span className="text-red-500 ml-1">*</span>
        {viewUrl && (
          <a href={viewUrl} target="_blank" rel="noreferrer" className="text-teal-500 text-xs ml-2 cursor-pointer">(View File)</a>
        )}
      </label>
      <div
        className="flex border border-slate-300 rounded-lg overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <span className="bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 border-r border-slate-300 whitespace-nowrap">
          Choose File
        </span>
        <span className="px-4 py-2.5 text-sm text-slate-500 bg-slate-50 flex-1 truncate">
          {value ? value.name : 'No file chosen'}
        </span>
        {value && (
          <button
            type="button"
            className="px-2 text-red-400 hover:text-red-600 bg-slate-50"
            onClick={e => { e.stopPropagation(); onChange(null); if (inputRef.current) inputRef.current.value = ''; }}
          >
            ✕
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
};

export const EmployeeDetailsWizard = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    nameAsAadhaar: '',
    email: '',
    mobile: '',
    aadhaarNo: '',
    panNo: '',
    nationality: '',
    gender: '',
    dob: '',
    age: '',
    bloodGroup: '',
    religion: '',
    maritalStatus: '',
    physicallyChallenged: '',
    password: '',

    // Arrays for dynamic tables
    families: [],
    qualifications: [],
    experiences: [],
    certificates: [],

    // Nested objects
    bank: {},
    address: {},
  });

  // File state (kept separately since File objects can't be JSON serialized)
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'dob') {
      // Auto-calculate age
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setFormData((prev: any) => ({ ...prev, dob: value, age: isNaN(age) ? '' : String(age) }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveAndNext = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      setError('First Name, Last Name and Email are required fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Always use JSON — backend uses express.json() and doesn't have multer for multipart.
      // Store selected file names as metadata so they're saved as references.
      const payload = {
        ...formData,
        photoFileName: photoFile?.name || null,
        aadhaarFileName: aadhaarFile?.name || null,
        panFileName: panFile?.name || null,
      };

      const response = await fetch('http://localhost:3001/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save employee data');
      }

      const result = await response.json();

      // Store the created employee ID so subsequent steps update the same record
      if (result.id && !formData.employeeId) {
        setFormData((prev: any) => ({ ...prev, employeeId: result.id }));
      }

      if (activeStep < 8) {
        setActiveStep(activeStep + 1);
      } else {
        alert('Employee Onboarding Completed Successfully!');
        navigate('/employees/all');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen bg-[#F8FAFC]">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Employee Details</h1>
          <div className="flex items-center text-sm">
            <span className="text-teal-500 cursor-pointer hover:underline">User Management</span>
            <span className="text-slate-400 mx-2">{'>'}</span>
            <span className="text-slate-500">Employee Details</span>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full font-medium hover:bg-indigo-100 transition-colors border border-indigo-100 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Stepper Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 overflow-x-auto">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center min-w-[80px] gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-colors ${
                  activeStep === step.id
                    ? 'border-blue-600 text-blue-600'
                    : activeStep > step.id
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-slate-300 text-slate-400'
                }`}
              >
                {activeStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span className={`text-xs font-semibold text-center ${activeStep === step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Personal Form */}
        {activeStep === 1 && (
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-6">

              {/* Row 1 */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">First Name<span className="text-red-500">*</span></label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter first name" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Last Name<span className="text-red-500">*</span></label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter last name" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Name as per Aadhaar<span className="text-red-500">*</span></label>
                <input type="text" name="nameAsAadhaar" value={formData.nameAsAadhaar} onChange={handleChange} placeholder="As per Aadhaar card" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              <FileInput
                label="Photo"
                hint="JPG, JPEG or PNG (Max 3MB)"
                accept="image/jpeg,image/png,image/jpg"
                value={photoFile}
                onChange={setPhotoFile}
              />

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Password <span className="text-red-500">*</span></label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Set login password" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              {/* Row 2 */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Personal Email<span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="personal@email.com" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Mobile Number<span className="text-red-500">*</span></label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="10-digit mobile number" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Aadhaar No<span className="text-red-500">*</span></label>
                <input type="text" name="aadhaarNo" value={formData.aadhaarNo} onChange={handleChange} placeholder="12-digit Aadhaar number" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              <FileInput
                label="Aadhaar"
                hint="PDF (Max 2MB)"
                accept=".pdf"
                value={aadhaarFile}
                onChange={setAadhaarFile}
              />

              {/* Row 3 */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">PAN No<span className="text-red-500">*</span></label>
                <input type="text" name="panNo" value={formData.panNo} onChange={handleChange} placeholder="ABCDE1234F" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
              </div>

              <FileInput
                label="PAN"
                hint="JPG, JPEG, PNG, or PDF (Max 2MB)"
                accept="image/*,.pdf"
                value={panFile}
                onChange={setPanFile}
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nationality<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 appearance-none bg-white focus:border-blue-500 outline-none">
                    <option value="">Select nationality</option>
                    <option>India</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 block">Gender<span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6 mt-2">
                  {['Male', 'Female', 'Other'].map(g => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm text-slate-700">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 4 */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">DOB<span className="text-red-500">*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 focus:border-blue-500 outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Age</label>
                <input type="text" name="age" value={formData.age} readOnly className="w-full pl-3 py-2.5 border border-slate-200 bg-slate-50 rounded-lg text-slate-600" />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Blood Group<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 appearance-none bg-white outline-none">
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Religion<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="religion" value={formData.religion} onChange={handleChange} className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 appearance-none bg-white outline-none">
                    {['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other'].map(r => <option key={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Row 5 */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Marital Status<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 appearance-none bg-white outline-none">
                    {['Unmarried', 'Married', 'Divorced', 'Widowed'].map(ms => <option key={ms}>{ms}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Physically Challenged<span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="physicallyChallenged" value={formData.physicallyChallenged} onChange={handleChange} className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 appearance-none bg-white outline-none">
                    <option value="">Select option</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Dynamic Steps 2 to 8 */}
        {activeStep === 2 && <Step2Family formData={formData} setFormData={setFormData} handleChange={handleChange} />}
        {activeStep === 3 && <Step3Bank formData={formData} handleChange={handleChange} />}
        {activeStep === 4 && <Step4Address formData={formData} handleChange={handleChange} />}
        {activeStep === 5 && <Step5Qualification formData={formData} setFormData={setFormData} handleChange={handleChange} />}
        {activeStep === 6 && <Step6Experience formData={formData} setFormData={setFormData} handleChange={handleChange} />}
        {activeStep === 7 && <Step7Certificates formData={formData} setFormData={setFormData} handleChange={handleChange} />}
        {activeStep === 8 && <Step8Professional formData={formData} handleChange={handleChange} />}

        {/* Error on non-step-1 */}
        {activeStep > 1 && error && (
          <div className="mx-8 mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Global Action Bar */}
        <div className="flex justify-center gap-4 border-t border-slate-100 pt-6 pb-6">
          {activeStep > 1 && (
            <button
              onClick={() => setActiveStep(activeStep - 1)}
              className="flex items-center gap-2 px-8 py-3 bg-white text-slate-600 rounded-full font-bold shadow-sm hover:shadow-md transition-all border border-slate-200"
            >
              <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                <ArrowLeft className="w-3 h-3" />
              </div>
              Previous
            </button>
          )}

          <button
            onClick={handleSaveAndNext}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (activeStep === 8 ? 'Save & Finish' : 'Save & Next')}
            {activeStep < 8 && !isLoading && (
              <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
