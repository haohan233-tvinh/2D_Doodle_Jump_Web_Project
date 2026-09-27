# Bàn giao Props Contract — Race V2 HUD (UI-01)

Tài liệu này dùng để bàn giao danh sách `props` của module **HUD/UI** (Issue #29 do Phương VH phụ trách) cho Trưởng nhóm (Nguyễn Tuấn Vinh) kết nối vào `engine.js` / `GamePage.jsx` sau khi chốt contract #22.

---

## 1. Thông tin Component

* **Tên Component:** `RaceHUD`
* **Vị trí file:** `frontend/src/components/RaceHUD.jsx` (đã re-export tại `frontend/src/components/HUD.jsx`)
* **Component Demo:** `RaceHUDDemo` (trong `frontend/src/components/RaceHUDDemo.jsx`)

---

## 2. Bảng mô tả Props Contract

| Tên Prop | Kiểu dữ liệu | Mặc định | Mô tả chi tiết |
|---|---|---|---|
| `matchState` | `'waiting' \| 'racing' \| 'finished' \| 'disconnected'` | `'racing'` | 4 trạng thái phòng: Chờ ghép đối thủ, Đang đua, Về đích, Mất kết nối |
| `progress` | `number` (0–100) | `0` | Tiến độ quãng đường hiện tại của người chơi (%) |
| `distanceToFinish` | `number` | `0` | Số mét còn lại tới vạch đích |
| `totalDistance` | `number` | `1000` | Tổng chiều dài chặng đua (mét) |
| `currentDistance` | `number` | `0` | Chiều cao / quãng đường hiện tại người chơi đã leo |
| `placement` | `number` (1, 2, 3...) | `1` | Thứ hạng hiện tại của người chơi |
| `totalRacers` | `number` | `4` | Tổng số lượng tay đua trong ván đua |
| `racers` | `Array<RacerItem>` | `[]` | Danh sách tiến độ của tất cả các tay đua để hiển thị vị trí trên thanh tiến trình |
| `abilities` | `Array<AbilityItem>` | `DEFAULT_RACE_ABILITIES` | Danh sách 3 siêu năng lực (Bay, Choáng, Teleport) kèm trạng thái Cooldown |
| `onUseAbility` | `(abilityId: string) => void` | `undefined` | Callback được gọi khi người chơi bấm/chạm kích hoạt năng lực |
| `statusEffects` | `Array<StatusEffect>` | `[]` | Mảng các trạng thái bất lợi / hiệu ứng tác động lên người chơi (ví dụ: bị choáng) |
| `winner` | `WinnerObject \| null` | `null` | Thông tin người về nhất khi trận đấu kết thúc (`matchState === 'finished'`) |
| `isDemo` | `boolean` | `false` | Đặt `true` khi chạy chế độ demo xem trước để hiển thị nhãn "Dữ liệu demo" |
| `demoLabel` | `string` | `'Dữ liệu demo (UI-01)'` | Nội dung nhãn demo |
| `onPlayAgain` | `() => void` | `undefined` | Callback khi bấm nút "Đua tiếp ván mới" ở màn hình về đích |
| `onLeaveRoom` | `() => void` | `undefined` | Callback khi bấm nút "Rời phòng" / "Về sảnh" |
| `onRetryConnection` | `() => void` | `undefined` | Callback khi bấm nút "Thử kết nối lại" ở màn hình mất kết nối |

---

## 3. Cấu trúc chi tiết các Object con

### 3.1. `RacerItem` (Tay đua trên thanh tiến trình)
```json
{
  "id": "player",
  "name": "Bạn (Doodle)",
  "progress": 68.5,
  "isPlayer": true,
  "avatar": "🐸"
}
```

### 3.2. `AbilityItem` (Siêu năng lực)
```json
{
  "id": "fly",
  "name": "Bay siêu tốc",
  "shortName": "Bay",
  "icon": "🚀",
  "keyHint": "1",
  "cooldown": 0,
  "maxCooldown": 12,
  "ready": true,
  "active": false,
  "duration": 3
}
```
* **3 mã năng lực chuẩn:**
  * `fly`: Bay lượn tên lửa (🚀)
  * `stun`: Sấm sét gây choáng (⚡)
  * `teleport`: Dịch chuyển tức thời (🌀)

### 3.3. `StatusEffect` (Trạng thái tác động)
```json
{
  "id": "stunned",
  "name": "Bị choáng!",
  "icon": "💫",
  "remaining": 1.8
}
```
* Khi có `stunned`, HUD sẽ hiển thị banner nhỏ gọn cảnh báo lơ lửng phía trên kèm viền vàng mờ (vignette), **hoàn toàn không che khuất nhân vật và sàn nhảy ở trung tâm**.

### 3.4. `WinnerObject` (Người chiến thắng)
```json
{
  "id": "player",
  "name": "Bạn (Doodle)",
  "placement": 1,
  "isPlayer": true,
  "timeMs": 42500
}
```

---

## 4. Cách sử dụng nhanh

```jsx
import { RaceHUD } from '../components/HUD.jsx';

<RaceHUD
  matchState="racing"
  progress={playerProgress}
  distanceToFinish={distanceLeft}
  placement={currentRank}
  totalRacers={4}
  racers={allRacersList}
  abilities={raceAbilities}
  onUseAbility={(id) => handleCastSpell(id)}
  statusEffects={activeDebuffs}
/>
```

---

## 5. Kết quả kiểm thử (Definition of Done)
* Đã viết bộ test: `frontend/src/tests/HUD.test.jsx` (10/10 test cases passed).
* Kiểm thử responsive: Đạt chuẩn khung `960x540` px và màn hình chạm hẹp `390px`.
* Chạy `npm.cmd test` và `npm.cmd run build` đều đạt 100% không cảnh báo lỗi.
