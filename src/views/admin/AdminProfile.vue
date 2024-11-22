<template>
  <div class="admin-profile">
    <div class="profile-container">
      <!-- Header Section -->
      <div class="profile-header">
        <h1>Thông tin tài khoản</h1>
        <button @click="toggleEditMode" class="btn btn-primary">
          <i class="fas" :class="isEditing ? 'fa-times' : 'fa-edit'"></i>
          {{ isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin' }}
        </button>
      </div>

      <!-- Main Content -->
      <div class="profile-content">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="profileData.avatar || '/default-avatar.png'" alt="Admin Avatar" class="profile-avatar">
            <div v-if="isEditing" class="avatar-overlay">
              <input type="file" ref="avatarInput" @change="handleAvatarChange" accept="image/*" class="d-none">
              <button @click="triggerAvatarUpload" class="btn btn-light btn-sm">
                <i class="fas fa-camera"></i> Thay đổi ảnh
              </button>
            </div>
          </div>
          <h3 class="admin-name">{{ profileData.fullName }}</h3>
          <span class="admin-role">Quản trị viên</span>
        </div>

        <!-- Profile Form -->
        <div class="profile-form">
          <form @submit.prevent="handleSubmit">
            <!-- Personal Information -->
            <div class="form-section">
              <h4>Thông tin cá nhân</h4>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Họ và tên</label>
                  <input type="text" v-model="profileData.fullName" :disabled="!isEditing" class="form-control"
                    required>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" v-model="profileData.email" disabled class="form-control">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Số điện thoại</label>
                  <input type="tel" v-model="profileData.phone" :disabled="!isEditing" class="form-control"
                    pattern="[0-9]{10}" title="Vui lòng nhập số điện thoại hợp lệ">
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Ngày sinh</label>
                  <input type="date" v-model="profileData.birthDate" :disabled="!isEditing" class="form-control">
                </div>
              </div>
            </div>

            <!-- Account Security -->
            <div class="form-section">
              <h4>Bảo mật tài khoản</h4>
              <div class="row">
                <div class="col-12 mb-3">
                  <button type="button" @click="showChangePasswordModal" class="btn btn-outline-primary">
                    <i class="fas fa-key"></i> Đổi mật khẩu
                  </button>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div v-if="isEditing" class="form-actions">
              <button type="button" @click="toggleEditMode" class="btn btn-secondary">
                <i class="fas fa-times"></i> Hủy
              </button>
              <button type="submit" class="btn btn-success" :disabled="loading">
                <i class="fas fa-save"></i> Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="modal fade show" style="display: block">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Đổi mật khẩu</h5>
            <button type="button" class="btn-close" @click="closePasswordModal">
            </button>
          </div>
          <form @submit.prevent="handlePasswordChange">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Mật khẩu hiện tại</label>
                <input type="password" v-model="passwordForm.currentPassword" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu mới</label>
                <input type="password" v-model="passwordForm.newPassword" class="form-control" required minlength="8">
              </div>
              <div class="mb-3">
                <label class="form-label">Xác nhận mật khẩu mới</label>
                <input type="password" v-model="passwordForm.confirmPassword" class="form-control" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closePasswordModal">
                Hủy
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                Cập nhật mật khẩu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang xử lý...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import authApi from '@/apis/authApi';

export default {
  name: 'AdminProfile',

  setup() {
    const isEditing = ref(false);
    const loading = ref(false);
    const showPasswordModal = ref(false);
    const avatarInput = ref(null);

    // Lấy dữ liệu người dùng hiện tại từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const profileData = ref({
      fullName: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      birthDate: currentUser.birthDate || '',
      avatar: currentUser.avatar || '/default-avatar.png',
    });

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const toggleEditMode = () => {
      isEditing.value = !isEditing.value;
    };

    const handleSubmit = async () => {
      try {
        loading.value = true;
        const response = await authApi.updateUser(currentUser.id, {
            username: profileData.value.fullName,
            phone: profileData.value.phone,
            birthDate: profileData.value.birthDate,
            avatar: profileData.value.avatar,
          });

        if (response.error) throw new Error('Không thể cập nhật thông tin');

        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Thông tin đã được cập nhật',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          window.location.reload(); 
        });

        isEditing.value = false;
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể cập nhật thông tin'
        });
      } finally {
        loading.value = false;
      }
    };


    const triggerAvatarUpload = () => {
      if (avatarInput.value) {
        avatarInput.value.click();
      }
    };

    const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      loading.value = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'cozy-home'); 

      // Tải ảnh lên Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/djnt4wlng/image/upload`, 
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error('Không thể tải ảnh lên Cloudinary');

      // Lưu URL của ảnh đã tải lên vào profileData
      profileData.value.avatar = data.secure_url;

      // Cập nhật thông tin user
      await fetch(`https://6725a513c39fedae05b5670b.mockapi.io/api/v1/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatar: data.secure_url
        })
      });

      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Ảnh đại diện đã được cập nhật',
        timer: 1500,
        showConfirmButton: false
      });

      // Cập nhật localStorage
      const updatedUser = { ...currentUser, avatar: data.secure_url };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải ảnh lên'
      });
    } finally {
      loading.value = false;
    }
  }
};

    const showChangePasswordModal = () => {
      showPasswordModal.value = true;
    };

    const closePasswordModal = () => {
      showPasswordModal.value = false;
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    };

    const handlePasswordChange = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Mật khẩu xác nhận không khớp'
        });
        return;
      }

      try {
        loading.value = true;
        await fetch(`https://6725a513c39fedae05b5670b.mockapi.io/api/v1/users/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: btoa(passwordForm.value.newPassword)
          })
        });

        closePasswordModal();
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Mật khẩu đã được cập nhật',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể cập nhật mật khẩu'
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      try {
        loading.value = true;
        const response = await fetch(`https://6725a513c39fedae05b5670b.mockapi.io/api/v1/users/${currentUser.id}`);
        const data = await response.json();
        profileData.value = {
          fullName: data.name,
          email: data.email,
          phone: data.phone,
          birthDate: data.birthDate,
          avatar: data.avatar || '/default-avatar.png'
        };
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể tải thông tin profile'
        });
      } finally {
        loading.value = false;
      }
    });

    return {
      isEditing,
      loading,
      showPasswordModal,
      profileData,
      passwordForm,
      avatarInput,
      toggleEditMode,
      handleSubmit,
      triggerAvatarUpload,
      handleAvatarChange,
      showChangePasswordModal,
      closePasswordModal,
      handlePasswordChange
    };
  }
};
</script>



<style scoped>
.admin-profile {
  min-height: 100vh;
  margin-top: 80px;
  padding: 30px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.profile-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.profile-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

.avatar-section {
  text-align: center;
}

.avatar-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
}

.admin-name {
  margin: 10px 0 5px;
  font-size: 1.5rem;
}

.admin-role {
  color: #666;
  font-size: 0.9rem;
}

.form-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-section h4 {
  margin-bottom: 20px;
  color: #333;
}

.activity-log {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: start;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.activity-item i {
  margin-right: 10px;
  color: #666;
}

.activity-details {
  flex: 1;
}

.activity-text {
  margin: 0;
}

.activity-time {
  color: #666;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
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

.modal {
  background: rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .avatar-section {
    margin-bottom: 30px;
  }
}
</style>