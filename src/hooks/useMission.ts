import { useEffect, useState } from "react";
import { missionsStore$, refetch } from "@/store/mission";
import { MissionData } from "@/types/auth";


export const useMission = (isAuth?: boolean) => {
  const [missions, setMissions] = useState<Map<number, MissionData>>(new Map<number, MissionData>());

  useEffect(() => {
    const subscription = missionsStore$.subscribe(setMissions);

    return () => subscription.unsubscribe();
  }, []);

  // 等 auth 檢查完成且已登入，再觸發第一次取資料
  useEffect(() => {
    if (isAuth) refetch();
  }, [isAuth]);

  // [missions, setMissions]
  return { missions, refetch };
};