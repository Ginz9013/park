import DialogTemplate from "../DialogTemplate";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import { Map } from "lucide-react";


const UploadUrl = () => {

  const { isMobile } = useMobile();
  const [open, setOpen] = useState<boolean>(false);

  return <>
    {/* Trigger 按鈕 */}
    <Button
      onClick={() => setOpen(true)}
      className="botton-background-gradient text-black cursor-pointer"
    >
      Submit URL
    </Button>

    {/* 彈跳視窗內容 */}
    <DialogTemplate
      open={open}
      setOpen={setOpen}
      className="gap-4 text-center"
    >
      {/* Icon */}
      <img src="./images/wheel/video-finished.png" alt="Video Finished" />

      {/* 文字 */}
      <h2 className="text-3xl">Submitted successfully</h2>
      <p>Come Back tomorrow and get more points!</p>
      <p className="font-bold">+3 point</p>


      {/* 按鈕群 */}
      <div className={cn(
        "w-full flex gap-4",
        isMobile && "flex-col"
      )}>
        <Button className="buttonn-border-gradient flex-1 cursor-pointer"><Map /></Button>
        <Button className="botton-background-gradient flex-1 text-black cursor-pointer" >Back to Ferris Wheel</Button>
      </div>
    </DialogTemplate>
  </>;
};

export default UploadUrl;