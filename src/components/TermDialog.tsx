import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

interface TermDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  title?: string;
  content?: string;
}

export const TermDialog: React.FC<TermDialogProps> = ({
  isOpen,
  onClose,
  title = "ASUS VGA 30th Anniversary – CHEERS TO 30 YEARS Terms & Conditions ",
  content = `
    <p>This promotion – CHEERS TO 30 YEARS (“Promotion”) is hosted by ASUSTek Computer Inc. (“ASUS”). </p>
    
    <p>Detailed information with respect to participation and prize eligibility in connection with this Promotion,<a href="https://www.asus.com/us/Terms_of_Use_Notice_Privacy_Policy/Official-Site" target="_blank" rel="noopener noreferrer">ASUS Terms of Use Notice</a>, and <a href="https://www.asus.com/us/Terms_of_Use_Notice_Privacy_Policy/Privacy_Policy/" target="_blank" rel="noopener noreferrer">ASUS Privacy Policy</a> are all integral parts of this Terms and Conditions of  Promotion Event ("Terms and Conditions"). Participation in this Promotion is deemed acceptance of these Terms and Conditions.  ASUS may at any time revise the Terms and Conditions and other rules set forth by ASUS. Eligible Entrant (as defined below) shall be bound by any such revisions. 
    
    <h3>Promotion Period</h3>
    <p>Promotion commences on 1 July, 2025 11:00 AM (GMT+8) and terminates on 7 October, 2025 11:00 AM (GMT+8) ("Promotion Period"). </p>
    
    <h3>Promotion Region</h3>
    <p>Worldwide, excluding Argentina, Italy, Thailand, Turkey, Poland, China, Vietnam, Russia, Belarus, Cuba, Iran, Syria, North Korea, restricted, sanctioned or embargoed countries or regions and regions or territories where: (i)participation in giveaways or receipt of prizes is prohibited; (ii) there is an ongoing state of war; or (iii) the Prize (as defined below) cannot be delivered. Entrants of this event may be required to show proof of residency. </p>
    
    <h3>Entry Requirements</h3>
    <h4>A. Eligible Entrant</h4>
    <ul>
      <li>Residents of Promotion Region who are at least 18 years old and considered a competent adult by the laws of his/her resident State (“Valid Entrant”). </li>
      <li>Employees of ASUS and its affiliates, subsidiaries, advertising representatives and agencies, who are involved in the Promotion, and the immediate families of any of the foregoing persons, are <strong>NOT ELIGIBLE</strong> for this Giveaway.</li>
      <li>ASUS reserves the right to take all reasonable action to protect against fraud or other illegal conduct, including, without limitation, verifying proof of participation, age and identity.</li>
    </ul>
    
    <h4>B. Entry Requirements</h4>
    <p>Valid Entrants must:</p>
    
    <ol>
      <li>register and/or login with your ASUS Member account on the Promotion site;</li>
      <li>Participate in the following activities to earn points. Each activity and/or content submission renders varying rewards of points, you may choose freely which activities to engage in and may join multiple activities, up to eleven (11):</li>
    </ol>
    
    <h4>Activity Details:</h4>
    <div class="activity-list">
      <div class="activity-item">
        <strong>Activity 1:</strong> Login or register ASUS VIP at "Ticket Window" section will be awarded three (3) points. Eligible Entrants may not join Activities 1-3 repeatedly.
      </div>
      
      <div class="activity-item">
        <strong>Activity 2:</strong> Three (3) points will be awarded at the first time an Eligible Entrant completes "Milestone Roller Coaster" section on the Official Website of this Promotion. Eligible Entrants may re-participate this section to earn one (1) extra point each day.
      </div>
      
      <div class="activity-item">
        <strong>Activity 3:</strong> Share a reel telling your story with your ASUS and/or ROG graphics card at the "Memory Ferris Wheel" section by submitting a video link or image along with texts based on topics designated by ASUS. Three (3) points will be awarded upon completion. You must share your post on your own social-media platform(s) (Facebook, Instagram, X) to earn an additional one (1) point, maximum three (3) points, for each additional platform.
      </div>
      
      <div class="activity-item">
        <strong>Activity 4:</strong> Watch one (1) KOL video at "Memory Ferris Wheel" section on the Official Website of this Promotion for one (1) point. This activity may be participated once a day.
      </div>
      
      <div class="activity-item">
        <strong>Activity 5:</strong> Vote for your favorite story at "Memory Ferris Wheel" section to earn one (1) point once a day.
      </div>
      
      <div class="activity-item visibleHidden hidden">
        <strong>Activity 6:</strong> Click the "Cable Car" section to visit other activity sections to earn one (1) point.
      </div>
      
      <div class="activity-item visibleHidden hidden">
        <strong>Activity 7:</strong> Complete the "Arcade" section for three (3) points. Eligible Entrants may re-participate to earn an extra one (1) point each day. Additional one point (1) is award to Eligible Entrants for each share of the result of this activity on the three designated social media platforms (Facebook, Instagram, Twitter) with Eligible Entrant's own account. Eligible Entrants may earn up to three (3) points for sharing.
      </div>
      
      <div class="activity-item visibleHidden hidden">
        <strong>Activity 8:</strong> Earn five (5) points by finishing the secret mission "Where Is the 30th Anniversary Edition" on the official website of this Promotion. A 30th anniversary special edition graphic card will be hidden in an online map. Eligible Entrant must complete this mission by clicking an illustration of the graphic card on the map. An additional one (1) point will be granted if Eligible Entrant shares the result of this activity on their social-media platform(s) account (Facebook, Instagram, Twitter), a maximum of three (3) points would be awarded if Eligible Entrants shares on all three social-media platforms (Facebook, Instagram, X) with their own account.
      </div>
      
      <div class="activity-item visibleHidden hidden">
        <strong>Activity 9:</strong> Share your dream graphics card design with a brief text of introduction at the "DreamCraft" section. The artwork can be purely hand-drawn or photoshopped. Gen-AI apps usages are allowed. Eligible Entrant warrants that the image shared does not infringe any IP rights or any other rights of others and may be commercially used. Three (3) points will be awarded after submission. Earn an additional one (1) point by sharing the result of this activity on your own social-media platform(s) (Facebook, Instagram, Twitter). Eligible Entrants may earn up to three (3) points if shared on all three social-media platforms (Facebook, Instagram, X).
      </div>
      
      <div class="activity-item visibleHidden hidden">
        <strong>Activity 10:</strong> Vote for your favorite design at "DreamCraft" section to earn one (1) point daily.
      </div>
      
      <div class="activity-item visibleHidden hidden">
        <strong>Activity 11:</strong> Visit our partners' page or ASUS promotion page via the "Souvenir Shop" section on the official website of this Promotion and be awarded two (2) points daily.
      </div>
    </div>
    
    <p><em>Unless specified in the above description of respective activities, one Eligible Entrant may only participate in each activity once. Redundant participations will not be admitted.</em></p>
    
    <h4>Additional Requirements:</h4>
    <ul>
      <li>Each Eligible Entrant acknowledges and warrants that by submitting, uploading, transmitting, inputting or providing information, including images, videos, video links, posts and/or submissions, they grant ASUS, its affiliates and subsidiaries, a worldwide, non-exclusive, non-revocable, royalty-free, transferable, sub-licensable right to use, reproduce, edit, create derivative works and to publicly recite, publicly broadcast, publicly present, publicly perform, transfer, publicly transmit, publish, publicly display, publicly release for the purpose of promotion of ASUS and its products in any media format and manner.</li>
      <li>Each Eligible Entrant may enter this Promotion only once as one Valid Entrant, regardless of the Channel of entry or the alias they used to enter. Additional entries beyond the first one will be ignored and will not be eligible to the Promotion. Entry by same person through creation of alternate identity will be considered fraud and all such Entrant's entries will be voided.</li>
      <li><strong>NO PURCHASE NECESSARY.</strong> Participation is allowed regardless of whether a product or service is purchased. Making a purchase will not increase a Valid Entrant's chances of winning.</li>
    </ul>
    
    <h3>Prize</h3>
    <ol>
      <li>The full prize list and value can be checked at the official site of this Promotion: <a href="https://www.asus.com/event/ASUSVGA30years/" target="_blank" rel="noopener noreferrer">https://www.asus.com/event/ASUSVGA30years/</a>.</li>
      <li>For more detailed information on the Prizes included in the promotion, please refer to the official VGA 30th Anniversary Theme Park Campaign. The Prizes given will not be covered by an ASUS warranty.</li>
    </ol>
    
    <h3>Prize Winner</h3>
    <p>Three (3) types of Prize Winners ("Prize Winner") (as defined below) will be selected.</p>
    
    <h4>(1) Type 1:</h4>
    <p>Prize Winners chosen by the points earned, total value of all type 1 prizes is approximately <strong>US$4,573.75</strong>:</p>
    <ul>
      <li>Prize Winner will be chosen from all Valid Entrants, the chance of being chosen is based on the points earned.</li>
      <li>Five (5) winners will be chosen on 31 of July, 31 of August and November. 11 Prize Winners will be chosen in total.</li>
    </ul>
    
    <h4>(2) Type 2:</h4>
    <ul>
      <li>Four (4) Prize Winners will be selected from Valid Entrants of Activity 5 ("Memory Ferris Wheel"). The winners will be the ones who earned the most weighted votes in respective categories. Formula for weighting is 50% ASUS vote + 50% fan vote.</li>
      <li>Total value of all type 2 prizes is approximately <strong>US$6,073.8</strong>.</li>
      <li>Type 2 Prize Winners will be selected on 11, Nov.</li>
    </ul>
    
    <h4>(3) Type 3:</h4>
    <ul>
      <li>Four (4) Prize Winners will be selected from Valid Entrants of Activity 11 ("DreamCraft"). The winners will be the ones who earned the most weighted votes in respective categories. Formula for weighting is 100% ASUS vote.</li>
      <li>Total value of all type 3 prizes is approximately <strong>US$4,844</strong>.</li>
      <li>Type 3 Prize Winners will be selected on 11, Nov.</li>
    </ul>
    
    <p>Prize Winners will be subsequently informed within six (6) weeks after the end of the Promotion Period ("Drawing Date") by email and announced on the ASUS fan pages on social media.</p>
    
    <p>Prize Winners shall inform ASUS of their contact information within 7 days after the time ASUS sends out the notification via email. Any failure of a Prize Winner to make the contact information available to ASUS will be deemed a waiver of the right for the Prize awarded, and ASUS, in its sole discretion, has the right to conduct a redraw to decide a substitute. All submission from the special ASUS prize winners will be checked to ensure eligibility.</p>
    
    <p>By joining this Promotion, Eligible Entrants agree to provide their social media account name to ASUS. Prize Winners agree to provide ASUS with their full name, phone number, and delivery address. The information provided will only be used as means to deliver the prize to the winners.</p>
    
    <p>The Prize will be delivered to your indicated address within three (3) months after the Drawing Date. The delivery date may be changed without prior notice.</p>
    
    <p>ASUS reserves the right to verify any of the information provided by a winner before awarding the prize. ASUS will not be held responsible for any lost or returned prizes where it has made reasonable efforts to ascertain the correct postal address of the winners.</p>
    
    <p>The Promotion is hosted in multiple jurisdictions and territories. In each Promotion territory, the entry, mechanism, review criteria and prizes will be various. The participant shall not enroll multiple programs from other countries. If ASUS investigate any frauds, ASUS has the right to deny and refuse your entry in the future.</p>
    
    <p>If you have any questions regarding the Promotion, please contact us at: <a href="mailto:opcampaign@asus.com">opcampaign@asus.com</a></p>
    
    <h3>How to Claim the Prize</h3>
    <p>Winners must meet all eligibility requirements set forth in these Official Rules to qualify for the Prize. If the Winner is a Canadian resident, he/she may be required to correctly answer a time-limited skill testing question administered by phone without any assistance in order to be eligible to receive a prize. If a Winner is a Canadian resident and the question is answered incorrectly, the prize will be forfeited.</p>
    
    <p>This Promotion is in no way sponsored, endorsed or administered by, or associated with, Instagram, Facebook and Twitter. You agree to grant Instagram, Facebook and Twitter a complete release regarding this Promotion. You acknowledge that you are providing your comments and Personal Information to ASUS and not to Instagram, Facebook and Twitter; and such information and Personal Information will only be used for this Promotion – CHEERS TO 30 YEARS. 
  `,
}) => {
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    setHasReadToBottom(isAtBottom);
    console.log(hasReadToBottom);
  };

  const handleClose = () => {
    onClose();
  };

  // const handleAccept = () => {
  //   if (hasReadToBottom) {
  //     onAccept();
  //     onClose();
  //   }
  // };

  useEffect(() => {
    if (isOpen) {
      setHasReadToBottom(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-3xl mx-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
            style={{
              background:
                "linear-gradient(65deg,rgba(20, 156, 255, .5) 0%, rgba(0, 0, 0, .6) 20%, rgba(0, 0, 0, .6) 80%, rgba(20, 156, 255, .5) 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 標題欄 */}
            <div className=" p-6">
              <h2 className="text-xl font-bold text-white text-center font-TTNormsProMedium">
                {title}
              </h2>
            </div>

            {/* 內容區域 */}
            <div className="p-6">
              <div
                ref={contentRef}
                onScroll={handleScroll}
                className="max-h-96 overflow-y-auto pr-4 space-y-4 text-sm leading-relaxed term-content"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255, 255, 255, 0.3) transparent",
                }}
              />

              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  .term-content h3 {
                    color: #ffffff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    padding-bottom: 0.5rem;
                  }
                  
                  .term-content h4 {
                    color: #ffffff;
                    font-size: 1rem;
                    font-weight: 500;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                  }
                  
                  .term-content p {
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 0.75rem;
                    line-height: 1.6;
                  }
                  
                  .term-content ul, .term-content ol {
                    color: rgba(255, 255, 255, 0.9);
                    margin-left: 1.5rem;
                    margin-bottom: 0.75rem;
                  }
                  
                  .term-content li {
                    margin-bottom: 0.5rem;
                    line-height: 1.6;
                  }
                  
                  .term-content strong {
                    color: #ffffff;
                    font-weight: 600;
                  }
                  
                  .term-content em {
                    color: rgba(255, 255, 255, 0.7);
                    font-style: italic;
                  }
                  
                  .term-content a {
                    color: #60a5fa;
                    text-decoration: underline;
                    transition: color 0.2s;
                  }
                  
                  .term-content a:hover {
                    color: #93c5fd;
                  }
                  
                  .term-content .activity-list {
                    margin: 1rem 0;
                  }
                  
                  .term-content .activity-item {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                    padding: 0.75rem;
                    margin-bottom: 0.75rem;
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.6;
                  }
                  
                  .term-content .activity-item strong {
                    color: #60a5fa;
                    display: block;
                    margin-bottom: 0.25rem;
                  }

                  .hidden{
                    display: none;

                  }
                  .visible{
                    display: block;
                  }
                  .visibleHidden{
                    visibility: hidden;
                  }

                `,
                }}
              />

              {/* 按鈕區域 */}
              <div className="flex justify-end items-center mt-6 pt-4 border-t border-white/10">
                <Button
                  onClick={handleClose}
                  className="border-white/20 text-white hover:bg-white/10  cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermDialog;
