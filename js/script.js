/**
 * CarePet Client-Side JS
 * Handles pet selection, profiles, levels, blood sugar, and navigation
 */

// ─── Pet Data Registry ───
const PET_DATA = {
  diabetes: {
    name: 'DiaPet', emoji: '🐱', path: 'Diabetes', badge: 'badge-purple',
    color: 'var(--accent-purple)', specialBar: 'blood-sugar',
    specialBarLabel: 'Blood Sugar', specialBarUnit: 'mg/dL',
    actions: [
      { emoji: '🍎', label: 'Feed' },
      { emoji: '⚽', label: 'Play' },
      { emoji: '💉', label: 'Insulin' }
    ]
  },
  asthma: {
    name: 'AirPet', emoji: '🦉', path: 'Asthma', badge: 'badge-teal',
    color: 'var(--accent-teal)', specialBar: 'lung-capacity',
    specialBarLabel: 'Lung Capacity', specialBarUnit: '%',
    actions: [
      { emoji: '🍎', label: 'Feed' },
      { emoji: '⚽', label: 'Play' },
      { emoji: '💨', label: 'Inhaler Time' }
    ]
  },
  adhd: {
    name: 'FocusPet', emoji: '🐿️', path: 'ADHD', badge: 'badge-blue',
    color: 'var(--accent-blue)', specialBar: 'focus',
    specialBarLabel: 'Focus Level', specialBarUnit: '%',
    actions: [
      { emoji: '🍎', label: 'Feed' },
      { emoji: '⚽', label: 'Play' },
      { emoji: '🧘', label: 'Calm Down' }
    ]
  },
  epilepsy: {
    name: 'CalmPet', emoji: '🐢', path: 'Epilepsy', badge: 'badge-pink',
    color: 'var(--accent-pink)', specialBar: 'calm',
    specialBarLabel: 'Calm Level', specialBarUnit: '%',
    actions: [
      { emoji: '🍎', label: 'Feed' },
      { emoji: '⚽', label: 'Play' },
      { emoji: '🧘', label: 'Relax' }
    ]
  },
  celiac: {
    name: 'CeliPet', emoji: '🐰', path: 'Celiac Disease', badge: 'badge-green',
    color: 'var(--accent-green)', specialBar: 'gut-health',
    specialBarLabel: 'Gut Health', specialBarUnit: '%',
    actions: [
      { emoji: '🥗', label: 'Healthy Meal' },
      { emoji: '⚽', label: 'Play' },
      { emoji: '📖', label: 'Learn Foods' }
    ]
  },
  heart: {
    name: 'HeartPet', emoji: '🦁', path: 'Heart Disease', badge: 'badge-pink',
    color: 'var(--accent-pink)', specialBar: 'heart-rate',
    specialBarLabel: 'Heart Strength', specialBarUnit: '%',
    actions: [
      { emoji: '🍎', label: 'Feed' },
      { emoji: '🚶', label: 'Walk' },
      { emoji: '❤️', label: 'Heart Check' }
    ]
  },
  cf: {
    name: 'BreathePet', emoji: '🐬', path: 'Cystic Fibrosis', badge: 'badge-blue',
    color: 'var(--accent-blue)', specialBar: 'airway',
    specialBarLabel: 'Airway Clarity', specialBarUnit: '%',
    actions: [
      { emoji: '🍎', label: 'Feed' },
      { emoji: '⚽', label: 'Play' },
      { emoji: '🫁', label: 'Therapy' }
    ]
  }
};

// ─── Helper: get pet profile from localStorage ───
function getPetProfile() {
  const defaults = { petKey: null, petNickname: '', level: 1, xp: 0, xpToNext: 100, bloodSugar: 110 };
  try {
    const saved = JSON.parse(localStorage.getItem('petProfile'));
    return saved ? { ...defaults, ...saved } : defaults;
  } catch { return defaults; }
}

function savePetProfile(profile) {
  localStorage.setItem('petProfile', JSON.stringify(profile));
}

function getSelectedPet() {
  return localStorage.getItem('selectedPet') || null;
}

function clearAccount() {
  localStorage.removeItem('selectedPet');
  localStorage.removeItem('petProfile');
  window.location.href = 'index.html';
}

// ─── Blood sugar helpers ───
function getBloodSugarColor(value) {
  if (value < 70) return '#e74c3c';       // low = red
  if (value <= 140) return '#2ecc71';      // normal = green
  if (value <= 180) return '#f39c12';      // elevated = orange
  return '#e74c3c';                         // high = red
}

