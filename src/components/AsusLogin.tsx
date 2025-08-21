import React from "react";
import { playSound } from "@/utils/sound";
import { authService } from "@/services/authService";

interface AsusLoginProps {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onLoginStart?: () => void;
}

export default function AsusLogin({
  className,
  children,
  disabled = false,
  onLoginStart,
}: AsusLoginProps) {
  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();

    if (disabled) return; // 如果禁用則不執行登入

    // 通知開始登入
    onLoginStart?.();

    /* {
    "type": "login",
    "content": "{\"term1\":true,\"term2\":true,\"loginAt\":\"2024-12-19T10:30:00Z\"}"
    } */

    authService.createUserLog({
      type: "login",
      content: JSON.stringify({
        term1: true,
        term2: true,
        loginAt: new Date().toISOString(),
      }),
    });

    const params = {
      lang: "en-us",
      site: "global",
      login_background: "general_white",
      login_panel: "simply",
      AppID: "event00048",
      ReturnURL: window.location.href,
    };

    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", "https://account.asus.com/signin.aspx");

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key as keyof typeof params]);
        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();

    // 由於表單提交會導致頁面跳轉，這裡不需要通知結束登入
    // 如果需要在跳轉前通知，可以在這裡加入 onLoginEnd?.();
  };

  return (
    <button
      onClick={(e) => {
        if (disabled) return; // 如果禁用則不執行任何操作

        // 播放音效後執行登入
        playSound("./sound/click_unit.wav");

        setTimeout(() => {
          handleLogin(e);
        }, 500); // 500ms 備用延遲
      }}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
