import React, { useState, useEffect } from 'react';
import DoodleButton from './DoodleButton';

interface StartMenuProps {
  onStart: () => void;
  onShowInstructions: () => void;
  onShowLeaderboard: () => void;
  playerName: string;
  highScore: number;
}

/**
 * Start menu screen.  This component greets the player, shows the high
 * score and fetches a daily mission using Gemini if an API key is
 * configured.  When the API key is absent a fallback mission is
 * displayed instead.
 */
const StartMenu: React.FC<StartMenuProps> = ({ onStart, onShowInstructions, onShowLeaderboard, playerName, highScore }) => {
  const [mission, setMission] = useState('');
  const [isLoadingMission, setIsLoadingMission] = useState(true);
  useEffect(() => {
    const fetchMission = async () => {
      setIsLoadingMission(true);
      // Use the environment variable GEMINI_API_KEY defined in .env.local.
      const apiKey = (typeof process !== 'undefined' && process.env && (process.env.GEMINI_API_KEY as string | undefined)) || undefined;
      if (!apiKey) {
        setMission('Kiểm tra các thông số bắt trứng tiêu chuẩn.');
        setIsLoadingMission(false);
        return;
      }
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Bạn là một giáo sư kỹ thuật lập dị. Tạo ra một mục tiêu nhiệm vụ ngắn gọn, hài hước, một câu cho một mô phỏng bắt trứng. Sử dụng thuật ngữ kỹ thuật hoặc công nghệ. Nhiệm vụ phải liên quan đến việc bắt trứng. Ví dụ: "Hiệu chỉnh cảm biến quỹ đạo hình trứng" hoặc "Phân tích tính toàn vẹn cấu trúc của các vật chứa lòng trắng rơi". Không sử dụng markdown.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setMission(response.text);
      } catch (e) {
        console.error('Failed to fetch mission:', e);
        setMission('Tối ưu hóa chiến lược thu thập vật phẩm!');
      } finally {
        setIsLoadingMission(false);
      }
    };
    fetchMission();
  }, []);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent p-8 text-center">
      <h1 className="text-8xl md:text-9xl font-bold text-[#0048ab]" style={{ fontFamily: "'Kalam', cursive" }}>
        Bắt Trứng
      </h1>
      <div className="mt-4 text-center">
        <p className="text-2xl text-gray-700">
          Kỹ sư: <span className="font-bold text-black">{playerName}</span>
        </p>
        <p className="text-2xl text-gray-700">
          Điểm Cao Nhất: <span className="font-bold text-black">{highScore}</span>
        </p>
      </div>
      <div className="mt-8 p-4 border-4 border-dashed border-[#0048ab]/50 rounded-2xl max-w-lg min-h-[100px] flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-[#0048ab]">Mục Tiêu Nhiệm Vụ</h2>
        <p className="text-lg text-gray-800 mt-2" style={{ fontFamily: "'Kalam', cursive" }}>
          {isLoadingMission ? 'Đang nhận chỉ thị...' : mission}
        </p>
      </div>
      <div className="mt-8 space-y-6 flex flex-col items-center">
        <DoodleButton onClick={onStart}>Bắt đầu</DoodleButton>
        <DoodleButton onClick={onShowLeaderboard}>Bảng xếp hạng</DoodleButton>
        <DoodleButton onClick={onShowInstructions}>Hướng dẫn</DoodleButton>
      </div>
    </div>
  );
};

export default StartMenu;
