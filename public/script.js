const BASE_URL = "https://student-e-portfolio-production.up.railway.app";

/* -------------------- SECTION CONTROL -------------------- */
const loginSection     = document.getElementById("loginSection");
const registerSection  = document.getElementById("registerSection");
const dashboardSection = document.getElementById("dashboardSection");
const portfolioSection = document.getElementById("portfolioSection");

/* -------------------- INPUTS -------------------- */
const loginEmail         = document.getElementById("loginEmail");
const loginPassword      = document.getElementById("loginPassword");
const regUsername        = document.getElementById("regUsername");
const regName            = document.getElementById("regName");
const regEmail           = document.getElementById("regEmail");
const regPassword        = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const intro              = document.getElementById("intro");
const profilePic         = document.getElementById("profilePic");
const skill              = document.getElementById("skill");
const certTitle          = document.getElementById("certTitle");
const certFile           = document.getElementById("certFile");
const platform           = document.getElementById("platform");
const url                = document.getElementById("url");

/* -------------------- TOAST -------------------- */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.add("hidden"), duration);
}

/* -------------------- SECTION TOGGLE -------------------- */
function showLogin() {
  loginSection.classList.remove("hidden");
  registerSection.classList.add("hidden");
  dashboardSection.classList.add("hidden");
  portfolioSection.classList.add("hidden");
  document.getElementById("overviewSection").classList.add("hidden");
  const authBtn = document.getElementById("authThemeBtn");
  if (authBtn) authBtn.style.display = "flex";
}

function showRegister() {
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
  dashboardSection.classList.add("hidden");
  portfolioSection.classList.add("hidden");
  document.getElementById("overviewSection").classList.add("hidden");
  const authBtn = document.getElementById("authThemeBtn");
  if (authBtn) authBtn.style.display = "flex";
}

/* -------------------- REGISTER -------------------- */
function register() {
  const username        = regUsername.value.trim();
  const fullname        = regName.value.trim();
  const email           = regEmail.value.trim();
  const password        = regPassword.value;
  const confirmPassword = regConfirmPassword.value;

  if (!username || !fullname || !email || !password || !confirmPassword) {
    showToast("Please fill in all fields.");
    return;
  }

  if (password.length < 8) {
    showToast("Password must be at least 8 characters.");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match!");
    return;
  }

  fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, fullname, email, password, confirmPassword })
  })
  .then(res => res.json().then(data => ({ ok: res.ok, data })))
  .then(({ ok, data }) => {
    showToast(data.message);
    if (ok && data.message === "Registered successfully") {
      regUsername.value = regName.value = regEmail.value = regPassword.value = regConfirmPassword.value = "";
      showLogin();
    }
  })
  .catch(err => { console.error("Register error:", err); showToast("Server error"); });
}

/* -------------------- LOGIN -------------------- */
function login() {
  const email    = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) { showToast("Please enter email and password."); return; }

  fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.user) {
      localStorage.setItem("userId", data.user.id);
      loginSection.classList.add("hidden");
      registerSection.classList.add("hidden");
      showOverview();
      updateUsernameDisplay(data.user.username || data.user.fullname || "User");
      loadUserProfile(data.user);
      loadSocialsFromDB(data.user.id);
      loadCertificatesFromDB(data.user.id);
      loadSkillsFromDB(data.user.id);
      loadUserFromServer(data.user.id);
    } else {
      showToast(data.message);
    }
  });
}

/* -------------------- PASSWORD TOGGLE -------------------- */
function togglePassword(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    button.classList.add("password-visible");
  } else {
    input.type = "password";
    button.classList.remove("password-visible");
  }
}

/* -------------------- PASSWORD HINT -------------------- */
function updatePasswordHint(value) {
  const hint = document.getElementById("passwordHint");
  if (!hint) return;
  const len = value.length;
  if (len === 0) {
    hint.textContent = "At least 8 characters";
    hint.className = "password-hint";
  } else if (len < 8) {
    hint.textContent = `${8 - len} more character${8 - len === 1 ? "" : "s"} needed`;
    hint.className = "password-hint hint-weak";
  } else {
    hint.textContent = "✓ Password length looks good";
    hint.className = "password-hint hint-ok";
  }
}

/* -------------------- LOGOUT -------------------- */
function openLogoutModal()  { document.getElementById("logoutModal").classList.remove("hidden"); }
function closeLogoutModal() { document.getElementById("logoutModal").classList.add("hidden"); }

function confirmLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  closeLogoutModal();
  showLogin();
}

/* -------------------- USER PROFILE -------------------- */
function loadUserProfile(user) {
  const previewBox  = document.getElementById("introPreview");
  const previewText = previewBox.querySelector(".intro-text");

  if (user.introduction && user.introduction.trim() !== "") {
    intro.value = user.introduction;
    previewText.textContent = user.introduction;
    previewBox.style.display = "block";
    const ep = document.getElementById("introPreviewEmpty");
    if (ep) ep.style.display = "none";
  } else {
    intro.value = "";
    previewText.textContent = "";
    previewBox.style.display = "none";
    const ep = document.getElementById("introPreviewEmpty");
    if (ep) ep.style.display = "flex";
  }
}

function updateUsernameDisplay(name) {
  const usernameSpan = document.getElementById("usernameDisplay");
  const welcomeMsg   = document.getElementById("welcomeMessage");
  if (usernameSpan) usernameSpan.textContent = name;
  if (welcomeMsg) {
    const possessive = name.endsWith('s') ? `${name}'` : `${name}'s`;
    welcomeMsg.textContent = `${possessive} E-Portfolio`;
  }
}