function getBloodSugarStatus(value) {
  if (value < 70) return '⚠️ Low — Eat a snack!';
  if (value <= 140) return '✅ Normal range';
  if (value <= 180) return '⚠️ Slightly high';
  return '🚨 High — Talk to an adult!';
}

function getBloodSugarPercent(value) {
  // Map 40-300 range to 0-100%
  return Math.min(100, Math.max(0, ((value - 40) / 260) * 100));
}

// ─── Main DOMContentLoaded ───
document.addEventListener('DOMContentLoaded', () => {

  // ─── Form submission handler ───
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // If this is the choose-pet form, save the selected pet
      const selectedRadio = form.querySelector('input[name="pet"]:checked');
      if (selectedRadio) {
        const petKey = selectedRadio.value;
        localStorage.setItem('selectedPet', petKey);
        // Initialize profile if new or changed
        const profile = getPetProfile();
        if (profile.petKey !== petKey) {
          savePetProfile({
            petKey: petKey,
            petNickname: '',
            level: 1,
            xp: 0,
            xpToNext: 100,
            bloodSugar: 110
          });
        }
      }

      // If the pet-name form, save the nickname
      const nameInput = form.querySelector('#pet-nickname-input');
      if (nameInput) {
        const profile = getPetProfile();
        profile.petNickname = nameInput.value.trim();
        savePetProfile(profile);
      }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.innerHTML = '<span class="icon">✨</span> Loading...';
        btn.disabled = true;

        setTimeout(() => {
          const action = form.getAttribute('action');
          if (action) {
            window.location.href = action;
          } else {
            // Reload to show updated data
            window.location.reload();
          }
        }, 800);
      }
    });
  });

  // ─── Logout / Reset button ───
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearAccount();
    });
  }

  // ─── Dashboard: load selected pet dynamically ───
  const dashPetEmoji = document.getElementById('dash-pet-emoji');
  const dashPetName = document.getElementById('dash-pet-name');
  const dashPetPath = document.getElementById('dash-pet-path');
  const dashPetGreeting = document.getElementById('dash-pet-greeting');
  const dashPetCareBtn = document.getElementById('dash-pet-care-btn');
  const dashSugarSection = document.getElementById('dash-sugar-section');

  if (dashPetEmoji && dashPetName) {
    const petKey = getSelectedPet() || 'asthma';
    const pet = PET_DATA[petKey] || PET_DATA.asthma;
    const profile = getPetProfile();
    const displayName = profile.petNickname || pet.name;

    dashPetEmoji.textContent = pet.emoji;
    dashPetName.textContent = displayName;
    if (dashPetPath) dashPetPath.textContent = pet.path + ' Path';
    if (dashPetGreeting) dashPetGreeting.textContent = displayName + ' is feeling energetic today!';
    if (dashPetCareBtn) dashPetCareBtn.textContent = 'Care for ' + displayName;

    // Level badge
    const levelBadge = document.getElementById('dash-level-badge');
    if (levelBadge) levelBadge.textContent = '⭐ Level ' + (profile.level || 1);

    // Blood sugar section (only for DiaPet)
    if (dashSugarSection) {
      if (petKey === 'diabetes') {
        dashSugarSection.style.display = 'block';
        const sugarVal = profile.bloodSugar || 110;
        const sugarBar = document.getElementById('dash-sugar-bar');
        const sugarLabel = document.getElementById('dash-sugar-value');
        const sugarStatus = document.getElementById('dash-sugar-status');
        if (sugarBar) {
          sugarBar.style.width = getBloodSugarPercent(sugarVal) + '%';
          sugarBar.style.background = getBloodSugarColor(sugarVal);
        }
        if (sugarLabel) sugarLabel.textContent = sugarVal + ' mg/dL';
        if (sugarStatus) {
          sugarStatus.textContent = getBloodSugarStatus(sugarVal);
        }
      } else {
        dashSugarSection.style.display = 'none';
      }
    }
  }

  // ─── Pet Page: load dynamically ───
  const petAvatar = document.getElementById('pet-avatar');
  const petTitle = document.getElementById('pet-title');
  const petFeeling = document.getElementById('pet-feeling');
  const petLevelBadge = document.getElementById('pet-level-badge');
  const petNicknameInput = document.getElementById('pet-nickname-input');
  const petPageTitle = document.getElementById('pet-page-title');
  const petSugarSection = document.getElementById('pet-sugar-section');
  const petXpBar = document.getElementById('pet-xp-bar');
  const petXpLabel = document.getElementById('pet-xp-label');
  const petActionsContainer = document.getElementById('pet-actions');

  if (petAvatar && petTitle) {
    const petKey = getSelectedPet() || 'asthma';
    const pet = PET_DATA[petKey] || PET_DATA.asthma;
    const profile = getPetProfile();
    const displayName = profile.petNickname || pet.name;

    petAvatar.textContent = pet.emoji;
    petTitle.textContent = displayName;
    if (petPageTitle) document.title = displayName + ' - CarePet';
    if (petFeeling) petFeeling.textContent = displayName + ' is feeling peaceful today.';
    if (petLevelBadge) petLevelBadge.textContent = 'Level ' + (profile.level || 1);
    if (petNicknameInput) petNicknameInput.value = profile.petNickname || '';

    // XP bar
    if (petXpBar && petXpLabel) {
      const xp = profile.xp || 0;
      const xpToNext = profile.xpToNext || 100;
      petXpBar.style.width = ((xp / xpToNext) * 100) + '%';
      petXpLabel.textContent = xp + ' / ' + xpToNext + ' XP';
    }

    // Actions
    if (petActionsContainer && pet.actions) {
      petActionsContainer.innerHTML = '';
      pet.actions.forEach(action => {
        const btn = document.createElement('button');
        btn.className = action.label.includes('Insulin') || action.label.includes('Inhaler') || action.label.includes('Therapy') || action.label.includes('Heart Check') || action.label.includes('Calm Down') || action.label.includes('Relax') || action.label.includes('Learn Foods')
          ? 'btn btn-primary' : 'btn btn-secondary';
        btn.style.borderRadius = 'var(--radius-full)';
        btn.innerHTML = '<span class="mr-2">' + action.emoji + '</span> ' + action.label;
        btn.addEventListener('click', () => {
          const prof = getPetProfile();
          prof.xp = (prof.xp || 0) + 10;
          if (prof.xp >= (prof.xpToNext || 100)) {
            prof.level = (prof.level || 1) + 1;
            prof.xp = 0;
            prof.xpToNext = (prof.xpToNext || 100) + 50;
            alert('🎉 ' + displayName + ' leveled up to Level ' + prof.level + '!');
          }
          savePetProfile(prof);
          if (petXpBar && petXpLabel) {
            petXpBar.style.width = ((prof.xp / prof.xpToNext) * 100) + '%';
            petXpLabel.textContent = prof.xp + ' / ' + prof.xpToNext + ' XP';
          }
          if (petLevelBadge) petLevelBadge.textContent = 'Level ' + prof.level;
        });
        petActionsContainer.appendChild(btn);
      });
    }

    // Blood sugar (only for DiaPet)
    if (petSugarSection) {
      if (petKey === 'diabetes') {
        petSugarSection.style.display = 'block';
        const sugarVal = profile.bloodSugar || 110;
        const bar = document.getElementById('pet-sugar-bar');
        const label = document.getElementById('pet-sugar-value');
        const status = document.getElementById('pet-sugar-status');
        if (bar) {
          bar.style.width = getBloodSugarPercent(sugarVal) + '%';
          bar.style.background = getBloodSugarColor(sugarVal);
        }
        if (label) label.textContent = sugarVal + ' mg/dL';
        if (status) status.textContent = getBloodSugarStatus(sugarVal);

        // Simulate blood sugar changes
        const sugarUpBtn = document.getElementById('sugar-up-btn');
        const sugarDownBtn = document.getElementById('sugar-down-btn');
        if (sugarUpBtn) sugarUpBtn.addEventListener('click', () => updateSugar(20));
        if (sugarDownBtn) sugarDownBtn.addEventListener('click', () => updateSugar(-20));
      } else {
        petSugarSection.style.display = 'none';
      }
    }
  }

  function updateSugar(delta) {
    const profile = getPetProfile();
    profile.bloodSugar = Math.max(40, Math.min(300, (profile.bloodSugar || 110) + delta));
    savePetProfile(profile);
    const bar = document.getElementById('pet-sugar-bar');
    const label = document.getElementById('pet-sugar-value');
    const status = document.getElementById('pet-sugar-status');
    if (bar) {
      bar.style.width = getBloodSugarPercent(profile.bloodSugar) + '%';
      bar.style.background = getBloodSugarColor(profile.bloodSugar);
    }
    if (label) label.textContent = profile.bloodSugar + ' mg/dL';
    if (status) status.textContent = getBloodSugarStatus(profile.bloodSugar);
  }

  // ─── Task checkboxes ───
  const taskCheckboxes = document.querySelectorAll('.task-checkbox');
  taskCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const taskCard = e.target.closest('.task-item');
      if (e.target.checked) {
        taskCard.style.opacity = '0.5';
        taskCard.style.textDecoration = 'line-through';
      } else {
        taskCard.style.opacity = '1';
        taskCard.style.textDecoration = 'none';
      }
    });
  });
});
