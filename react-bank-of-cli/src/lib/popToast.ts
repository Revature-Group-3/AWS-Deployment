import { toast } from "@/components/ui/toast";

export const popToast = (success: boolean, successMsg: string, failMsg: string) => {
  toast.add({
    type: success ? "success" : "error",
    title: success ? successMsg : failMsg,
  });
};
