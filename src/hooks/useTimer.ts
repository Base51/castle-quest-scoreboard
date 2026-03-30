import { useState, useRef, useCallback, useEffect } from "react";

export type TimerMode = "countdown" | "stopwatch";

const TIMER_STORAGE_KEY = "castle-quest-scoreboard:timer";
const DEFAULT_COUNTDOWN_TOTAL = 300000;

interface PersistedTimerState {
  mode: TimerMode;
  timeMs: number;
  isRunning: boolean;
  isFinished: boolean;
  countdownTotal: number;
  startedAt: number;
  runningBaseMs: number;
}

interface InitialTimerState extends PersistedTimerState {
  pausedTimeMs: number;
}

function saveTimerState(state: PersistedTimerState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state));
}

function loadTimerState(): InitialTimerState {
  if (typeof window === "undefined") {
    return {
      mode: "countdown",
      timeMs: 0,
      isRunning: false,
      isFinished: false,
      countdownTotal: DEFAULT_COUNTDOWN_TOTAL,
      startedAt: 0,
      runningBaseMs: 0,
      pausedTimeMs: 0,
    };
  }

  try {
    const raw = window.localStorage.getItem(TIMER_STORAGE_KEY);
    if (!raw) {
      return {
        mode: "countdown",
        timeMs: 0,
        isRunning: false,
        isFinished: false,
        countdownTotal: DEFAULT_COUNTDOWN_TOTAL,
        startedAt: 0,
        runningBaseMs: 0,
        pausedTimeMs: 0,
      };
    }

    const parsed = JSON.parse(raw) as Partial<PersistedTimerState>;
    const mode: TimerMode = parsed.mode === "stopwatch" ? "stopwatch" : "countdown";
    const countdownTotal = typeof parsed.countdownTotal === "number" && parsed.countdownTotal > 0
      ? parsed.countdownTotal
      : DEFAULT_COUNTDOWN_TOTAL;
    const savedTimeMs = typeof parsed.timeMs === "number" && parsed.timeMs >= 0 ? parsed.timeMs : 0;
    const startedAt = typeof parsed.startedAt === "number" && parsed.startedAt > 0 ? parsed.startedAt : 0;
    const runningBaseMs = typeof parsed.runningBaseMs === "number" && parsed.runningBaseMs >= 0 ? parsed.runningBaseMs : 0;
    const isRunning = Boolean(parsed.isRunning) && startedAt > 0;
    const isFinished = Boolean(parsed.isFinished);

    if (isRunning) {
      const elapsed = Math.max(0, Date.now() - startedAt);

      if (mode === "stopwatch") {
        const resumedTimeMs = runningBaseMs + elapsed;
        return {
          mode,
          timeMs: resumedTimeMs,
          isRunning: true,
          isFinished: false,
          countdownTotal,
          startedAt,
          runningBaseMs,
          pausedTimeMs: 0,
        };
      }

      const remainingMs = runningBaseMs - elapsed;
      if (remainingMs <= 0) {
        return {
          mode,
          timeMs: 0,
          isRunning: false,
          isFinished: true,
          countdownTotal,
          startedAt: 0,
          runningBaseMs: 0,
          pausedTimeMs: 0,
        };
      }

      return {
        mode,
        timeMs: remainingMs,
        isRunning: true,
        isFinished: false,
        countdownTotal,
        startedAt,
        runningBaseMs,
        pausedTimeMs: 0,
      };
    }

    return {
      mode,
      timeMs: savedTimeMs,
      isRunning: false,
      isFinished,
      countdownTotal,
      startedAt: 0,
      runningBaseMs: 0,
      pausedTimeMs: savedTimeMs,
    };
  } catch {
    return {
      mode: "countdown",
      timeMs: 0,
      isRunning: false,
      isFinished: false,
      countdownTotal: DEFAULT_COUNTDOWN_TOTAL,
      startedAt: 0,
      runningBaseMs: 0,
      pausedTimeMs: 0,
    };
  }
}

