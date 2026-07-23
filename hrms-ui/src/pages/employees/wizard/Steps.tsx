import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Plus, Trash2 } from 'lucide-react';

export const Step2Family = ({ formData, setFormData, handleChange }: any) => {
  const addFamily = () => {
    setFormData({ ...formData, families: [...formData.families, { name: '', relation: '', dob: '', bloodGroup: '', occupation: '' }] });
  };
  const removeFamily = (index: number) => {
    const newF = [...formData.families];
    newF.splice(index, 1);
    setFormData({ ...formData, families: newF });
  };
  const handleChangeLocal = (index: number, e: any) => {
    const newF = [...formData.families];
    newF[index][e.target.name] = e.target.value;
    setFormData({ ...formData, families: newF });
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Family Details</h3>
      {formData.families.map((f: any, i: number) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div>
            <label className="text-sm font-medium text-slate-700">Name</label>
            <input type="text" name="name" value={f.name} onChange={(e) => handleChangeLocal(i, e)} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Relation</label>
            <input type="text" name="relation" value={f.relation} onChange={(e) => handleChangeLocal(i, e)} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">DOB</label>
            <input type="date" name="dob" value={f.dob} onChange={(e) => handleChangeLocal(i, e)} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Blood Group</label>
            <input type="text" name="bloodGroup" value={f.bloodGroup} onChange={(e) => handleChangeLocal(i, e)} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => removeFamily(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
          </div>
        </div>
      ))}
      <button onClick={addFamily} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"><Plus className="w-4 h-4"/> Add More</button>
    </div>
  );
};

