import React from 'react';
import DoodleButton from './DoodleButton';
import { LeaderboardEntry } from '../types';
import { PRIMARY_COLOR, GOLDEN_EGG_COLOR } from '../play/constants';

interface LeaderboardScreenProps {
  scores: LeaderboardEntry[];
  onBack: () => void;
}

/**
 * Displays the current leaderboard.  Only the top entries are shown and
 * each rank is assigned a medal colour (gold, silver, bronze).  When no
 * scores are available a friendly message encourages the player to set
 * the first record.
 */
const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ scores, onBack }) => {
  const medalColors = [GOLDEN_EGG_COLOR, '#c0c0c0', '#cd7f32'];
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent p-8 text-center">
      <h1 className="text-6xl md:text-7xl font-bold text-[#0048ab] mb-8" style={{ fontFamily: "'Kalam', cursive" }}>
        Kỹ Sư Hàng Đầu
      </h1>
      <div className="w-full max-w-lg space-y-3">
        {scores.length > 0 ? (
          scores.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border-4 border-dashed rounded-lg"
              style={{ borderColor: PRIMARY_COLOR }}
            >
              <div className="flex items-center">
                <span
                  className="text-4xl font-bold w-12 text-left"
                  style={{ fontFamily: "'Kalam', cursive", color: medalColors[index] || PRIMARY_COLOR }}
                >
                  #{index + 1}
                </span>
                <span className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Kalam', cursive" }}>
                  {entry.name}
                </span>
              </div>
              <span className="text-4xl font-bold" style={{ fontFamily: "'Kalam', cursive", color: PRIMARY_COLOR }}>
                {entry.score}
              </span>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-700" style={{ fontFamily: "'Kalam', cursive" }}>
            Chưa có điểm nào. Hãy là người đầu tiên!
          </p>
        )}
      </div>
      <div className="mt-12">
        <DoodleButton onClick={onBack}>Trở về</DoodleButton>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
