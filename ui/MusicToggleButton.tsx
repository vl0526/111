import React from 'react';
import { PRIMARY_COLOR, LINE_WIDTH } from '../play/constants';

interface MusicToggleButtonProps {
  isMusicPlaying: boolean;
  onToggle: () => void;
}

/**
 * A button for toggling the background music.  It floats in the top right
 * corner of the screen and changes its icon depending on whether music is
 * currently playing.
 */
const MusicToggleButton: React.FC<MusicToggleButtonProps> = ({ isMusicPlaying, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="absolute top-4 right-4 z-10 w-12 h-12 p-2 border-4 rounded-full transition-all duration-200 transform hover:scale-110 focus:outline-none hover:bg-blue-100/50"
      style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
      aria-label={isMusicPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={LINE_WIDTH - 2.5} strokeLinecap="round" strokeLinejoin="round">
        {/* Speaker Base */}
        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
        {isMusicPlaying ? (
          // Sound Waves
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        ) : (
          // Mute 'X'
          <>
            <line x1="16" y1="9" x2="22" y2="15"></line>
            <line x1="22" y1="9" x2="16" y2="15"></line>
          </>
        )}
      </svg>
    </button>
  );
};

export default MusicToggleButton;
