import { useState } from "react";
import DialogTemplate from "../DialogTemplate";
import useMobile from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { authService } from "@/services/authService";
import Voted from "./Voted";
import { playSound } from "@/utils/sound";

type CheckToVoteProps = {
  articleId: number;
  onVoteSuccess?: () => void;
};

const CheckToVote: React.FC<CheckToVoteProps> = ({
  articleId,
  onVoteSuccess,
}) => {
  const { isMobile } = useMobile();
  const [open, setOpen] = useState<boolean>(false);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [showVotedDialog, setShowVotedDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);

  const handleVote = async () => {
    setIsVoting(true);
    try {
      const result = await authService.voteArticle(articleId.toString());
      // 檢查投票結果
      if (result && result.success) {
        setOpen(false); // 關閉確認對話框
        setShowVotedDialog(true); // 顯示投票成功對話框
        onVoteSuccess?.();
        playSound("./sound/vote_success.wav");
      } else {
        // 投票失敗，顯示錯誤訊息
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("投票失敗:", error);
      setShowErrorDialog(true);
    } finally {
      setIsVoting(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <button className="cursor-pointer" onClick={() => setOpen(true)}>
        <img
          src="./images/wheel/vote.png"
          alt="Vote"
          className="w-12 aspect-square"
        />
        <p>Vote</p>
      </button>

      <DialogTemplate
        open={open}
        setOpen={setOpen}
        className={cn(isMobile ? "" : "w-auto max-w-[40vw]")}
      >
        <h2 className="text-3xl text-center mb-12 font-TTNormsProMedium">
          Are you sure want to vote for this entry?
        </h2>

        {/* 按鈕群 */}
        <div className={cn("w-full flex gap-4", isMobile && "flex-col")}>
          <Button
            className="buttonn-border-gradient flex-1"
            onClick={handleCancel}
            disabled={isVoting}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-[#0C5E99] to-[#149CFF] text-white"
            onClick={handleVote}
            disabled={isVoting}
          >
            {isVoting ? "Voting..." : "Confirm Vote"}
          </Button>
        </div>
      </DialogTemplate>

      {/* 投票成功對話框 */}
      <Voted open={showVotedDialog} setOpen={setShowVotedDialog} />

      {/* 錯誤對話框 */}
      <DialogTemplate
        open={showErrorDialog}
        setOpen={setShowErrorDialog}
        className={cn(isMobile ? "" : "w-auto max-w-[40vw]")}
      >
        <div className="text-center">
          <h2 className="text-3xl text-white mb-4">Failed To Vote</h2>
          <p className="text-lg mb-8">
            You have already voted. Please try again tomorrow. Thank you!
          </p>
          <Button
            className="buttonn-border-gradient"
            onClick={() => setShowErrorDialog(false)}
          >
            Confirm
          </Button>
        </div>
      </DialogTemplate>
    </>
  );
};

export default CheckToVote;