/* -------------------- SAVE INTRO -------------------- */
function saveIntro() {
  const userId    = localStorage.getItem("userId");
  const introText = intro.value.trim();

  if (!userId) { showToast("Please login first."); return; }

  const previewBox  = document.getElementById("introPreview");
  const previewText = previewBox.querySelector(".intro-text");

  previewText.textContent = introText;
  previewBox.style.display = introText ? "block" : "none";
  const emptyPlaceholder = document.getElementById("introPreviewEmpty");
  if (emptyPlaceholder) emptyPlaceholder.style.display = introText ? "none" : "flex";

  fetch(`${BASE_URL}/save-intro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, introduction: introText })
  })
  .then(res => res.json())
  .then(() => showToast("Introduction saved ✓"))
  .catch(() => showToast("Failed to save introduction"));
}

/* -------------------- SKILLS -------------------- */
function addSkill() {
  const skillValue = skill.value.trim();
  if (!skillValue) { showToast("Please enter a skill."); return; }

  const userId = localStorage.getItem("userId");
  if (!userId) { showToast("Please login first"); return; }

  fetch(`${BASE_URL}/add-skill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, skill: skillValue })
  })
  .then(res => res.json())
  .then(() => { loadSkillsFromDB(userId); skill.value = ""; showToast("Skill added ✓"); })
  .catch(() => showToast("Failed to save skill"));
}

function deleteSkill(skillName, btn) {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  fetch(`${BASE_URL}/delete-skill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, skill: skillName })
  })
  .then(res => res.json())
  .then(() => { showToast("Skill removed ✓"); loadSkillsFromDB(userId); })
  .catch(() => showToast("Failed to delete skill"));
}

function loadSkillsFromDB(userId) {
  fetch(`${BASE_URL}/skills/${userId}`)
    .then(res => res.json())
    .then(data => renderSkills(data.map(r => r.skill_name)))
    .catch(err => console.error("Failed to load skills", err));
}

function renderSkills(skills) {
  const tabList = document.getElementById("skillList");
  if (tabList) {
    tabList.innerHTML = "";
    skills.forEach(s => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${escapeHtml(s)}</span>
        <button class="skill-del-btn" onclick="deleteSkill('${escapeHtml(s).replace(/'/g,"\\'")}', this)" title="Remove">✕</button>`;
      tabList.appendChild(li);
    });
  }

  const statSkills = document.getElementById("statSkills");
  if (statSkills) statSkills.textContent = skills.length;

  const overviewStatSkills = document.getElementById("overviewStatSkills");
  if (overviewStatSkills) overviewStatSkills.textContent = skills.length;

  const skillsPreview      = document.getElementById("skillsPreview");
  const skillsPreviewTags  = document.getElementById("skillsPreviewTags");
  const skillsPreviewEmpty = document.getElementById("skillsPreviewEmpty");
  if (skillsPreview && skillsPreviewTags && skillsPreviewEmpty) {
    if (skills.length > 0) {
      skillsPreviewTags.innerHTML = skills.map(s =>
        `<span class="pf-skill-pill">${escapeHtml(s)}</span>`
      ).join("");
      skillsPreview.style.display = "block";
      skillsPreviewEmpty.style.display = "none";
    } else {
      skillsPreviewTags.innerHTML = "";
      skillsPreview.style.display = "none";
      skillsPreviewEmpty.style.display = "flex";
    }
  }

  const overviewSkills = document.getElementById("overviewSkills");
  if (overviewSkills) {
    overviewSkills.innerHTML = skills.length > 0
      ? skills.map(s => `<span class="pf-skill-pill">${escapeHtml(s)}</span>`).join("")
      : `<p class="pf-placeholder">No skills added yet.</p>`;
  }
}

/* -------------------- CERTIFICATES -------------------- */
function updateFileLabel(input) {
  const label = document.getElementById("certFileLabel");
  if (label && input.files[0]) label.textContent = input.files[0].name;
}

function addCertificate() {
  const title  = certTitle.value.trim();
  const file   = certFile.files[0];
  const userId = localStorage.getItem("userId");

  if (!title || !file) { showToast("Please enter a title and choose a file."); return; }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("certificate", file);
  formData.append("userId", userId);

  fetch(`${BASE_URL}/add-certificate`, { method: "POST", body: formData })
    .then(res => res.json())
    .then(() => {
      showToast("Certificate uploaded ✓");
      certTitle.value = "";
      certFile.value  = "";
      const label = document.getElementById("certFileLabel");
      if (label) label.textContent = "Click to choose a file";
      loadCertificatesFromDB(userId);
    })
    .catch(() => showToast("Upload failed"));
}

