import React, { useEffect, useState } from 'react';
import DoodleButton from '../ui/DoodleButton';
import { fetchLeaderboard } from '../network/api';

interface AdminUser {
  id: string;
  displayName: string;
  coins: number;
}

/**
 * A very basic admin panel placeholder.  In a real implementation this
 * component would allow an administrator to view users, ban accounts,
 * reset wallets and unlock items.  Authentication is handled by
 * Supabase custom claims on the server and checked before the page
 * loads.  Here we simply fetch the leaderboard as an example.
 */
const AdminPanel: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<AdminUser[]>([]);
  useEffect(() => {
    const load = async () => {
      const data = await fetchLeaderboard(20);
      setLeaderboard(data.map((d) => ({ id: d.userId, displayName: d.displayName, coins: d.topScore })));
    };
    load();
  }, []);
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Kalam', cursive" }}>
        Bảng Điều Khiển Admin
      </h1>
      <p className="mb-4">Đây là một giao diện giả để minh họa.  Hãy triển khai các thao tác admin tại đây.</p>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-2">ID</th>
            <th className="border-b p-2">Tên hiển thị</th>
            <th className="border-b p-2">Coins/Score</th>
            <th className="border-b p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((u) => (
            <tr key={u.id}>
              <td className="border-b p-2">{u.id}</td>
              <td className="border-b p-2">{u.displayName}</td>
              <td className="border-b p-2">{u.coins}</td>
              <td className="border-b p-2 space-x-2">
                <DoodleButton onClick={() => alert(`Ban user ${u.displayName}`)}>
                  Ban
                </DoodleButton>
                <DoodleButton onClick={() => alert(`Reset wallet for ${u.displayName}`)}>
                  Reset
                </DoodleButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
