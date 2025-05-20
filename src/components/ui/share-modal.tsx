import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define form schema
const formSchema = z.object({
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  uploadedBy: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDecline: () => void;
  onConfirm: (data: FormData) => void;
}

export function ShareModal({
  isOpen,
  onClose,
  onDecline,
  onConfirm,
}: ShareModalProps) {
  const [step, setStep] = useState<'initial' | 'form'>('initial');
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: "",
      state: "",
      uploadedBy: "",
    },
  });

  const handleNo = () => {
    onDecline();
    onClose();
  };

  const handleYes = () => {
    setStep('form');
  };

  const onSubmit = (data: FormData) => {
    onConfirm(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {step === 'initial' ? (
          <>
            <DialogHeader>
              <DialogTitle>Share WiFi Data</DialogTitle>
              <DialogDescription>
                Would you like to share this WiFi data with the community?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleNo}>
                No, Keep Private
              </Button>
              <Button onClick={handleYes}>
                Yes, Share
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Share WiFi Data</DialogTitle>
              <DialogDescription>
                Please provide some information about this data.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">
                    City
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className="col-span-3"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm col-span-3 col-start-2">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="state" className="text-right">
                    State
                  </Label>
                  <Input
                    id="state"
                    {...register("state")}
                    className="col-span-3"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm col-span-3 col-start-2">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="uploadedBy" className="text-right">
                    Uploaded By (Optional)
                  </Label>
                  <Input
                    id="uploadedBy"
                    {...register("uploadedBy")}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep('initial')}>
                  Back
                </Button>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}