function deleteCertificate(certId, btn) {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  fetch(`${BASE_URL}/delete-certificate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, certId })
  })
  .then(res => res.json())
  .then(() => { showToast("Certificate removed ✓"); loadCertificatesFromDB(userId); })
  .catch(() => showToast("Failed to delete certificate"));
}

function loadCertificatesFromDB(userId) {
  fetch(`${BASE_URL}/certificates/${userId}`)
    .then(res => res.json())
    .then(data => renderCertificates(data))
    .catch(err => console.error("Failed to load certificates", err));
}

function renderCertificates(certs) {
  const certsPreview      = document.getElementById("certsPreview");
  const certsPreviewGrid  = document.getElementById("certsPreviewGrid");
  const certsPreviewEmpty = document.getElementById("certsPreviewEmpty");
  if (certsPreview && certsPreviewGrid && certsPreviewEmpty) {
    if (certs.length > 0) {
      certsPreviewGrid.innerHTML = certs.map(cert => {
        const isImg = cert.file_path.match(/\.(jpg|jpeg|png|gif)$/i);
        const thumb = isImg
          ? `<img src="${cert.file_path}" class="cert-thumb" alt="">`
          : `<div class="cert-thumb-pdf">📄</div>`;
        return `<div class="ed-cert-preview-item">${thumb}<span style="flex:1">${escapeHtml(cert.title)}</span><button class="skill-del-btn" onclick="deleteCertificate(${cert.id}, this)" title="Remove">✕</button></div>`;
      }).join("");
      certsPreview.style.display = "block";
      certsPreviewEmpty.style.display = "none";
    } else {
      certsPreviewGrid.innerHTML = "";
      certsPreview.style.display = "none";
      certsPreviewEmpty.style.display = "flex";
    }
  }

  const overviewCerts = document.getElementById("overviewCerts");
  if (overviewCerts) {
    if (certs.length > 0) {
      overviewCerts.innerHTML = certs.map(cert => {
        const isImg = cert.file_path.match(/\.(jpg|jpeg|png|gif)$/i);
        const isPdf = cert.file_path.match(/\.pdf$/i);
        let preview = "";
        if (isImg) preview = `<img src="${cert.file_path}" class="pf-cert-preview" alt="${escapeHtml(cert.title)}">`;
        if (isPdf) preview = `<div class="pf-cert-pdf-preview">📄</div>`;
        return `
          <div class="pf-cert-card">
            ${preview}
            <div class="pf-cert-info">
              <h4>${escapeHtml(cert.title)}</h4>
              <a href="${cert.file_path}" target="_blank" class="pf-cert-link">View Certificate</a>
            </div>
          </div>`;
      }).join("");
    } else {
      overviewCerts.innerHTML = `<p class="pf-placeholder">No certificates added yet.</p>`;
    }
  }

  const statCerts = document.getElementById("statCerts");
  if (statCerts) statCerts.textContent = certs.length;

  const overviewStatCerts = document.getElementById("overviewStatCerts");
  if (overviewStatCerts) overviewStatCerts.textContent = certs.length;
}

/* -------------------- SOCIALS -------------------- */
function addSocial() {
  const platformValue = platform.value.trim();
  const urlValue      = url.value.trim();
  const userId        = localStorage.getItem("userId");

  if (!platformValue || !urlValue) { showToast("Please enter platform and URL."); return; }
  if (!userId) { showToast("Please login first."); return; }

  fetch(`${BASE_URL}/add-social`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, platform: platformValue, url: urlValue })
  })
  .then(res => res.json())
  .then(() => {
    showToast("Social link added ✓");
    platform.value = "";
    url.value = "";
    loadSocialsFromDB(userId);
  })
  .catch(() => showToast("Failed to save social link"));
}

function deleteSocial(socialId, btn) {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  fetch(`${BASE_URL}/delete-social`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, socialId })
  })
  .then(res => res.json())
  .then(() => { showToast("Social link removed ✓"); loadSocialsFromDB(userId); })
  .catch(() => showToast("Failed to delete social link"));
}

function loadSocialsFromDB(userId) {
  fetch(`${BASE_URL}/socials/${userId}`)
    .then(res => res.json())
    .then(data => renderSocials(data))
    .catch(err => console.error("Failed to load socials", err));
}

function renderSocials(socials) {
  const list = document.getElementById("socialList");
  if (list) {
    list.innerHTML = "";
    socials.forEach(s => {
      const detected = detectPlatformFromUrl(s.url) || s.platform;
      const icon = getSocialIcon(detected);
      const li = document.createElement("li");
      li.innerHTML = `
        <span style="display:flex;align-items:center;gap:10px;">
          <span class="social-icon">${icon}</span>
          <span style="font-weight:600;">${escapeHtml(s.platform)}</span>
        </span>
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:13px;color:var(--text-soft)">${escapeHtml(s.url)}</span>
          <button class="skill-del-btn" onclick="deleteSocial(${s.id}, this)" title="Remove">✕</button>
        </div>`;
      list.appendChild(li);
    });
  }

  const statSocials = document.getElementById("statSocials");
  if (statSocials) statSocials.textContent = socials.length;

  const overviewStatSocials = document.getElementById("overviewStatSocials");
  if (overviewStatSocials) overviewStatSocials.textContent = socials.length;

  const socialsPreview      = document.getElementById("socialsPreview");
  const socialsPreviewCards = document.getElementById("socialsPreviewCards");
  const socialsPreviewEmpty = document.getElementById("socialsPreviewEmpty");
  if (socialsPreview && socialsPreviewCards && socialsPreviewEmpty) {
    if (socials.length > 0) {
      socialsPreviewCards.innerHTML = socials.map(s => {
        const detected = detectPlatformFromUrl(s.url) || s.platform;
        const p    = escapeHtml(detected);
        const u    = escapeHtml(s.url);
        const icon = getSocialIcon(detected);
        return `
          <a href="${u}" target="_blank" class="pf-social-card ${p.toLowerCase()}">
            <span class="social-icon-name">
              <span class="social-icon">${icon}</span>
              <span class="social-name">${escapeHtml(s.platform)}</span>
            </span>
            <span class="social-url">${escapeHtml(s.url)}</span>
          </a>`;
      }).join("");
      socialsPreview.style.display = "block";
      socialsPreviewEmpty.style.display = "none";
    } else {
      socialsPreviewCards.innerHTML = "";
      socialsPreview.style.display = "none";
      socialsPreviewEmpty.style.display = "flex";
    }
  }

  const overviewSocials = document.getElementById("overviewSocials");
  if (overviewSocials) {
    if (socials.length > 0) {
      overviewSocials.innerHTML = socials.map(s => {
        const detected = detectPlatformFromUrl(s.url) || s.platform;
        const p    = escapeHtml(detected);
        const u    = escapeHtml(s.url);
        const icon = getSocialIcon(detected);
        return `
          <a href="${u}" target="_blank" class="pf-social-card ${p.toLowerCase()}">
            <span class="social-icon">${icon}</span>
            <span class="social-name">${escapeHtml(s.platform)}</span>
            <span class="social-url">${escapeHtml(s.url)}</span>
          </a>`;
      }).join("");
    } else {
      overviewSocials.innerHTML = `<p class="pf-placeholder">No social links added yet.</p>`;
    }
  }
}

/* -------------------- THEME -------------------- */
function updateThemeIcons(isDark) {
  document.querySelectorAll('.icon-moon').forEach(el => el.style.display = isDark ? 'none' : 'block');
  document.querySelectorAll('.icon-sun').forEach(el => el.style.display = isDark ? 'block' : 'none');
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcons(isDark);
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  document.body.classList.remove("light");
} else {
  document.body.classList.add("light");
  document.body.classList.remove("dark");
}
document.addEventListener("DOMContentLoaded", () => {
  updateThemeIcons(document.body.classList.contains("dark"));
});

/* -------------------- DASH SECTION SWITCHER -------------------- */
function showDashSection(id, btn) {
  document.querySelectorAll(".ed-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".ed-navbtn").forEach(b => b.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (btn) btn.classList.add("active");
}

/* -------------------- PROFILE PHOTO -------------------- */
const profilePicInput = document.getElementById("profilePic");
const previewPic      = document.getElementById("previewPic");

let selectedProfileFile = null;

profilePicInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  selectedProfileFile = file;

  const reader = new FileReader();
  reader.onload = e => { previewPic.src = e.target.result; };
  reader.readAsDataURL(file);

  saveProfilePhoto();
});

document.getElementById("changePhotoBtn").addEventListener("click", () => {
  profilePic.click();
});

document.getElementById("deletePhotoBtn").onclick = () => {
  document.getElementById("deletePhotoModal").classList.remove("hidden");
};

function closeDeletePhotoModal() {
  document.getElementById("deletePhotoModal").classList.add("hidden");
}

function confirmDeletePhoto() {
  const userId = localStorage.getItem("userId");
  fetch(`${BASE_URL}/delete-profile-pic`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  })
  .then(res => res.json())
  .then(() => {
    showToast("Photo removed ✓");
    document.getElementById("previewPic").src = "/default-avatar.png";
    const overviewPic = document.getElementById("overviewPic");
    if (overviewPic) overviewPic.src = "/default-avatar.png";
    profilePic.value = "";
    closeDeletePhotoModal();
  })
  .catch(() => showToast("Failed to delete photo."));
}

function saveProfilePhoto() {
  const userId = localStorage.getItem("userId");
  if (!selectedProfileFile) return;

  const formData = new FormData();
  formData.append("profilePic", selectedProfileFile);
  formData.append("userId", userId);

  fetch(`${BASE_URL}/upload-profile-pic`, { method: "POST", body: formData })
    .then(res => res.json())
    .then(() => { showToast("Photo updated ✓"); selectedProfileFile = null; })
    .catch(() => showToast("Failed to upload photo."));
}

/* -------------------- LOAD FROM SERVER -------------------- */
function loadUserFromServer(userId) {
  fetch(`${BASE_URL}/user/${userId}`)
    .then(res => res.json())
    .then(user => {
      updateUsernameDisplay(user.username || user.fullname || "User");

      const previewBox  = document.getElementById("introPreview");
      const previewText = previewBox.querySelector(".intro-text");

      if (user.introduction && user.introduction.trim() !== "") {
        intro.value = user.introduction;
        previewText.textContent = user.introduction;
        previewBox.style.display = "block";
        const ep = document.getElementById("introPreviewEmpty");
        if (ep) ep.style.display = "none";
      } else {
        intro.value = "";
        previewText.textContent = "";
        previewBox.style.display = "none";
        const ep = document.getElementById("introPreviewEmpty");
        if (ep) ep.style.display = "flex";
      }

      if (previewPic) previewPic.src = user.profile_pic || "/default-avatar.png";

      loadSkillsFromDB(userId);
      loadSocialsFromDB(userId);
      loadCertificatesFromDB(userId);
    })
    .catch(() => showLogin());
}

/* -------------------- OVERVIEW -------------------- */
function showOverview() {
  loginSection.classList.add("hidden");
  registerSection.classList.add("hidden");
  dashboardSection.classList.add("hidden");
  portfolioSection.classList.add("hidden");
  const authBtn = document.getElementById("authThemeBtn");
  if (authBtn) authBtn.style.display = "none";

  const overviewSection = document.getElementById("overviewSection");
  overviewSection.classList.remove("hidden");

  const userId = localStorage.getItem("userId");
  if (userId) loadOverviewData(userId);
}

function showDashboard() {
  loginSection.classList.add("hidden");
  registerSection.classList.add("hidden");
  document.getElementById("overviewSection").classList.add("hidden");
  portfolioSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
  const authBtn = document.getElementById("authThemeBtn");
  if (authBtn) authBtn.style.display = "none";

  const userId = localStorage.getItem("userId");
  if (userId) loadUserFromServer(userId);
}

function loadOverviewData(userId) {
  document.querySelectorAll("#overviewSection .pf-section").forEach(p => p.classList.remove("active"));
  document.getElementById("overviewIntroSection").classList.add("active");

  document.querySelectorAll(".pf-topbtn, .pf-sidebar-navbtn").forEach(b => b.classList.remove("active"));
  const firstTopBtn = document.querySelector(".pf-topbar-nav .pf-topbtn");
  if (firstTopBtn) firstTopBtn.classList.add("active");

  fetch(`${BASE_URL}/user/${userId}`)
    .then(res => res.json())
    .then(user => {
      document.getElementById("overviewName").textContent     = user.fullname || user.username || "User";
      document.getElementById("overviewUsername").textContent = `@${user.username || "user"}`;

      const overviewPic = document.getElementById("overviewPic");
      if (overviewPic) overviewPic.src = user.profile_pic || "/default-avatar.png";

      const introContent = document.getElementById("overviewIntro");
      introContent.innerHTML = user.introduction && user.introduction.trim()
        ? `<p>${escapeHtml(user.introduction)}</p>`
        : `<p class="pf-placeholder">No introduction added yet.</p>`;
    })
    .catch(err => console.error("Failed to load user data:", err));

  fetch(`${BASE_URL}/skills/${userId}`)
    .then(res => res.json())
    .then(skills => {
      const container = document.getElementById("overviewSkills");
      container.innerHTML = skills.length > 0
        ? skills.map(s => `<span class="pf-skill-pill">${escapeHtml(s.skill_name)}</span>`).join("")
        : `<p class="pf-placeholder">No skills added yet.</p>`;
      const statEl = document.getElementById("overviewStatSkills");
      if (statEl) statEl.textContent = skills.length;
    });

  fetch(`${BASE_URL}/certificates/${userId}`)
    .then(res => res.json())
    .then(certs => {
      const container = document.getElementById("overviewCerts");
      if (certs.length > 0) {
        container.innerHTML = certs.map(cert => {
          const isImg = cert.file_path.match(/\.(jpg|jpeg|png|gif)$/i);
          const isPdf = cert.file_path.match(/\.pdf$/i);
          let preview = "";
          if (isImg) preview = `<img src="${cert.file_path}" class="pf-cert-preview" alt="${escapeHtml(cert.title)}">`;
          if (isPdf) preview = `<div class="pf-cert-pdf-preview">📄</div>`;
          return `
            <div class="pf-cert-card">
              ${preview}
              <div class="pf-cert-info">
                <h4>${escapeHtml(cert.title)}</h4>
                <a href="${cert.file_path}" target="_blank" class="pf-cert-link">View Certificate</a>
              </div>
            </div>`;
        }).join("");
      } else {
        container.innerHTML = `<p class="pf-placeholder">No certificates added yet.</p>`;
      }
      const statEl = document.getElementById("overviewStatCerts");
      if (statEl) statEl.textContent = certs.length;
    });

  fetch(`${BASE_URL}/socials/${userId}`)
    .then(res => res.json())
    .then(socials => {
      const container = document.getElementById("overviewSocials");
      if (socials.length > 0) {
        container.innerHTML = socials.map(s => {
          const detected = detectPlatformFromUrl(s.url) || s.platform;
          const p    = escapeHtml(detected);
          const u    = escapeHtml(s.url);
          const icon = getSocialIcon(detected);
          return `
            <a href="${u}" target="_blank" class="pf-social-card ${p.toLowerCase()}">
              <span class="social-icon-name">
                <span class="social-icon">${icon}</span>
                <span class="social-name">${escapeHtml(s.platform)}</span>
              </span>
              <span class="social-url">${escapeHtml(s.url)}</span>
            </a>`;
        }).join("");
      } else {
        container.innerHTML = `<p class="pf-placeholder">No social links added yet.</p>`;
      }
      const statEl = document.getElementById("overviewStatSocials");
      if (statEl) statEl.textContent = socials.length;
    });
}

function showOverviewTab(id, btn) {
  document.querySelectorAll("#overviewSection .pf-section")
    .forEach(sec => sec.classList.remove("active"));
  document.querySelectorAll(".pf-topbtn")
    .forEach(b => b.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if (btn) btn.classList.add("active");
}

/* -------------------- HELPERS -------------------- */
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function detectPlatformFromUrl(url) {
  const u = (url || "").toLowerCase();
  if (u.includes("instagram.com"))  return "instagram";
  if (u.includes("facebook.com"))   return "facebook";
  if (u.includes("twitter.com"))    return "twitter";
  if (u.includes("x.com"))          return "x";
  if (u.includes("linkedin.com"))   return "linkedin";
  if (u.includes("github.com"))     return "github";
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("tiktok.com"))     return "tiktok";
  if (u.includes("pinterest.com"))  return "pinterest";
  if (u.includes("snapchat.com"))   return "snapchat";
  if (u.includes("reddit.com"))     return "reddit";
  if (u.includes("discord.gg") || u.includes("discord.com")) return "discord";
  if (u.includes("twitch.tv"))      return "twitch";
  if (u.includes("spotify.com"))    return "spotify";
  return null;
}

function getSocialIcon(platform) {
  const p = (detectPlatformFromUrl(platform) || platform || "").toLowerCase().trim();
  const igId = "ig_" + Math.random().toString(36).slice(2, 8);
  const icons = {
    instagram: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="${igId}" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="50%" stop-color="#fd5949"/><stop offset="68%" stop-color="#d6249f"/><stop offset="100%" stop-color="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill="url(#${igId})"/><circle cx="12" cy="12" r="4.5" stroke="white" stroke-width="1.8" fill="none"/><circle cx="17.2" cy="6.8" r="1.1" fill="white"/></svg>`,
    facebook:  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#1877F2"/><path d="M15.5 8H13.5C13.2 8 13 8.2 13 8.5V10H15.5L15.1 12.5H13V19H10.5V12.5H9V10H10.5V8.5C10.5 6.6 11.8 5.5 13.5 5.5C14.3 5.5 15.1 5.6 15.5 5.7V8Z" fill="white"/></svg>`,
    twitter:   `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#1DA1F2"/><path d="M19 7.5C18.4 7.8 17.8 7.9 17.1 8C17.8 7.6 18.3 6.9 18.5 6.1C17.8 6.5 17.1 6.8 16.3 6.9C15.6 6.2 14.7 5.8 13.7 5.8C11.7 5.8 10.1 7.4 10.1 9.4C10.1 9.7 10.1 9.9 10.2 10.1C7.3 10 4.8 8.6 3.1 6.4C2.8 6.9 2.6 7.5 2.6 8.2C2.6 9.4 3.2 10.5 4.1 11.2C3.6 11.2 3.1 11 2.6 10.8C2.6 12.6 3.8 14.1 5.4 14.4C5.1 14.5 4.8 14.5 4.4 14.5C4.2 14.5 3.9 14.5 3.7 14.4C4.2 15.9 5.6 17 7.3 17C6 18 4.4 18.6 2.7 18.6C2.4 18.6 2.1 18.6 1.8 18.5C3.5 19.6 5.5 20.2 7.6 20.2C13.7 20.2 17 14.5 17 9.6V9.1C17.7 8.7 18.4 8.1 19 7.5Z" fill="white"/></svg>`,
    x:         `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#000"/><path d="M17.5 5h-2.3l-3.2 4-3-4H5.5l4.7 6.3L5.5 19h2.3l3.5-4.4 3.2 4.4H19l-5-6.7L17.5 5zm-2.8 12-8-10.5h1.8l8 10.5h-1.8z" fill="white"/></svg>`,
    linkedin:  `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#0A66C2"/><path d="M7 9.5H9.5V17H7V9.5ZM8.25 8.5C7.56 8.5 7 7.94 7 7.25S7.56 6 8.25 6 9.5 6.56 9.5 7.25 8.94 8.5 8.25 8.5ZM17 17H14.5V13.25C14.5 12.28 14.48 11 13.12 11 11.75 11 11.5 12.08 11.5 13.17V17H9V9.5H11.4V10.56H11.44C11.77 9.93 12.58 9.25 13.78 9.25 16.31 9.25 17 10.9 17 13.06V17Z" fill="white"/></svg>`,
    github:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#24292E"/><path d="M12 3C7 3 3 7.1 3 12.2C3 16.3 5.6 19.8 9.2 21C9.7 21.1 9.9 20.8 9.9 20.5V18.9C7.3 19.5 6.7 17.7 6.7 17.7C6.3 16.7 5.6 16.4 5.6 16.4C4.7 15.8 5.7 15.8 5.7 15.8C6.7 15.9 7.2 16.9 7.2 16.9C8.1 18.4 9.6 18 10 17.7C10.1 17.1 10.3 16.7 10.6 16.4C8.5 16.2 6.3 15.4 6.3 11.7C6.3 10.6 6.7 9.8 7.2 9.1C7.1 8.8 6.8 7.9 7.3 6.7C7.3 6.7 8.2 6.4 9.9 7.5C10.6 7.3 11.3 7.2 12 7.2C12.7 7.2 13.4 7.3 14.1 7.5C15.8 6.4 16.7 6.7 16.7 6.7C17.2 7.9 16.9 8.8 16.8 9.1C17.3 9.8 17.7 10.6 17.7 11.7C17.7 15.4 15.5 16.2 13.4 16.4C13.7 16.8 14 17.4 14 18.3V20.5C14 20.8 14.2 21.1 14.7 21C18.4 19.8 21 16.3 21 12.2C21 7.1 17 3 12 3Z" fill="white"/></svg>`,
    youtube:   `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M19.8 8.2C19.6 7.4 18.9 6.8 18.2 6.6C16.9 6.3 12 6.3 12 6.3C12 6.3 7.1 6.3 5.8 6.6C5 6.8 4.4 7.4 4.2 8.2C4 9.5 4 12 4 12C4 12 4 14.5 4.2 15.8C4.4 16.6 5 17.2 5.8 17.4C7.1 17.7 12 17.7 12 17.7C12 17.7 16.9 17.7 18.2 17.4C19 17.2 19.6 16.6 19.8 15.8C20 14.5 20 12 20 12C20 12 20 9.5 19.8 8.2ZM10.4 14.5V9.5L14.8 12L10.4 14.5Z" fill="white"/></svg>`,
    tiktok:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#000"/><path d="M17 8.5C16.2 8.5 15.5 8.2 15 7.7C14.4 7.1 14 6.3 14 5.4H11.5V15.4C11.5 16.3 10.8 17 9.9 17C9 17 8.3 16.3 8.3 15.4C8.3 14.5 9 13.8 9.9 13.8C10.1 13.8 10.3 13.8 10.5 13.9V11.3C10.3 11.3 10.1 11.2 9.9 11.2C7.7 11.2 5.9 13 5.9 15.3C5.9 17.6 7.7 19.4 9.9 19.4C12.1 19.4 14 17.6 14 15.3V10.3C14.9 11 16 11.4 17.2 11.4V8.9C17.1 8.5 17 8.5 17 8.5Z" fill="white"/></svg>`,
    pinterest: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#E60023"/><path d="M12 3C7 3 3 7 3 12C3 15.9 5.4 19.3 8.8 20.7C8.7 20 8.7 18.9 8.9 18.1L10.1 13.1C10.1 13.1 9.8 12.5 9.8 11.6C9.8 10.2 10.6 9.2 11.6 9.2C12.4 9.2 12.8 9.8 12.8 10.5C12.8 11.3 12.3 12.5 12 13.6C11.8 14.5 12.4 15.3 13.3 15.3C14.9 15.3 16 13.4 16 10.8C16 8.5 14.4 6.9 12 6.9C9.2 6.9 7.6 9 7.6 11.2C7.6 12 7.9 12.9 8.3 13.4C8.4 13.5 8.4 13.6 8.3 13.7L7.9 15.3C7.8 15.5 7.7 15.6 7.5 15.5C6.3 15 5.5 13.2 5.5 11.2C5.5 7.9 7.9 4.9 12.3 4.9C15.8 4.9 18.5 7.4 18.5 10.8C18.5 14.3 16.3 17.1 13.2 17.1C12.2 17.1 11.3 16.6 11 16L10.3 18.6C10.1 19.4 9.5 20.4 9.1 21C10.1 21.3 11 21.5 12 21.5C17 21.5 21 17.5 21 12.5C21 7 17 3 12 3Z" fill="white"/></svg>`,
    discord:   `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#5865F2"/><path d="M18.6 6.3C17.4 5.7 16.1 5.3 14.8 5.1L14.6 5.5C15.8 5.8 16.9 6.2 17.9 6.8C16.3 5.9 14.2 5.3 12 5.3C9.8 5.3 7.7 5.9 6.1 6.8C7.1 6.2 8.2 5.8 9.4 5.5L9.2 5.1C7.9 5.3 6.6 5.7 5.4 6.3C3.5 9.2 2.9 12 3.1 14.7C4.4 15.8 5.6 16.5 6.8 16.9L7.4 16.1C6.6 15.8 5.9 15.4 5.3 14.9C5.9 15.3 6.9 15.7 8 16L8.5 15.3C7.2 14.9 6.1 14.3 5.3 13.5C6.3 14.3 7.9 15 10 15.2C11.3 15.3 12 15.3 12 15.3C12 15.3 12.7 15.3 14 15.2C16.1 15 17.7 14.3 18.7 13.5C17.9 14.3 16.8 14.9 15.5 15.3L16 16C17.1 15.7 18.1 15.3 18.7 14.9C18.2 15.4 17.5 15.8 16.7 16.1L17.3 16.9C18.5 16.5 19.7 15.8 21 14.7C21.1 12 20.5 9.2 18.6 6.3ZM9.5 13C8.7 13 8 12.2 8 11.3C8 10.4 8.7 9.6 9.5 9.6C10.3 9.6 11 10.4 11 11.3C11 12.2 10.3 13 9.5 13ZM14.5 13C13.7 13 13 12.2 13 11.3C13 10.4 13.7 9.6 14.5 9.6C15.3 9.6 16 10.4 16 11.3C16 12.2 15.3 13 14.5 13Z" fill="white"/></svg>`,
    twitch:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#9146FF"/><path d="M6 4L4 7V19H8V22L11 19H14L20 13V4H6ZM18 12L15 15H12L9.5 17.5V15H7V6H18V12ZM15 9H13V12H15V9ZM11 9H9V12H11V9Z" fill="white"/></svg>`,
    reddit:    `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#FF4500"/><path d="M21 12C21 10.9 20.1 10 19 10C18.5 10 18 10.2 17.7 10.5C16.6 9.8 15.1 9.3 13.5 9.2L14.2 6.1L16.5 6.6C16.5 7.3 17.1 7.9 17.8 7.9C18.5 7.9 19.1 7.3 19.1 6.6C19.1 5.9 18.5 5.3 17.8 5.3C17.3 5.3 16.8 5.6 16.6 6L14 5.4C13.8 5.4 13.7 5.5 13.6 5.7L12.8 9.2C11.2 9.3 9.7 9.7 8.6 10.5C8.3 10.2 7.8 10 7.3 10C6.2 10 5.3 10.9 5.3 12C5.3 12.8 5.8 13.5 6.5 13.8C6.5 13.9 6.5 14 6.5 14.1C6.5 16.5 9 18.5 12.2 18.5C15.4 18.5 17.9 16.5 17.9 14.1C17.9 14 17.9 13.9 17.9 13.8C18.5 13.5 21 12.8 21 12ZM10 13C10 12.4 10.4 12 11 12C11.6 12 12 12.4 12 13C12 13.6 11.6 14 11 14C10.4 14 10 13.6 10 13ZM14.5 16C13.8 16.7 12.3 16.8 12 16.8C11.7 16.8 10.2 16.7 9.5 16C9.4 15.9 9.4 15.7 9.5 15.6C9.6 15.5 9.8 15.5 9.9 15.6C10.4 16.1 11.5 16.2 12 16.2C12.5 16.2 13.6 16.1 14.1 15.6C14.2 15.5 14.4 15.5 14.5 15.6C14.6 15.7 14.6 15.9 14.5 16ZM13 14C12.4 14 12 13.6 12 13C12 12.4 12.4 12 13 12C13.6 12 14 12.4 14 13C14 13.6 13.6 14 13 14Z" fill="white"/></svg>`,
    default:   `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#9b8590"/><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`
  };
  return icons[p] || icons.default;
}

