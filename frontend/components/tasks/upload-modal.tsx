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
import { Upload, X, Image, Video, Loader2 } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
  onSubmit: (proof: string) => void;
  isLoading?: boolean;
}

export function UploadModal({
  open,
  onOpenChange,
  taskId,
  taskTitle,
  onSubmit,
  isLoading,
}: UploadModalProps) {
  const [proofText, setProofText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setProofText('');
    setImageFile(null);
    setVideoFile(null);
    setImagePreview('');
    setVideoPreview('');
  };

  const handleSubmit = async () => {
    if (!proofText.trim() && !imageFile && !videoFile) return;

    const currentUser = getCurrentUser();
    if (!currentUser) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      if (proofText.trim()) formData.append('proof_text', proofText);
      if (imageFile) formData.append('proof_image', imageFile);
      if (videoFile) formData.append('proof_video', videoFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/submit/${taskId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.access}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit proof');
      }

      onSubmit(proofText || 'proof submitted');
      resetForm();
      onOpenChange(false);

      toast({
        title: 'Proof Submitted!',
        description: 'Your submission is pending community admin approval.',
      });
    } catch (error: any) {
      console.error('Submit failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit proof. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const loading = isLoading || submitting;

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
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload Image (Screenshot, Photo)
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                id="proof-image"
                accept="image/*"
              />
              <label
                htmlFor="proof-image"
                className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors flex flex-col items-center gap-2"
              >
                <Image className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {imageFile ? imageFile.name : 'Click to upload image'}
                </p>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-2 relative rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full max-h-40 object-contain bg-black/5" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(''); }}
                  className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-background"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload Video (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleVideoChange}
                className="hidden"
                id="proof-video"
                accept="video/*"
              />
              <label
                htmlFor="proof-video"
                className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors flex flex-col items-center gap-2"
              >
                <Video className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {videoFile ? videoFile.name : 'Click to upload video'}
                </p>
              </label>
            </div>
            {videoPreview && (
              <div className="mt-2 relative rounded-lg overflow-hidden border">
                <video src={videoPreview} className="w-full max-h-40" controls />
                <button
                  onClick={() => { setVideoFile(null); setVideoPreview(''); }}
                  className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-background"
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
              value={proofText}
              onChange={(e) => setProofText(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={(!proofText.trim() && !imageFile && !videoFile) || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Proof
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
