import useMobile from "@/hooks/useMobile";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { X } from "lucide-react";
type DialogTemplateProps = {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
  zIndex?: number;
  closeButton?: boolean;
  onClose?: () => void;
};

const DialogTemplate: React.FC<DialogTemplateProps> = ({
  children,
  open,
  setOpen,
  className,
  zIndex,
  closeButton = true,
  onClose,
}) => {
  const { isMobile } = useMobile();

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "bg-black/70 text-white fixed md:absolute top-0 left-0 w-full h-full  flex flex-col items-center justify-center",
        zIndex && `z-[${zIndex}]`,
      )}
    >
      {/* 主要內容 */}
      <div
        className={cn(
          "dialog-background-gradient flex flex-col items-center rounded-3xl relative max-h-[85vh] overflow-scroll",
          isMobile ? "w-[90vw] py-16 px-12" : "w-[70vw] p-16",
          className
        )}
      >
        {/* 右上角 X */}
        {closeButton && (
          <Button
            variant="ghost"
            className="absolute top-4 right-4 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              onClose && onClose();
            }}
          >
            <X />
          </Button>
        )}

        {children}
      </div>
    </motion.div>
  );
};

export default DialogTemplate;
