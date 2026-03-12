import { useState, useRef, useCallback } from "react";

export type TimerMode = "countdown" | "stopwatch";

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>("countdown");
  const [timeMs, setTimeMs] = useState(0); // current elapsed or remaining
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [countdownTotal, setCountdownTotal] = useState(300000); // 5 min default
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const pausedTimeRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsFinished(false);
    setIsRunning(true);

    if (mode === "stopwatch") {
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      intervalRef.current = setInterval(() => {
        setTimeMs(Date.now() - startTimeRef.current);
      }, 50);
    } else {
      const remaining = pausedTimeRef.current || countdownTotal;
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const left = remaining - elapsed;
        if (left <= 0) {
          setTimeMs(0);
          setIsRunning(false);
          setIsFinished(true);
          clearTimer();
        } else {
          setTimeMs(left);
        }
      }, 50);
    }
  }, [isRunning, mode, countdownTotal, clearTimer]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    clearTimer();
    setIsRunning(false);
    if (mode === "stopwatch") {
      pausedTimeRef.current = timeMs;
    } else {
      pausedTimeRef.current = timeMs;
    }
  }, [isRunning, clearTimer, mode, timeMs]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsFinished(false);
    pausedTimeRef.current = 0;
    setTimeMs(mode === "countdown" ? countdownTotal : 0);
  }, [clearTimer, mode, countdownTotal]);

  const setCountdown = useCallback((ms: number) => {
    setCountdownTotal(ms);
    setTimeMs(ms);
    pausedTimeRef.current = 0;
  }, []);

  const switchMode = useCallback((newMode: TimerMode) => {
    clearTimer();
    setIsRunning(false);
    setIsFinished(false);
    pausedTimeRef.current = 0;
    setMode(newMode);
    setTimeMs(newMode === "countdown" ? countdownTotal : 0);
  }, [clearTimer, countdownTotal]);

  const displayMs = mode === "countdown" && !isRunning && !isFinished && timeMs === 0 ? countdownTotal : timeMs;

  return {
    mode,
    timeMs: displayMs,
    isRunning,
    isFinished,
    countdownTotal,
    start,
    pause,
    reset,
    setCountdown,
    switchMode,
  };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}