/* -------------------- ON LOAD -------------------- */
window.addEventListener("load", () => {
  if (checkPublicPortfolioRoute()) {
    initEnhancedSparkles();
    return;
  }

  const userId = localStorage.getItem("userId");
  if (userId) {
    loginSection.classList.add("hidden");
    showOverview();
    loadUserFromServer(userId);
  } else {
    showLogin();
  }

  initEnhancedSparkles();
});

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function initEnhancedSparkles() {
  const container = document.getElementById('sparkle-container');
  if (!container) return;

  setInterval(() => {
    if (document.hidden) return;

    const p = document.createElement('div');
    p.className = 'sparkle';

    const size = Math.random() * 12 + 8;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    const duration = Math.random() * 3 + 5;

    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${startX}px`;
    p.style.top = `${startY}px`;
    p.style.setProperty('--duration', `${duration}s`);

    const colors = ['#ffffff', '#e8617a', '#ffb3c1', '#c9375a'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(p);

    const updateRepel = () => {
      const rect = p.getBoundingClientRect();
      const pX = rect.left + rect.width / 2;
      const pY = rect.top + rect.height / 2;
      const dx = mouseX - pX;
      const dy = mouseY - pY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200) {
        const force = (200 - distance) / 200;
        const moveX = (dx / distance) * force * -70;
        const moveY = (dy / distance) * force * -70;
        p.style.transform = `translate(${moveX}px, ${moveY}px)`;
      } else {
        p.style.transform = `translate(0, 0)`;
      }

      if (p.parentElement) requestAnimationFrame(updateRepel);
    };

    requestAnimationFrame(updateRepel);
    setTimeout(() => p.remove(), duration * 1000);
  }, 200);
}

/* -------------------- SHARE LINK -------------------- */
/* -------------------- SHARE LINK -------------------- */
function copyShareLink() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  fetch(`${BASE_URL}/user/${userId}`)
    .then(res => res.json())
    .then(user => {
      const link = `${window.location.origin}/portfolio/${user.username}`;

      // Method 1: Modern clipboard API (works on HTTPS or localhost)
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(() => {
          showToast("Portfolio link copied! ✓");
        });
        return;
      }

      // Method 2: Fallback using a temporary input (works on mobile HTTP)
      const input = document.createElement("input");
      input.style.position = "fixed";
      input.style.opacity = "0";
      input.value = link;
      document.body.appendChild(input);
      input.focus();
      input.select();
      input.setSelectionRange(0, 99999); // for mobile
      try {
        document.execCommand("copy");
        showToast("Portfolio link copied! ✓");
      } catch {
        // Method 3: Last resort — show the link in a toast so they can long-press copy
        showToast(`Your link: ${link}`, 6000);
      }
      document.body.removeChild(input);
    });
}

/* -------------------- PUBLIC PORTFOLIO RENDERER -------------------- */
function checkPublicPortfolioRoute() {
  const path = window.location.pathname;
  const match = path.match(/^\/portfolio\/([^/]+)$/);
  if (!match) return false;

  const username = match[1];
  renderPublicPortfolio(username);
  return true;
}

function renderPublicPortfolio(username) {
  ["loginSection","registerSection","dashboardSection","overviewSection"]
    .forEach(id => document.getElementById(id)?.classList.add("hidden"));

  const authBtn = document.getElementById("authThemeBtn");
  if (authBtn) authBtn.style.display = "none";

  const section = document.getElementById("portfolioSection");
  section.classList.remove("hidden");
  section.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;">
      <div style="text-align:center;color:var(--text-soft);font-size:15px;">Loading portfolio…</div>
    </div>`;

  fetch(`/api/portfolio/${encodeURIComponent(username)}`)
    .then(res => {
      if (!res.ok) throw new Error("Not found");
      return res.json();
    })
    .then(data => buildPublicPortfolioHTML(data))
    .catch(() => {
      section.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px;">
          <div style="font-size:48px;">✦</div>
          <h2 style="font-family:var(--font-display);color:var(--text);">Portfolio not found</h2>
          <p style="color:var(--text-soft);">The user <strong>@${escapeHtml(username)}</strong> doesn't exist.</p>
          <button class="btn-primary" style="width:auto;padding:12px 28px;" onclick="window.location.href='/'">
            Go Home
          </button>
        </div>`;
    });
}

function buildPublicPortfolioHTML(data) {
  const section = document.getElementById("portfolioSection");
  const pic = data.profile_pic || "/default-avatar.png";

  const skillsHTML = data.skills?.length
    ? data.skills.map(s => `<span class="pf-skill-pill">${escapeHtml(s.skill_name)}</span>`).join("")
    : `<p class="pf-placeholder">No skills added yet.</p>`;

  const certsHTML = data.certificates?.length
    ? data.certificates.map(cert => {
        const isImg = cert.file_path.match(/\.(jpg|jpeg|png|gif)$/i);
        const isPdf = cert.file_path.match(/\.pdf$/i);
        const preview = isImg
          ? `<img src="${cert.file_path}" class="pf-cert-preview" alt="${escapeHtml(cert.title)}">`
          : isPdf ? `<div class="pf-cert-pdf-preview">📄</div>` : "";
        return `
          <div class="pf-cert-card">
            ${preview}
            <div class="pf-cert-info">
              <h4>${escapeHtml(cert.title)}</h4>
              <a href="${cert.file_path}" target="_blank" class="pf-cert-link">View Certificate</a>
            </div>
          </div>`;
      }).join("")
    : `<p class="pf-placeholder">No certificates added yet.</p>`;

  const socialsHTML = data.socials?.length
    ? data.socials.map(s => {
        const detected = detectPlatformFromUrl(s.url) || s.platform;
        const icon = getSocialIcon(detected);
        return `
          <a href="${escapeHtml(s.url)}" target="_blank" class="pf-social-card ${escapeHtml(detected).toLowerCase()}">
            <span class="social-icon-name">
              <span class="social-icon">${icon}</span>
              <span class="social-name">${escapeHtml(s.platform)}</span>
            </span>
            <span class="social-url">${escapeHtml(s.url)}</span>
          </a>`;
      }).join("")
    : `<p class="pf-placeholder">No social links added yet.</p>`;

  section.innerHTML = `
    <nav class="pf-topbar">
      <div class="pf-topbar-logo">✦ E-Portfolio</div>
      <div class="pf-topbar-nav">
        <button class="pf-topbtn active" onclick="pubSwitchTab('pubIntro', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Profile</span>
        </button>
        <button class="pf-topbtn" onclick="pubSwitchTab('pubSkills', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>Skills</span>
        </button>
        <button class="pf-topbtn" onclick="pubSwitchTab('pubCerts', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
          <span>Certs</span>
        </button>
        <button class="pf-topbtn" onclick="pubSwitchTab('pubSocials', this)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          <span>Social</span>
        </button>
      </div>
      <div class="pf-topbar-actions">
        <button class="pf-topbtn" onclick="toggleTheme()" title="Toggle Theme">
          <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <span>Theme</span>
        </button>
        <button class="pf-topbtn" onclick="window.location.href='/'" title="Home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span>Home</span>
        </button>
      </div>
    </nav>

    <div class="pf-layout">
      <div class="pf-profile-sidebar">
        <div class="pf-avatar-wrap">
          <img src="${escapeHtml(pic)}" alt="Profile">
          <div class="pf-avatar-ring"></div>
        </div>
        <div class="pf-hero-text">
          <p class="pf-handle">@${escapeHtml(data.username || "user")}</p>
          <h1>${escapeHtml(data.fullname || data.username || "User")}</h1>
          <div class="pf-hero-divider"></div>
        </div>
        <div class="pf-sidebar-stats">
          <div class="pf-sidebar-stat">
            <div class="pf-sidebar-stat-num">${data.skills?.length ?? 0}</div>
            <div class="pf-sidebar-stat-label">Skills</div>
          </div>
          <div class="pf-sidebar-stat">
            <div class="pf-sidebar-stat-num">${data.certificates?.length ?? 0}</div>
            <div class="pf-sidebar-stat-label">Certs</div>
          </div>
          <div class="pf-sidebar-stat">
            <div class="pf-sidebar-stat-num">${data.socials?.length ?? 0}</div>
            <div class="pf-sidebar-stat-label">Links</div>
          </div>
        </div>
        <div class="pf-sidebar-quote">Building the future, one skill at a time.</div>
      </div>

      <div class="pf-content-area">
        <div id="pubIntro" class="pf-section active" style="display:block;">
          <div class="pf-section-label">INTRODUCTION</div>
          <div class="pf-intro-box">
            <p>${data.introduction?.trim()
              ? escapeHtml(data.introduction)
              : `<span class="pf-placeholder" style="font-style:italic;color:var(--text-soft);">No introduction added yet.</span>`
            }</p>
          </div>
        </div>
        <div id="pubSkills" class="pf-section" style="display:none;">
          <div class="pf-section-label">SKILLS</div>
          <div class="pf-skills-wrap" id="pubSkillsWrap">${skillsHTML}</div>
        </div>
        <div id="pubCerts" class="pf-section" style="display:none;">
          <div class="pf-section-label">CERTIFICATES</div>
          <div class="pf-certs-grid">${certsHTML}</div>
        </div>
        <div id="pubSocials" class="pf-section" style="display:none;">
          <div class="pf-section-label">SOCIALS</div>
          <div class="pf-socials-wrap">${socialsHTML}</div>
        </div>
      </div>
    </div>`;

  updateThemeIcons(document.body.classList.contains("dark"));
}

function pubSwitchTab(id, btn) {
  document.querySelectorAll("#portfolioSection .pf-section")
    .forEach(s => s.style.display = "none");
  document.querySelectorAll("#portfolioSection .pf-topbtn")
    .forEach(b => b.classList.remove("active"));
  document.getElementById(id).style.display = "block";
  if (btn) btn.classList.add("active");
}