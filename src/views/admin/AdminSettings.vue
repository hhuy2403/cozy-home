<template>
  <div class="admin-settings">
    <div class="settings-container">
      <!-- Header -->
      <div class="settings-header">
        <h1>Cài đặt Hệ thống</h1>
        <div class="header-actions">
          <button @click="saveAllSettings" class="btn btn-success" :disabled="!hasChanges || loading">
            <i class="fas fa-save"></i> Lưu thay đổi
          </button>
          <button @click="resetSettings" class="btn btn-outline-secondary" :disabled="!hasChanges">
            <i class="fas fa-undo"></i> Khôi phục
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="settings-content">
        <!-- Navigation -->
        <div class="settings-nav">
          <div class="nav flex-column nav-pills">
            <button v-for="section in settingSections" :key="section.id" class="nav-link"
              :class="{ active: currentSection === section.id }" @click="currentSection = section.id">
              <i :class="section.icon"></i>
              {{ section.name }}
            </button>
          </div>
        </div>

        <!-- Settings Panels -->
        <div class="settings-panels">
          <!-- General Settings -->
          <div v-show="currentSection === 'general'" class="settings-panel">
            <h3>Cài đặt chung</h3>

            <div class="setting-group">
              <h5>Thông tin website</h5>
              <div class="mb-3">
                <label class="form-label">Tên website</label>
                <input type="text" v-model="settings.general.siteName" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea v-model="settings.general.siteDescription" class="form-control" rows="3">
                </textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Logo</label>
                <div class="d-flex align-items-center gap-2">
                  <img :src="settings.general.logo" alt="Logo" class="settings-logo">
                  <input type="file" @change="handleLogoUpload" accept="image/*" class="form-control">
                </div>
              </div>
            </div>
            <div class="setting-group">
              <h5>Liên hệ</h5>
              <div class="mb-3">
                <label class="form-label">Email hỗ trợ</label>
                <input type="email" v-model="settings.general.supportEmail" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Số điện thoại hỗ trợ</label>
                <input type="tel" v-model="settings.general.supportPhone" class="form-control">
              </div>
            </div>
          </div>

          <!-- Email Settings -->
          <div v-show="currentSection === 'email'" class="settings-panel">
            <h3>Cài đặt Email</h3>

            <div class="setting-group">
              <h5>Cấu hình SMTP</h5>
              <div class="mb-3">
                <label class="form-label">SMTP Host</label>
                <input type="text" v-model="settings.email.smtpHost" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">SMTP Port</label>
                <input type="number" v-model="settings.email.smtpPort" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Username</label>
                <input type="text" v-model="settings.email.smtpUsername" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" v-model="settings.email.smtpPassword" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Encryption</label>
                <select v-model="settings.email.encryption" class="form-select">
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">None</option>
                </select>
              </div>
              <button @click="testEmailSettings" class="btn btn-outline-primary">
                <i class="fas fa-paper-plane"></i> Gửi email test
              </button>
            </div>

            <div class="setting-group">
              <h5>Mẫu Email</h5>
              <div class="mb-3">
                <label class="form-label">Chân trang email</label>
                <textarea v-model="settings.email.emailFooter" class="form-control" rows="3">
                </textarea>
              </div>
            </div>
          </div>

          <!-- Payment Settings -->
          <div v-show="currentSection === 'payment'" class="settings-panel">
            <h3>Cài đặt Thanh toán</h3>

            <div class="setting-group">
              <h5>VNPay</h5>
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input type="checkbox" v-model="settings.payment.vnpayEnabled" class="form-check-input"
                    id="vnpayToggle">
                  <label class="form-check-label" for="vnpayToggle">
                    Kích hoạt VNPay
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Terminal ID</label>
                <input type="text" v-model="settings.payment.vnpayTerminalId" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Secret Key</label>
                <input type="password" v-model="settings.payment.vnpaySecretKey" class="form-control">
              </div>
            </div>

            <div class="setting-group">
              <h5>Momo</h5>
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input type="checkbox" v-model="settings.payment.momoEnabled" class="form-check-input"
                    id="momoToggle">
                  <label class="form-check-label" for="momoToggle">
                    Kích hoạt Momo
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Partner Code</label>
                <input type="text" v-model="settings.payment.momoPartnerCode" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Access Key</label>
                <input type="password" v-model="settings.payment.momoAccessKey" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Secret Key</label>
                <input type="password" v-model="settings.payment.momoSecretKey" class="form-control">
              </div>
            </div>
          </div>

          <!-- Security Settings -->
          <div v-show="currentSection === 'security'" class="settings-panel">
            <h3>Cài đặt Bảo mật</h3>

            <div class="setting-group">
              <h5>Chính sách mật khẩu</h5>
              <div class="mb-3">
                <label class="form-label">Độ dài tối thiểu</label>
                <input type="number" v-model="settings.security.minPasswordLength" class="form-control">
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input type="checkbox" v-model="settings.security.requireUppercase" class="form-check-input"
                    id="uppercaseCheck">
                  <label class="form-check-label" for="uppercaseCheck">
                    Yêu cầu chữ in hoa
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input type="checkbox" v-model="settings.security.requireNumbers" class="form-check-input"
                    id="numbersCheck">
                  <label class="form-check-label" for="numbersCheck">
                    Yêu cầu số
                  </label>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input type="checkbox" v-model="settings.security.requireSpecialChars" class="form-check-input"
                    id="specialCharsCheck">
                  <label class="form-check-label" for="specialCharsCheck">
                    Yêu cầu ký tự đặc biệt
                  </label>
                </div>
              </div>
            </div>

            <div class="setting-group">
              <h5>Xác thực hai lớp</h5>
              <div class="mb-3">
                <div class="form-check form-switch">
                  <input type="checkbox" v-model="settings.security.require2FA" class="form-check-input"
                    id="require2FAToggle">
                  <label class="form-check-label" for="require2FAToggle">
                    Bắt buộc 2FA cho admin
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'AdminSettings',

  setup() {
    const currentSection = ref('general');
    const loading = ref(false);
    const originalSettings = ref({});
    const settings = ref({
      general: {
        siteName: '',
        siteDescription: '',
        logo: '',
        supportEmail: '',
        supportPhone: ''
      },
      email: {
        smtpHost: '',
        smtpPort: 587,
        smtpUsername: '',
        smtpPassword: '',
        encryption: 'tls',
        emailFooter: ''
      },
      payment: {
        vnpayEnabled: false,
        vnpayTerminalId: '',
        vnpaySecretKey: '',
        momoEnabled: false,
        momoPartnerCode: '',
        momoAccessKey: '',
        momoSecretKey: ''
      },
      security: {
        minPasswordLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        require2FA: false
      }
    });

    const apiUrl = 'https://6725a513c39fedae05b5670b.mockapi.io/api/v1/settings/1';

    const hasChanges = computed(() => {
      return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value);
    });

    const fetchSettings = async () => {
      try {
        loading.value = true;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');

        const data = await response.json();
        settings.value = {
          general: data.general || settings.value.general,
          email: data.email || settings.value.email,
          payment: data.payment || settings.value.payment,
          security: data.security || settings.value.security
        };
        originalSettings.value = JSON.parse(JSON.stringify(settings.value));
      } catch (error) {
        showError('Không thể tải cài đặt');
      } finally {
        loading.value = false;
      }
    };

    const saveAllSettings = async () => {
      try {
        loading.value = true;
        await fetch(apiUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings.value),
        });
        originalSettings.value = JSON.parse(JSON.stringify(settings.value));
        showSuccess('Lưu cài đặt thành công');
      } catch (error) {
        showError('Không thể lưu cài đặt');
      } finally {
        loading.value = false;
      }
    };

    const resetSettings = () => {
      settings.value = JSON.parse(JSON.stringify(originalSettings.value));
    };

    const testEmailSettings = async () => {
      try {
        showSuccess('Gửi email test thành công');
      } catch (error) {
        showError('Không thể gửi email test');
      }
    };

    const handleLogoUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'cozy-home'); 

        try {
          loading.value = true;
          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/djnt4wlng/image/upload`, 
            {
              method: 'POST',
              body: formData,
            }
          );
          const data = await uploadResponse.json();
          settings.value.general.logo = data.secure_url;
          showSuccess('Tải ảnh logo thành công');
        } catch (error) {
          showError('Không thể tải ảnh logo');
        } finally {
          loading.value = false;
        }
      }
    };

    const showSuccess = (message) => {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: message,
        timer: 1500,
        showConfirmButton: false
      });
    };

    const showError = (message) => {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: message
      });
    };

    const settingSections = [
      { id: 'general', name: 'Cài đặt chung', icon: 'fas fa-cog' },
      { id: 'email', name: 'Email', icon: 'fas fa-envelope' },
      { id: 'payment', name: 'Thanh toán', icon: 'fas fa-credit-card' },
      { id: 'security', name: 'Bảo mật', icon: 'fas fa-shield-alt' }
    ];

    onMounted(() => {
      fetchSettings();
    });

    return {
      currentSection,
      loading,
      settings,
      hasChanges,
      settingSections,
      saveAllSettings,
      resetSettings,
      testEmailSettings,
      handleLogoUpload
    };
  }
};
</script>

<style scoped>
.admin-settings {
  min-height: 100vh;
  margin-top: 80px;
  padding: 30px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.settings-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.settings-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

.settings-nav {
  border-right: 1px solid #eee;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  color: #666;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.nav-link.active {
  background: #f8f9fa;
  color: #0d6efd;
  font-weight: 500;
}

.nav-link i {
  width: 20px;
}

.settings-panel {
  padding: 20px;
}

.setting-group {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.setting-group h5 {
  margin-bottom: 20px;
  color: #333;
}

.settings-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

@media (max-width: 768px) {
  .settings-content {
    grid-template-columns: 1fr;
  }

  .settings-nav {
    border-right: none;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .header-actions {
    flex-direction: column;
  }
}
</style>