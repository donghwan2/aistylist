import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import './App.css';

interface ProfileData {
  photo: string | null;
  height: string;
  weight: string;
}

function App() {
  const [profile, setProfile] = useState<ProfileData>({
    photo: null,
    height: '',
    weight: '',
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);

    try {
      const response = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setReport(data.result);
    } catch (error: any) {
      alert('오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h1>AI 나만의 스타일리스트</h1>
      <p>당신에게 꼭 맞는 스타일을 찾기 위해<br />기본 정보를 알려주세요!</p>

      <form onSubmit={handleSubmit}>
        <div className="photo-upload" onClick={() => !loading && document.getElementById('photo-input')?.click()}>
          {profile.photo ? (
            <img src={profile.photo} alt="Preview" />
          ) : (
            <div className="photo-placeholder">
              <span>📷</span>
              <p>사진 업로드</p>
            </div>
          )}
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={loading}
          />
        </div>

        <div className="input-row">
          <div className="form-group">
            <label htmlFor="height">키 (cm)</label>
            <input
              id="height"
              name="height"
              type="number"
              placeholder="170"
              className="input-field"
              value={profile.height}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="weight">몸무게 (kg)</label>
            <input
              id="weight"
              name="weight"
              type="number"
              placeholder="65"
              className="input-field"
              value={profile.weight}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'AI가 분석 중입니다...' : '스타일 분석 시작하기'}
        </button>
      </form>

      {report && (
        <div className="report-container">
          <h2>🧥 당신을 위한 맞춤 스타일 제안</h2>
          <div className="report-content">
            {report.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
