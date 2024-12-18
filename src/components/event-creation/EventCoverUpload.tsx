import { Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EventCoverUploadProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

export const EventCoverUpload = ({ imageUrl, setImageUrl }: EventCoverUploadProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `event-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative h-64 bg-opacity-20 bg-white rounded-lg overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt="Event cover" className="w-full h-full object-cover" />
      ) : (
        <div className="flex items-center justify-center h-full">
          <label className="cursor-pointer flex flex-col items-center">
            <Upload className="h-12 w-12 mb-2" />
            <span>Upload Cover Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
};