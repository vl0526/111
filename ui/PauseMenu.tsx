import React from 'react';
import DoodleButton from './DoodleButton';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onBack: () => void;
}

/**
 * Overlay displayed when the game is paused.  Provides options to resume,
 * restart or return to the main menu.  The overlay uses a semi‑transparent
 * backdrop and centres its contents.
 */
const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onRestart, onBack }) => {
  return (
    <div className="absolute inset-0 bg-[#f4f1de]/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
      <h1 className="text-8xl font-bold text-[#0048ab] mb-12" style={{ fontFamily: "'Kalam', cursive" }}>
        Tạm dừng
      </h1>
      <div className="space-y-6 flex flex-col items-center">
        <DoodleButton onClick={onResume}>Tiếp tục</DoodleButton>
        <DoodleButton onClick={onRestart}>Chơi lại</DoodleButton>
        <DoodleButton onClick={onBack}>Màn hình chính</DoodleButton>
      </div>
    </div>
  );
};

export default PauseMenu;