export function useTimer() {
  const initialStateRef = useRef(loadTimerState());
  const [mode, setMode] = useState<TimerMode>(initialStateRef.current.mode);
  const [timeMs, setTimeMs] = useState(initialStateRef.current.timeMs); // current elapsed or remaining
  const [isRunning, setIsRunning] = useState(initialStateRef.current.isRunning);
  const [isFinished, setIsFinished] = useState(initialStateRef.current.isFinished);
  const [countdownTotal, setCountdownTotal] = useState(initialStateRef.current.countdownTotal);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(initialStateRef.current.startedAt);
  const pausedTimeRef = useRef(initialStateRef.current.pausedTimeMs);
  const runningBaseMsRef = useRef(initialStateRef.current.runningBaseMs);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAtRef.current;

      if (mode === "stopwatch") {
        setTimeMs(runningBaseMsRef.current + elapsed);
        return;
      }

      const remainingMs = runningBaseMsRef.current - elapsed;
      if (remainingMs <= 0) {
        clearTimer();
        startedAtRef.current = 0;
        runningBaseMsRef.current = 0;
        pausedTimeRef.current = 0;
        setTimeMs(0);
        setIsRunning(false);
        setIsFinished(true);
        return;
      }

      setTimeMs(remainingMs);
    }, 50);

    return clearTimer;
  }, [clearTimer, isRunning, mode]);

  useEffect(() => {
    if (isRunning) {
      return;
    }

    saveTimerState({
      mode,
      timeMs,
      isRunning: false,
      isFinished,
      countdownTotal,
      startedAt: 0,
      runningBaseMs: 0,
    });
  }, [countdownTotal, isFinished, isRunning, mode, timeMs]);

  const start = useCallback(() => {
    if (isRunning) return;

    const startedAt = Date.now();
    setIsFinished(false);
    setIsRunning(true);

    if (mode === "stopwatch") {
      runningBaseMsRef.current = pausedTimeRef.current;
      startedAtRef.current = startedAt;
      saveTimerState({
        mode,
        timeMs: runningBaseMsRef.current,
        isRunning: true,
        isFinished: false,
        countdownTotal,
        startedAt,
        runningBaseMs: runningBaseMsRef.current,
      });
    } else {
      const remaining = pausedTimeRef.current || countdownTotal;
      runningBaseMsRef.current = remaining;
      startedAtRef.current = startedAt;
      setTimeMs(remaining);
      saveTimerState({
        mode,
        timeMs: remaining,
        isRunning: true,
        isFinished: false,
        countdownTotal,
        startedAt,
        runningBaseMs: remaining,
      });
    }
  }, [countdownTotal, isRunning, mode]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    clearTimer();
    setIsRunning(false);
    pausedTimeRef.current = timeMs;
    startedAtRef.current = 0;
    runningBaseMsRef.current = 0;
  }, [isRunning, clearTimer, mode, timeMs]);

  const reset = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    setIsFinished(false);
    pausedTimeRef.current = 0;
    startedAtRef.current = 0;
    runningBaseMsRef.current = 0;
    setTimeMs(mode === "countdown" ? countdownTotal : 0);
  }, [clearTimer, mode, countdownTotal]);

  const setCountdown = useCallback((ms: number) => {
    setCountdownTotal(ms);
    setTimeMs(ms);
    setIsFinished(false);
    pausedTimeRef.current = 0;
    startedAtRef.current = 0;
    runningBaseMsRef.current = 0;
  }, []);

  const switchMode = useCallback((newMode: TimerMode) => {
    clearTimer();
    setIsRunning(false);
    setIsFinished(false);
    pausedTimeRef.current = 0;
    startedAtRef.current = 0;
    runningBaseMsRef.current = 0;
    setMode(newMode);
    setTimeMs(newMode === "countdown" ? countdownTotal : 0);
  }, [clearTimer, countdownTotal]);

  const resetAll = useCallback(() => {
    clearTimer();
    setMode("countdown");
    setIsRunning(false);
    setIsFinished(false);
    setCountdownTotal(DEFAULT_COUNTDOWN_TOTAL);
    setTimeMs(0);
    pausedTimeRef.current = 0;
    startedAtRef.current = 0;
    runningBaseMsRef.current = 0;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TIMER_STORAGE_KEY);
    }
  }, [clearTimer]);

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
    resetAll,
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