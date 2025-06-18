import { useState } from "react";
import { StatusMessage } from "@types";
import ExperienceService from "@services/ExperienceService";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

const CreateExperienceForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [statusMessage, setStatusMessage] = useState<StatusMessage>();
  // Form data state - Gleb
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    location: ""
  });

  const clearErrors = () => {
    setStatusMessage(undefined);
  };

  const validate = (): boolean => {
    const inputDate = new Date(formData.date);
    const now = new Date();
    if (inputDate <= now) {
      setStatusMessage({type: "error", message: "Event date must be in the future"});
      return false;
    }
    return true;
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!validate()) {
      return;
    }

    const response = await ExperienceService.createExperience(
      {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        location: formData.location
      });
    if (response.ok) {
      setStatusMessage({type: "success", message: "Experience created successfully!" });
      onSuccess();
    } else {
      const errorData = await response.json().catch(() => null);
      setStatusMessage({type: "error", message: errorData?.message || response.statusText });
    }
  };

    const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (statusMessage?.type === "error") {
      clearErrors();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New Experience</h2>

      {statusMessage && (
        <div
          className={`mb-4 p-3 rounded ${
            statusMessage.type === "error"
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          {statusMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Experience Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter experience name"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the experience"
          />
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date *
          </label>
          <input
            type="datetime-local"
            id="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter location"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg px-4 py-2"
          >
            Create Experience
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg px-4 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExperienceForm;