export const Step3Bank = ({ formData, handleChange }: any) => {
  return (
    <div className="p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Bank Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700">Bank Name<span className="text-red-500">*</span></label>
          <input type="text" name="bankName" value={formData.bank?.bankName || ''} onChange={(e) => handleChange({ target: { name: 'bank', value: { ...formData.bank, bankName: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Account Name<span className="text-red-500">*</span></label>
          <input type="text" name="accountName" value={formData.bank?.accountName || ''} onChange={(e) => handleChange({ target: { name: 'bank', value: { ...formData.bank, accountName: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Account Number<span className="text-red-500">*</span></label>
          <input type="text" name="accountNumber" value={formData.bank?.accountNumber || ''} onChange={(e) => handleChange({ target: { name: 'bank', value: { ...formData.bank, accountNumber: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">IFSC Code<span className="text-red-500">*</span></label>
          <input type="text" name="ifscCode" value={formData.bank?.ifscCode || ''} onChange={(e) => handleChange({ target: { name: 'bank', value: { ...formData.bank, ifscCode: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
      </div>
    </div>
  );
};

export const Step4Address = ({ formData, handleChange }: any) => {
  return (
    <div className="p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Address Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-slate-700">Street<span className="text-red-500">*</span></label>
          <input type="text" name="street" value={formData.address?.street || ''} onChange={(e) => handleChange({ target: { name: 'address', value: { ...formData.address, street: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">City<span className="text-red-500">*</span></label>
          <input type="text" name="city" value={formData.address?.city || ''} onChange={(e) => handleChange({ target: { name: 'address', value: { ...formData.address, city: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">State<span className="text-red-500">*</span></label>
          <input type="text" name="state" value={formData.address?.state || ''} onChange={(e) => handleChange({ target: { name: 'address', value: { ...formData.address, state: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Zip Code<span className="text-red-500">*</span></label>
          <input type="text" name="zipCode" value={formData.address?.zipCode || ''} onChange={(e) => handleChange({ target: { name: 'address', value: { ...formData.address, zipCode: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Country<span className="text-red-500">*</span></label>
          <input type="text" name="country" value={formData.address?.country || ''} onChange={(e) => handleChange({ target: { name: 'address', value: { ...formData.address, country: e.target.value } } })} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" />
        </div>
      </div>
    </div>
  );
};

export const Step5Qualification = ({ formData, setFormData, handleChange }: any) => {
  const addQual = () => setFormData({ ...formData, qualifications: [...formData.qualifications, { degree: '', institution: '', yearOfPassing: '' }] });
  const removeQual = (index: number) => {
    const n = [...formData.qualifications];
    n.splice(index, 1);
    setFormData({ ...formData, qualifications: n });
  };
  const handleChangeLocal = (index: number, e: any) => {
    const n = [...formData.qualifications];
    n[index][e.target.name] = e.target.value;
    setFormData({ ...formData, qualifications: n });
  };
  return (
    <div className="p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Qualifications</h3>
      {formData.qualifications.map((q: any, i: number) => (
        <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div><label className="text-sm font-medium text-slate-700">Degree</label><input type="text" name="degree" value={q.degree} onChange={(e) => handleChangeLocal(i, e)} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" /></div>
          <div><label className="text-sm font-medium text-slate-700">Institution</label><input type="text" name="institution" value={q.institution} onChange={(e) => handleChangeLocal(i, e)} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" /></div>
          <div><label className="text-sm font-medium text-slate-700">Year</label><input type="text" name="yearOfPassing" value={q.yearOfPassing} onChange={(e) => handleChangeLocal(i, e)} className="w-full pl-3 py-2 border border-slate-300 rounded-lg text-slate-700" /></div>
          <div className="flex gap-2"><button onClick={() => removeQual(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5"/></button></div>
        </div>
      ))}
      <button onClick={addQual} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"><Plus className="w-4 h-4"/> Add More</button>
    </div>
  );
};

export const Step6Experience = ({ formData, setFormData, handleChange }: any) => {
  const addExp = () => setFormData({ ...formData, experiences: [...formData.experiences, { jobTitle: '', companyName: '', startDate: '', endDate: '' }] });
  const removeExp = (index: number) => {
    const n = [...formData.experiences];
    n.splice(index, 1);
    setFormData({ ...formData, experiences: n });
  };
  const handleChangeLocal = (index: number, e: any) => {
    const n = [...formData.experiences];
    n[index][e.target.name] = e.target.value;
    setFormData({ ...formData, experiences: n });
  };
  return (
    <div className="p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Experience</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div><label className="text-sm font-medium text-slate-700">Experience Type</label><select name="experienceType" value={formData.experienceType} onChange={handleChange} className="w-full pl-3 py-2 border border-slate-300 rounded-lg bg-white"><option>Experienced</option><option>Fresher</option></select></div>
        <div><label className="text-sm font-medium text-slate-700">Total Years</label><input type="text" name="totalExperienceYears" value={formData.totalExperienceYears} onChange={handleChange} className="w-full pl-3 py-2 border border-slate-300 rounded-lg" /></div>
        <div><label className="text-sm font-medium text-slate-700">Reference Name</label><input type="text" name="referenceName" value={formData.referenceName} onChange={handleChange} className="w-full pl-3 py-2 border border-slate-300 rounded-lg" /></div>
      </div>
      
      {/* Dynamic Table as per screenshot */}
      <div className="w-full overflow-x-auto border border-slate-200 rounded-lg mb-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#EEF2F6] text-slate-700">
            <tr><th className="px-4 py-3 font-semibold">Job Title</th><th className="px-4 py-3 font-semibold">Company Name</th><th className="px-4 py-3 font-semibold">Start Date</th><th className="px-4 py-3 font-semibold">End Date</th><th className="px-4 py-3 font-semibold">Document</th><th className="px-4 py-3 font-semibold">Action</th></tr>
          </thead>
          <tbody>
            {formData.experiences.map((exp: any, i: number) => (
              <tr key={i} className="border-t border-slate-200">
                <td className="px-4 py-3"><input type="text" name="jobTitle" value={exp.jobTitle} onChange={(e) => handleChangeLocal(i, e)} className="w-full border border-slate-300 rounded px-2 py-1" /></td>
                <td className="px-4 py-3"><input type="text" name="companyName" value={exp.companyName} onChange={(e) => handleChangeLocal(i, e)} className="w-full border border-slate-300 rounded px-2 py-1" /></td>
                <td className="px-4 py-3"><input type="date" name="startDate" value={exp.startDate} onChange={(e) => handleChangeLocal(i, e)} className="w-full border border-slate-300 rounded px-2 py-1" /></td>
                <td className="px-4 py-3"><input type="date" name="endDate" value={exp.endDate} onChange={(e) => handleChangeLocal(i, e)} className="w-full border border-slate-300 rounded px-2 py-1" /></td>
                <td className="px-4 py-3">
                  <label className="flex cursor-pointer">
                    <span className="px-2 py-1 bg-slate-200 border border-slate-300 rounded-l text-xs font-medium text-slate-700 whitespace-nowrap">
                      Choose File
                    </span>
                    <span className="px-2 py-1 bg-slate-50 border border-l-0 border-slate-300 rounded-r text-xs text-slate-500 flex-1 truncate max-w-[120px]">
                      {exp.documentFile ? exp.documentFile.name : 'No file chosen'}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const n = [...formData.experiences];
                        n[i] = { ...n[i], documentFile: e.target.files?.[0] ?? null };
                        setFormData({ ...formData, experiences: n });
                      }}
                    />
                  </label>
                </td>
                <td className="px-4 py-3 text-center"><button onClick={() => removeExp(i)} className="text-slate-500 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addExp} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add More</button>
    </div>
  );
};

export const Step7Certificates = ({ formData, setFormData }: any) => {
  const addCert = () => setFormData({ ...formData, certificates: [...formData.certificates, { name: '' }] });
  const removeCert = (index: number) => {
    const n = [...formData.certificates];
    n.splice(index, 1);
    setFormData({ ...formData, certificates: n });
  };
  const handleChangeLocal = (index: number, e: any) => {
    const n = [...formData.certificates];
    n[index][e.target.name] = e.target.value;
    setFormData({ ...formData, certificates: n });
  };
  return (
    <div className="p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Certificates</h3>
      
      {/* Dynamic Table as per screenshot */}
      <div className="w-full overflow-x-auto border border-slate-200 rounded-lg mb-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#EEF2F6] text-slate-700">
            <tr><th className="px-4 py-3 font-semibold">Name</th><th className="px-4 py-3 font-semibold text-center">Document</th><th className="px-4 py-3 font-semibold text-center">Action</th></tr>
          </thead>
          <tbody>
            {formData.certificates.map((cert: any, i: number) => (
              <tr key={i} className="border-t border-slate-200">
                <td className="px-4 py-3 w-1/2"><input type="text" name="name" value={cert.name} onChange={(e) => handleChangeLocal(i, e)} className="w-full border border-slate-300 rounded px-3 py-2" placeholder="e.g. IIT Bombay Certification" /></td>
                <td className="px-4 py-3 text-center">
                  <label className="flex justify-center cursor-pointer">
                    <div className="flex bg-slate-100 rounded overflow-hidden text-sm border border-slate-200 w-64">
                      <span className="px-3 py-1.5 bg-slate-200 border-r border-slate-300 font-medium text-slate-700 whitespace-nowrap">
                        Choose File
                      </span>
                      <span className="px-3 py-1.5 text-slate-400 text-left flex-1 truncate">
                        {cert.documentFile ? cert.documentFile.name : 'No file chosen'}
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const n = [...formData.certificates];
                        n[i] = { ...n[i], documentFile: e.target.files?.[0] ?? null };
                        setFormData({ ...formData, certificates: n });
                      }}
                    />
                  </label>
                </td>
                <td className="px-4 py-3 text-center"><button onClick={() => removeCert(i)} className="text-slate-500 hover:text-red-500"><Trash2 className="w-5 h-5 mx-auto"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addCert} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add More</button>
    </div>
  );
};

export const Step8Professional = ({ formData, handleChange }: any) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tenantHeaders = { 'x-tenant-id': 'pmj.com' };
    Promise.all([
      fetch('http://localhost:3001/api/settings/departments', { headers: tenantHeaders }).then(r => r.json()),
      fetch('http://localhost:3001/api/settings/designations', { headers: tenantHeaders }).then(r => r.json()),
    ])
      .then(([depts, desigs]) => {
        setDepartments(Array.isArray(depts) ? depts : []);
        setDesignations(Array.isArray(desigs) ? desigs : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Professional Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

        <div>
          <label className="text-sm font-medium text-slate-700">Employee ID<span className="text-red-500">*</span></label>
          <div className="relative">
            <input type="text" name="employeeIdString" value={formData.employeeIdString || ''} onChange={handleChange} placeholder="e.g. EMP001" className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 outline-none focus:border-indigo-500" />
            {formData.employeeIdString && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Professional Email<span className="text-red-500">*</span></label>
          <div className="relative">
            <input type="email" name="professionalEmail" value={formData.professionalEmail || ''} onChange={handleChange} placeholder="work@company.com" className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 outline-none focus:border-indigo-500" />
            {formData.professionalEmail && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
          </div>
        </div>

        {/* Department — dynamic dropdown */}
        <div>
          <label className="text-sm font-medium text-slate-700">Department<span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 appearance-none bg-white outline-none focus:border-indigo-500 disabled:opacity-60"
            >
              <option value="">{loading ? 'Loading departments...' : '— Select Department —'}</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {departments.length === 0 && !loading && (
            <p className="text-xs text-amber-600 mt-1">No departments found. <a href="/settings/employee/department" target="_blank" className="underline">Add one here →</a></p>
          )}
        </div>

        {/* Designation — dynamic dropdown */}
        <div>
          <label className="text-sm font-medium text-slate-700">Designation<span className="text-red-500">*</span></label>
          <div className="relative">
            <select
              name="designation"
              value={formData.designation || ''}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 appearance-none bg-white outline-none focus:border-indigo-500 disabled:opacity-60"
            >
              <option value="">{loading ? 'Loading designations...' : '— Select Designation —'}</option>
              {designations.map((d: any) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {designations.length === 0 && !loading && (
            <p className="text-xs text-amber-600 mt-1">No designations found. <a href="/settings/employee/designation" target="_blank" className="underline">Add one here →</a></p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Employment Status<span className="text-red-500">*</span></label>
          <div className="relative">
            <select name="employmentStatus" value={formData.employmentStatus || 'Probation'} onChange={handleChange} className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 appearance-none bg-white outline-none focus:border-indigo-500">
              <option>Probation</option>
              <option>Permanent</option>
              <option>Contract</option>
              <option>Intern</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Joining Date<span className="text-red-500">*</span></label>
          <div className="relative">
            <input type="date" name="joiningDate" value={formData.joiningDate || ''} onChange={handleChange} className="w-full pl-3 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-indigo-500" />
            {formData.joiningDate && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Salary<span className="text-red-500">*</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
            <input type="number" name="salary" value={formData.salary || ''} onChange={handleChange} placeholder="0.00" className="w-full pl-7 pr-10 py-2.5 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-indigo-500" />
            {formData.salary && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">PF No</label>
          <input type="text" name="pfNo" value={formData.pfNo || ''} onChange={handleChange} placeholder="Optional" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-indigo-500" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">ESI No</label>
          <input type="text" name="esiNo" value={formData.esiNo || ''} onChange={handleChange} placeholder="Optional" className="w-full pl-3 py-2.5 border border-slate-300 rounded-lg text-slate-700 outline-none focus:border-indigo-500" />
        </div>

      </div>
    </div>
  );
};
