import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarDialog({
  isOpen,
  onClose,
}: CalendarDialogProps) {
  // 台灣時間
  const eventDate = new Date("2025-07-08T11:00:00+08:00"); // 建議加上 Z (UTC)
  const eventEnd = new Date("2025-07-08T12:00:00+08:00");

  const eventTitle = "ASUS Graphics Card 30th Anniversary Theme Park";
  const eventDescription =
    "Join us in celebrating three decades of innovation and excellence in graphics technology!";

  // ✅ 1. Google 用的 datetime 格式要無 - : .（且是 UTC 時間）
  const formatGoogleDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const googleStart = formatGoogleDate(eventDate);
  const googleEnd = formatGoogleDate(eventEnd);

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventTitle
  )}&details=${encodeURIComponent(
    eventDescription
  )}&dates=${googleStart}/${googleEnd}`;

  const googleCalendarUrl = `https://accounts.google.com/ServiceLogin?continue=${encodeURIComponent(
    calendarUrl
  )}`;

  // ✅ 2. Outlook 需要 startdt 與 enddt 都是 ISO 格式
  const outlookCalendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(
    eventTitle
  )}&body=${encodeURIComponent(
    eventDescription
  )}&startdt=${eventDate.toISOString()}&enddt=${eventEnd.toISOString()}`;

  // const icsContent = `BEGIN:VCALENDAR
  //   VERSION:2.0
  //   BEGIN:VEVENT
  //   SUMMARY:${eventTitle}
  //   DESCRIPTION:${eventDescription}
  //   DTSTART:${eventDate.toISOString().replace(/-|:|\.\d+/g, "")}
  //   DTEND:${eventDate.toISOString().replace(/-|:|\.\d+/g, "")}
  //   END:VEVENT
  //   END:VCALENDAR`;

  // const downloadICS = () => {
  //   const blob = new Blob([icsContent], { type: "text/calendar" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "ASUS_Graphics_30th_Anniversary.ics";
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   window.URL.revokeObjectURL(url);
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[50%] bg-[#18062280] backdrop-blur-sm border-white/30 py-[10%] md:py-[3%] px-[6%] md:px-[2%]"
        style={{
          background:
            "linear-gradient(27deg,rgba(20, 156, 255, .8) 0%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 75%, rgba(20, 156, 255, .8) 100%)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white text-2xl md:text-4xl text-center">
            Which calendar do you want to add?
          </DialogTitle>
        </DialogHeader>
        <div className=" mt-8">
          <div className=" w-full flex flex-col md:flex-row items-center justify-center gap-4">
            <div className=" w-full md:w-1/2 cursor-pointer text-center btn-glow text-2xl bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition">
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "data_layer_event",
                    event_name_ga4: "add_to_google_calendar",
                    event_category_DL: "outbound-links",
                    event_action_DL: "clicked",
                    event_label_DL: "Google Calendar",
                    event_value_DL: "",
                  });
                }}
              >
                Google Calendar
              </a>
            </div>
            <div className="w-full md:w-1/2 cursor-pointer text-center btn-glow text-2xl bg-gradient-to-r  from-[#FF70C3] via-[#C2C4FF] to-[#39ACFF] text-black px-10 py-3 rounded-lg  shadow-lg  mb-2 hover:from-[#39ACFF] hover:to-[#FF70C3] transition">
              <a
                href={outlookCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.dataLayer = window.dataLayer || [];
                  window.dataLayer.push({
                    event: "data_layer_event",
                    event_name_ga4: "add_to_outlook_calendar",
                    event_category_DL: "outbound-links",
                    event_action_DL: "clicked",
                    event_label_DL: "Outlook",
                    event_value_DL: "",
                  });
                }}
              >
                Outlook
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
