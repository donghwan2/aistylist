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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('User Profile Submitted:', profile);
    alert('프로필이 저장되었습니다! 이제 당신의 스타일을 분석해 드릴게요.');
  };

  return (
    <div className="profile-container">
      <h1>AI 스타일리스트</h1>
      <p>당신에게 꼭 맞는 스타일을 찾기 위해<br />기본 정보를 알려주세요!</p>

      <form onSubmit={handleSubmit}>
        <div className="photo-upload" onClick={() => document.getElementById('photo-input')?.click()}>
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
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          스타일 분석 시작하기
        </button>
      </form>
    </div>
  );
}

export default App;
