import { Play, Pause, RotateCcw, Timer, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTimer, formatTime, type TimerMode } from "@/hooks/useTimer";
import { useState, useEffect, useRef } from "react";
import endTimerAudio from "@/audio/end-timer.mp3";

interface TimerSectionProps {
  timer: ReturnType<typeof useTimer>;
}

export function TimerSection({ timer }: TimerSectionProps) {
  const [inputMin, setInputMin] = useState("5");
  const [inputSec, setInputSec] = useState("0");
  const audioRef = useRef<HTMLAudioElement>(null);
  const isUrgent = timer.mode === "countdown" && timer.isRunning && timer.timeMs < 10000 && timer.timeMs > 0;

  // Play audio when timer finishes
  useEffect(() => {
    if (timer.isFinished && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => console.error("Error playing end timer audio:", error));
    }
  }, [timer.isFinished]);

  const handleSetCountdown = () => {
    const ms = (parseInt(inputMin || "0") * 60 + parseInt(inputSec || "0")) * 1000;
    if (ms > 0) timer.setCountdown(ms);
  };

  return (
    <div className="border-ornate rounded-lg bg-card p-6 text-center">
      {/* Mode Toggle */}
      <div className="mb-4 flex items-center justify-center gap-2">
        <Button
          variant={timer.mode === "countdown" ? "default" : "secondary"}
          size="sm"
          onClick={() => timer.switchMode("countdown")}
          className="font-cinzel text-xs"
        >
          <Timer className="mr-1 h-3 w-3" /> Countdown
        </Button>
        <Button
          variant={timer.mode === "stopwatch" ? "default" : "secondary"}
          size="sm"
          onClick={() => timer.switchMode("stopwatch")}
          className="font-cinzel text-xs"
        >
          <Clock className="mr-1 h-3 w-3" /> Stopwatch
        </Button>
      </div>

      {/* Countdown Setup */}
      {timer.mode === "countdown" && !timer.isRunning && (
        <div className="mb-4 flex items-center justify-center gap-2">
          <Input
            type="number"
            min="0"
            max="99"
            value={inputMin}
            onChange={(e) => setInputMin(e.target.value)}
            className="w-16 text-center font-cinzel"
            placeholder="min"
          />
          <span className="text-muted-foreground font-cinzel">m</span>
          <Input
            type="number"
            min="0"
            max="59"
            value={inputSec}
            onChange={(e) => setInputSec(e.target.value)}
            className="w-16 text-center font-cinzel"
            placeholder="sec"
          />
          <span className="text-muted-foreground font-cinzel">s</span>
          <Button size="sm" variant="secondary" onClick={handleSetCountdown} className="font-cinzel text-xs">
            Set
          </Button>
        </div>
      )}

      {/* Timer Display */}
      <div
        className={`font-medieval text-7xl md:text-8xl tracking-wider text-shadow-gold transition-colors ${
          timer.isFinished ? "text-destructive animate-timer-urgent" : isUrgent ? "text-destructive" : "text-gold"
        }`}
      >
        {formatTime(timer.timeMs)}
      </div>

      {timer.isFinished && (
        <p className="mt-2 font-cinzel text-lg text-destructive animate-pulse">⚔️ TIME'S UP! ⚔️</p>
      )}

      {/* Controls */}
      <div className="mt-6 flex items-center justify-center gap-3">
        {!timer.isRunning ? (
          <Button onClick={timer.start} className="font-cinzel gap-2 px-8" disabled={timer.isFinished}>
            <Play className="h-4 w-4" /> Start
          </Button>
        ) : (
          <Button onClick={timer.pause} variant="secondary" className="font-cinzel gap-2 px-8">
            <Pause className="h-4 w-4" /> Pause
          </Button>
        )}
        <Button onClick={timer.reset} variant="outline" className="font-cinzel gap-2">
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Hidden audio element for timer end sound */}
      <audio ref={audioRef} src={endTimerAudio} />
    </div>
  );
}