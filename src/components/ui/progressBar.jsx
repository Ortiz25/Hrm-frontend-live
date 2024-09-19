import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export const ProgressBar = ({ progress = 0 }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div
        className="bg-blue-500 h-4 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// Step Forms for onboarding
export const Step1 = ({ nextStep, formData, setFormData }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Step 1: Personal Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name:</Label>
        <Input
          type="text"
          name="firstName"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name:</Label>
        <Input
          type="text"
          name="lastName"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.secondName}
          onChange={(e) =>
            setFormData({ ...formData, secondName: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="startDate">Email:</Label>
        <Input
          type="email"
          name="email"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number:</Label>
        <Input
          type="tel"
          name="phoneNumber"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Bank Account:</Label>
        <Input
          type="text"
          name="bankAccount"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">KRA Pin:</Label>
        <Input
          type="text"
          name="kraPin"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">NHIF Membership No:</Label>
        <Input
          type="text"
          name="nhifNo"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">NSSF Membership No:</Label>
        <Input
          type="text"
          name="nssf"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          required
        />
      </div>
    </div>
    <Button onClick={nextStep} className="mt-5">
      Next
    </Button>
  </div>
);

export const Step2 = ({ nextStep, prevStep, formData, setFormData }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Step 2: Position Information: </h3>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">Position:</Label>
        <Input
          type="text"
          name="position"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.position}
          onChange={(e) =>
            setFormData({ ...formData, position: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department"> Department:</Label>
        <Input
          type="text"
          name="department"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.department}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hire_date"> Hire date:</Label>
        <Input
          type="date"
          name="hire_date"
          className="mt-1 block w-full p-2 border rounded"
          value={formData.hire_date}
          onChange={(e) =>
            setFormData({ ...formData, department: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company:</Label>
        <Input
          type="text"
          name="company"
          className="mt-1 block w-full p-2 border rounded"
          value="Alibaba"
          diasabled
          required
        />
      </div>
    </div>
    <div className="flex justify-between my-5">
      <Button onClick={prevStep}>Previous</Button>
      <Button onClick={nextStep}>Next</Button>
    </div>
  </div>
);

export const Step3 = ({ nextStep, prevStep, formData, setFormData }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Step 3: Compensation</h3>
    <div className="grid grid-cols-2 gap-4">
      <Input
        name="salary"
        type="number"
        placeholder="Gross Salary"
        value={formData.salary}
        onChange={(e) =>
          setFormData({ ...formData, department: e.target.value })
        }
        required
      />
      <Input
        name="bonus"
        type="number"
        placeholder="Bonus"
        value={formData.bonus}
        onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
      />
      <Input
        name="tax"
        type="number"
        placeholder="Tax Deduction"
        value={formData.deductions.tax}
        onChange={(e) =>
          setFormData({
            ...formData,
            deductions: {
              ...formData.deductions, // Spread existing deductions
              tax: e.target.value, // Update the insurance field
            },
          })
        }
        required
      />
      <Input
        name="insurance"
        type="number"
        placeholder="Insurance Deduction"
        value={formData.deductions.insurance}
        onChange={(e) =>
          setFormData({
            ...formData,
            deductions: {
              ...formData.deductions, // Spread existing deductions
              insurance: e.target.value, // Update the insurance field
            },
          })
        }
      />
      <Input
        name="overtime"
        type="number"
        placeholder="Overtime Hours"
        value={formData.overtime}
        onChange={(e) => setFormData({ ...formData, overtime: e.target.value })}
      />
      <Input
        name="overtimeRate"
        type="number"
        placeholder="Overtime Rate"
        value={formData.overtimeRate}
        onChange={(e) =>
          setFormData({ ...formData, overtimeRate: e.target.value })
        }
      />
      <Input
        name="leave"
        type="number"
        placeholder="Leave Days"
        value={formData.leave}
        onChange={(e) => setFormData({ ...formData, leave: e.target.value })}
      />
    </div>
    <div className="flex justify-between mt-5">
      <Button onClick={prevStep}>Previous</Button>
      <Button onClick={nextStep}>Next</Button>
    </div>
  </div>
);

export const Step4 = ({ prevStep, formData }) => (
  <div>
    <h3 className="text-xl font-bold mb-4">Step 4: Complete Onboarding</h3>
    <p className="mb-4">Thank you for completing the onboarding process!</p>
    <div className="flex justify-between">
      <Button onClick={prevStep}>Previous</Button>
      <Button onClick={() => alert("Onboarding Complete!")}>Complete</Button>
    </div>
  </div>
);
