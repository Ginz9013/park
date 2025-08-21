import { cardPositionStore$, updatePosition, type CardPositionList } from "@/store/cardPosition";
import { useEffect, useState } from "react";

export const useCardPosition = () => {

  const [positionList, setPositionList] = useState<CardPositionList>({ r1: [], r2: []});

  const removePosition = (id: number) => updatePosition(cur => ({
    r1: cur.r1.filter(p => p.id !== id),
    r2: cur.r2.filter(p => p.id !== id),
  }));

  const clearPosition = () => updatePosition(_cur => ({r1: [], r2: []}));

  useEffect(() => {
    const subscription = cardPositionStore$.subscribe(setPositionList);

    return () => subscription.unsubscribe();
  }, []);

  return {
    r1CardPositions: positionList.r1,
    r2CardPositions: positionList.r2,
    removePosition,
    clearPosition,
  };
}