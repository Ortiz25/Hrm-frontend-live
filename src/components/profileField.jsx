import { Input } from "./ui/input";

const ProfileField = ({
  icon: Icon,
  label,
  value,
  isEditing,
  name,
  onChange,
}) => (
  <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 transition-all duration-300 hover:bg-gray-100">
    <Icon className="text-gray-800" size={24} />
    <div className="flex-grow">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {isEditing && name !== "email" ? (
        <Input
          type="text"
          name={name}
          placeholder={value}
          className="mt-1"
          required
        />
      ) : (
        <p className="text-lg font-semibold">{value}</p>
      )}
    </div>
  </div>
);

export default ProfileField;
