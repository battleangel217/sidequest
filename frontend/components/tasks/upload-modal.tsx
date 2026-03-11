'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle: string;
  onSubmit: (proof: string) => void;
  isLoading?: boolean;
}

export function UploadModal({
  open,
  onOpenChange,
  taskTitle,
  onSubmit,
  isLoading,
}: UploadModalProps) {
  const [proof, setProof] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // In a real app, you'd upload the file and get a URL
      setProof(file.name);
    }
  };

  const handleSubmit = () => {
    if (!proof.trim()) {
      return;
    }
    onSubmit(proof);
    setProof('');
    setFileName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Proof</DialogTitle>
          <DialogDescription>
            For: {taskTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Upload Proof (Video, Screenshot, etc)
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="proof-file"
                accept="image/*,video/*,application/pdf"
              />
              <label
                htmlFor="proof-file"
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors flex flex-col items-center gap-2"
              >
                <Upload className="w-6 h-6 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Click to upload</p>
                  <p className="text-xs">or drag and drop</p>
                </div>
              </label>
            </div>
            {fileName && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-muted rounded">
                <span className="text-sm text-foreground flex-1 truncate">{fileName}</span>
                <button
                  onClick={() => {
                    setFileName('');
                    setProof('');
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <Textarea
              placeholder="Add any context or notes about your submission..."
              value={proof && fileName ? proof + (proof.includes('\n') ? '' : '\n') : proof}
              onChange={(e) => setProof(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!proof.trim() || isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Proof'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
