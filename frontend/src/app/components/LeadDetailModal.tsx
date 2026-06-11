import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { adminAPI } from '../../services/adminApi';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  platform: string;
  status: string;
  message?: string;
  created_at: string;
  updated_at?: string;
}

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
}

export default function LeadDetailModal({ lead, onClose, onUpdate }: LeadDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    platform: lead.platform,
    status: lead.status,
    message: lead.message || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError('');
    setIsSaving(true);

    try {
      const updatedLead = await adminAPI.updateLead(lead.id, formData);
      onUpdate(updatedLead);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lead' : 'Lead Details'}</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            {isEditing ? (
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSaving}
              />
            ) : (
              <p className="text-gray-900">{lead.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            {isEditing ? (
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSaving}
              />
            ) : (
              <p className="text-gray-900">{lead.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            {isEditing ? (
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSaving}
              />
            ) : (
              <p className="text-gray-900">{lead.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            {isEditing ? (
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                disabled={isSaving}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Amazon">Amazon</option>
                <option value="Flipkart">Flipkart</option>
                <option value="Shopify">Shopify</option>
                <option value="WordPress">WordPress</option>
              </select>
            ) : (
              <p className="text-gray-900">{lead.platform}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSaving}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Rejected">Rejected</option>
              </select>
            ) : (
              <p className="text-gray-900">{lead.status}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            {isEditing ? (
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={isSaving}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{lead.message || 'No message'}</p>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Created: {new Date(lead.created_at).toLocaleString()}</p>
            {lead.updated_at && (
              <p>Last Updated: {new Date(lead.updated_at).toLocaleString()}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Edit
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
