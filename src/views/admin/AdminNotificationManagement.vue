<template>
  <div class="notification-management">
    <h1>Quản lý Thông báo</h1>

    <!-- Toolbar và Bộ lọc -->
    <div class="toolbar-container">
      <button @click="openCreateModal" class="btn btn-success">
        <i class="fas fa-plus"></i> Tạo thông báo mới
      </button>

      <div class="filters">
        <div class="filter-group">
          <label>Đối tượng nhận:</label>
          <select v-model="filters.targetType" class="form-select">
            <option value="">Tất cả</option>
            <option value="all">Tất cả người dùng</option>
            <option value="tenant">Người thuê</option>
            <option value="landlord">Chủ trọ</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Trạng thái:</label>
          <select v-model="filters.status" class="form-select">
            <option value="">Tất cả</option>
            <option value="draft">Bản nháp</option>
            <option value="scheduled">Đã lên lịch</option>
            <option value="sent">Đã gửi</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Loại thông báo:</label>
          <select v-model="filters.type" class="form-select">
            <option value="">Tất cả</option>
            <option value="system">Hệ thống</option>
            <option value="promotion">Khuyến mãi</option>
            <option value="update">Cập nhật</option>
            <option value="alert">Cảnh báo</option>
          </select>
        </div>

        <div class="search-box">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Tìm kiếm thông báo...">
        </div>
      </div>
    </div>

    <!-- Danh sách thông báo -->
    <div class="notification-list">
      <div v-if="filteredNotifications.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <p>Không tìm thấy thông báo nào phù hợp với điều kiện tìm kiếm</p>
      </div>

      <div v-else v-for="notification in filteredNotifications" :key="notification.id" class="notification-card">
        <div class="notification-header">
          <div class="notification-type" :class="notification.type">
            <i :class="getTypeIcon(notification.type)"></i>
            {{ getTypeText(notification.type) }}
          </div>
          <div class="notification-meta">
            <span class="status" :class="notification.status">
              {{ getStatusText(notification.status) }}
            </span>
            <span class="date">
              {{ formatDate(notification.createdAt) }}
            </span>
          </div>
        </div>

        <div class="notification-content">
          <h5>{{ notification.title }}</h5>
          <p>{{ notification.message }}</p>

          <div class="target-info">
            <span class="target-badge" :class="notification.targetType">
              <i class="fas fa-users"></i>
              {{ getTargetText(notification.targetType) }}
            </span>
            <span v-if="notification.recipientCount" class="recipient-count">
              {{ notification.recipientCount }} người nhận
            </span>
          </div>

          <div v-if="notification.scheduledAt" class="schedule-info">
            <i class="far fa-clock"></i>
            Lên lịch gửi: {{ formatDate(notification.scheduledAt) }}
          </div>
        </div>

        <div class="notification-stats">
          <div class="stat-item">
            <i class="fas fa-paper-plane"></i>
            <span>Đã gửi: {{ notification.sentCount || 0 }}</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-envelope-open"></i>
            <span>Đã đọc: {{ notification.readCount || 0 }}</span>
          </div>
          <div class="stat-item">
            <i class="fas fa-mouse-pointer"></i>
            <span>Đã click: {{ notification.clickCount || 0 }}</span>
          </div>
        </div>

        <div class="notification-actions">
          <button v-if="notification.status === 'draft'" @click="editNotification(notification)"
            class="btn btn-primary btn-sm">
            <i class="fas fa-edit"></i> Sửa
          </button>
          <button v-if="notification.status === 'draft'" @click="sendNotification(notification.id)"
            class="btn btn-success btn-sm">
            <i class="fas fa-paper-plane"></i> Gửi ngay
          </button>
          <button v-if="notification.status === 'draft'" @click="scheduleNotification(notification)"
            class="btn btn-info btn-sm">
            <i class="far fa-clock"></i> Lên lịch
          </button>
          <button @click="viewDetails(notification)" class="btn btn-secondary btn-sm">
            <i class="fas fa-chart-bar"></i> Chi tiết
          </button>
          <button v-if="notification.status === 'draft'" @click="deleteNotification(notification.id)"
            class="btn btn-danger btn-sm">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Tạo/Sửa thông báo -->
    <div v-if="showModal" class="modal fade show" style="display: block;">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditing ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label class="form-label required">Tiêu đề</label>
                <input v-model="form.title" type="text" class="form-control" required>
              </div>

              <div class="mb-3">
                <label class="form-label required">Nội dung</label>
                <textarea v-model="form.message" class="form-control" rows="4" required></textarea>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label required">Loại thông báo</label>
                  <select v-model="form.type" class="form-select" required>
                    <option value="system">Hệ thống</option>
                    <option value="promotion">Khuyến mãi</option>
                    <option value="update">Cập nhật</option>
                    <option value="alert">Cảnh báo</option>
                  </select>
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label required">Đối tượng nhận</label>
                  <select v-model="form.targetType" class="form-select" required>
                    <option value="all">Tất cả người dùng</option>
                    <option value="tenant">Người thuê</option>
                    <option value="landlord">Chủ trọ</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Link đính kèm</label>
                <input v-model="form.link" type="url" class="form-control" placeholder="https://">
              </div>

              <div class="form-check mb-3">
                <input v-model="form.isScheduled" type="checkbox" class="form-check-input" id="scheduleCheck">
                <label class="form-check-label" for="scheduleCheck">
                  Lên lịch gửi
                </label>
              </div>

              <div v-if="form.isScheduled" class="mb-3">
                <label class="form-label required">Thời gian gửi</label>
                <input v-model="form.scheduledAt" type="datetime-local" class="form-control" required>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Hủy
                </button>
                <button type="button" class="btn btn-info" @click="saveDraft">
                  Lưu nháp
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ isEditing ? 'Cập nhật' : 'Tạo thông báo' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
export default {
  name: 'AdminNotificationManagement',
  data() {
    return {
      loadingStates: {
        fetch: false,
        send: false,
        delete: false,
        save: false
      },
      notifications: [], // Sẽ được lấy từ API
      filters: {
        targetType: '',
        status: '',
        type: ''
      },
      searchQuery: '',
      showModal: false,
      isEditing: false,
      form: {
        title: '',
        message: '',
        type: 'system',
        targetType: 'all',
        link: '',
        isScheduled: false,
        scheduledAt: null
      },
      apiBaseUrl: "https://6725a513c39fedae05b5670b.mockapi.io/api/v1", // MockAPI URL
      loading: false,
      error: null
    }
  },

  mounted() {
    this.fetchNotifications();
  },

  computed: {
    filteredNotifications() {
      let result = [...this.notifications];

      // Áp dụng tất cả các bộ lọc
      result = result.filter(notification => {
        let matchesFilters = true;

        // Lọc theo đối tượng nhận
        if (this.filters.targetType) {
          matchesFilters = matchesFilters && notification.targetType === this.filters.targetType;
        }

        // Lọc theo trạng thái
        if (this.filters.status) {
          matchesFilters = matchesFilters && notification.status === this.filters.status;
        }

        // Lọc theo loại thông báo
        if (this.filters.type) {
          matchesFilters = matchesFilters && notification.type === this.filters.type;
        }

        // Tìm kiếm theo từ khóa
        if (this.searchQuery.trim()) {
          const searchTerm = this.searchQuery.toLowerCase().trim();
          const searchFields = [
            notification.title,
            notification.message,
            this.getTypeText(notification.type),
            this.getStatusText(notification.status),
            this.getTargetText(notification.targetType)
          ].map(field => (field || '').toLowerCase());

          matchesFilters = matchesFilters && searchFields.some(field => field.includes(searchTerm));
        }

        return matchesFilters;
      });

      // Sắp xếp theo thời gian tạo mới nhất
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return result;
    }
  },

  watch: {
    // Theo dõi thay đổi của bộ lọc và search query
    filters: {
      deep: true,
      handler() {
        this.$emit('filter-changed', this.filteredNotifications.length);
      }
    },
    searchQuery() {
      this.$emit('search-changed', this.filteredNotifications.length);
    }
  },

  methods: {
    validateForm() {
      const errors = [];

      if (!this.form.title.trim()) {
        errors.push('Vui lòng nhập tiêu đề');
      }

      if (!this.form.message.trim()) {
        errors.push('Vui lòng nhập nội dung');
      }

      if (this.form.isScheduled && !this.form.scheduledAt) {
        errors.push('Vui lòng chọn thời gian gửi');
      }

      if (this.form.link && !this.isValidUrl(this.form.link)) {
        errors.push('Link không hợp lệ');
      }

      if (errors.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          html: errors.join('<br>')
        });
        return false;
      }

      return true;
    },

    isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    },

    async scheduleNotification(notification) {
      const { value: scheduledAt } = await Swal.fire({
        title: 'Lên lịch gửi thông báo',
        html: `
      <div class="mb-3">
        <label class="form-label">Chọn thời gian gửi</label>
        <input id="scheduled-time" type="datetime-local" class="form-control" 
               min="${new Date().toISOString().slice(0, 16)}">
      </div>
    `,
        showCancelButton: true,
        confirmButtonText: 'Lên lịch',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
          const scheduledTime = document.getElementById('scheduled-time').value;
          if (!scheduledTime) {
            Swal.showValidationMessage('Vui lòng chọn thời gian gửi');
            return false;
          }
          return scheduledTime;
        }
      });

      if (scheduledAt) {
        try {
          this.loadingStates.save = true;
          const response = await fetch(`${this.apiBaseUrl}/notifications/${notification.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...notification,
              status: 'scheduled',
              scheduledAt: scheduledAt
            })
          });

          if (!response.ok) throw new Error('Lỗi khi lên lịch thông báo');

          const updatedNotification = await response.json();
          const index = this.notifications.findIndex(n => n.id === updatedNotification.id);
          this.notifications.splice(index, 1, updatedNotification);

          Swal.fire({
            icon: 'success',
            title: 'Đã lên lịch thông báo',
            text: `Thông báo sẽ được gửi vào ${new Date(scheduledAt).toLocaleString('vi-VN')}`,
            timer: 2000
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: error.message || 'Không thể lên lịch thông báo'
          });
        } finally {
          this.loadingStates.save = false;
        }
      }
    },


    previewNotification() {
      Swal.fire({
        title: this.form.title,
        html: `
      <div class="notification-preview">
        <div class="notification-type ${this.form.type}">
          <i class="${this.getTypeIcon(this.form.type)}"></i>
          ${this.getTypeText(this.form.type)}
        </div>
        <div class="notification-body">
          ${this.form.message}
        </div>
        ${this.form.link ? `<a href="${this.form.link}" target="_blank">Xem thêm</a>` : ''}
      </div>
    `,
        showCancelButton: true,
        confirmButtonText: 'Tiếp tục chỉnh sửa',
        cancelButtonText: 'Đóng'
      });
    },

    async confirmSend(id) {
      const result = await Swal.fire({
        title: 'Xác nhận gửi',
        text: 'Bạn có chắc chắn muốn gửi thông báo này ngay?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Gửi ngay',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        await this.sendNotification(id);
      }
    },

    async confirmDelete(id) {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa thông báo này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });

      if (result.isConfirmed) {
        await this.deleteNotification(id);
      }
    },

    async fetchNotifications() {
      // Lấy danh sách thông báo từ MockAPI
      try {
        this.loading = true;
        const response = await fetch(`${this.apiBaseUrl}/notifications`);
        this.notifications = await response.json();
      } catch (error) {
        this.error = "Không thể tải danh sách thông báo.";
      } finally {
        this.loading = false;
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleString('vi-VN');
    },

    getTypeIcon(type) {
      const icons = {
        system: 'fas fa-cog',
        promotion: 'fas fa-gift',
        update: 'fas fa-sync',
        alert: 'fas fa-exclamation-triangle'
      };
      return icons[type] || 'fas fa-bell';
    },

    getTypeText(type) {
      const types = {
        system: 'Hệ thống',
        promotion: 'Khuyến mãi',
        update: 'Cập nhật',
        alert: 'Cảnh báo'
      };
      return types[type] || type;
    },

    getStatusText(status) {
      const statuses = {
        draft: 'Bản nháp',
        scheduled: 'Đã lên lịch',
        sent: 'Đã gửi'
      };
      return statuses[status] || status;
    },

    getTargetText(targetType) {
      const targets = {
        all: 'Tất cả người dùng',
        tenant: 'Người thuê',
        landlord: 'Chủ trọ'
      };
      return targets[targetType] || targetType;
    },

    openCreateModal() {
      this.isEditing = false;
      this.form = {
        title: '',
        message: '',
        type: 'system',
        targetType: 'all',
        link: '',
        isScheduled: false,
        scheduledAt: null
      };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.form = {
        title: '',
        message: '',
        type: 'system',
        targetType: 'all',
        link: '',
        isScheduled: false,
        scheduledAt: null
      };
    },

    async handleSubmit() {
      // Tạo hoặc cập nhật thông báo
      if (this.isEditing) {
        await this.updateNotification(this.form);
      } else {
        await this.createNotification(this.form);
      }
    },

    async createNotification(notification) {
      try {
        this.loadingStates.save = true;
        const response = await fetch(`${this.apiBaseUrl}/notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...notification,
            createdAt: new Date().toISOString(),
            status: notification.isScheduled ? 'scheduled' : 'draft',
            readCount: 0,
            sentCount: 0,
            clickCount: 0
          })
        });

        if (!response.ok) throw new Error('Lỗi khi tạo thông báo');

        const newNotification = await response.json();
        this.notifications.unshift(newNotification);
        this.showModal = false;

        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đã tạo thông báo mới',
          timer: 1500
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.message || 'Không thể tạo thông báo'
        });
      } finally {
        this.loadingStates.save = false;
      }
    },

    async updateNotification(notification) {
      try {
        this.loading = true;
        const response = await fetch(`${this.apiBaseUrl}/notifications/${notification.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notification)
        });
        const updatedNotification = await response.json();
        const index = this.notifications.findIndex(n => n.id === updatedNotification.id);
        this.notifications.splice(index, 1, updatedNotification);
        this.showModal = false;
      } catch (error) {
        this.error = "Không thể cập nhật thông báo.";
      } finally {
        this.loading = false;
      }
    },

    async deleteNotification(id) {
      try {
        this.loading = true;
        await fetch(`${this.apiBaseUrl}/notifications/${id}`, {
          method: "DELETE"
        });
        this.notifications = this.notifications.filter(n => n.id !== id);
      } catch (error) {
        this.error = "Không thể xóa thông báo.";
      } finally {
        this.loading = false;
      }
    },

    async sendNotification(id) {
      try {
        this.loading = true;
        // Giả định một thông báo đã gửi sẽ chuyển trạng thái thành 'sent'
        const response = await fetch(`${this.apiBaseUrl}/notifications/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "sent" })
        });
        const updatedNotification = await response.json();
        const index = this.notifications.findIndex(n => n.id === updatedNotification.id);
        this.notifications.splice(index, 1, updatedNotification);
      } catch (error) {
        this.error = "Không thể gửi thông báo.";
      } finally {
        this.loading = false;
      }
    },

    editNotification(notification) {
      this.isEditing = true;
      this.form = { ...notification };
      this.showModal = true;
    },

    saveDraft() {
      this.form.status = 'draft';
      this.handleSubmit();
    },

    async fetchNotificationStats(notificationId) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/notifications/${notificationId}/stats`);
        if (!response.ok) throw new Error('Không thể lấy thống kê');
        return await response.json();
      } catch (error) {
        console.error('Error fetching stats:', error);
        return {
          sentCount: 0,
          readCount: 0,
          clickCount: 0,
          recipientCount: 0
        };
      }
    },

    async viewDetails(notification) {
      const stats = await this.fetchNotificationStats(notification.id);

      Swal.fire({
        title: 'Chi tiết thông báo',
        html: `
      <div class="notification-details">
        <div class="detail-section">
          <h6>Thông tin cơ bản</h6>
          <p><strong>Tiêu đề:</strong> ${notification.title}</p>
          <p><strong>Loại:</strong> ${this.getTypeText(notification.type)}</p>
          <p><strong>Trạng thái:</strong> ${this.getStatusText(notification.status)}</p>
          <p><strong>Đối tượng:</strong> ${this.getTargetText(notification.targetType)}</p>
          <p><strong>Thời gian tạo:</strong> ${this.formatDate(notification.createdAt)}</p>
          ${notification.scheduledAt ?
            `<p><strong>Lên lịch gửi:</strong> ${this.formatDate(notification.scheduledAt)}</p>` : ''}
        </div>
        
        <div class="detail-section">
          <h6>Thống kê chi tiết</h6>
          <div class="stats-grid">
            <div class="stat-box">
              <i class="fas fa-paper-plane"></i>
              <div>
                <strong>Đã gửi</strong>
                <span>${stats.sentCount || 0}</span>
              </div>
            </div>
            <div class="stat-box">
              <i class="fas fa-envelope-open"></i>
              <div>
                <strong>Đã đọc</strong>
                <span>${stats.readCount || 0}</span>
              </div>
            </div>
            <div class="stat-box">
              <i class="fas fa-mouse-pointer"></i>
              <div>
                <strong>Đã click</strong>
                <span>${stats.clickCount || 0}</span>
              </div>
            </div>
            <div class="stat-box">
              <i class="fas fa-users"></i>
              <div>
                <strong>Tổng người nhận</strong>
                <span>${stats.recipientCount || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        ${notification.link ? `
        <div class="detail-section">
          <h6>Link đính kèm</h6>
          <a href="${notification.link}" target="_blank" class="btn btn-sm btn-primary">
            <i class="fas fa-external-link-alt"></i> Mở link
          </a>
        </div>
        ` : ''}
      </div>
    `,
        width: '600px',
        showCloseButton: true,
        showConfirmButton: false
      });
    },

  }
};
</script>

<style scoped>
.notification-management {
  min-height: 100vh;
  margin-top: 80px;
  padding: 30px;
  background-color: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.toolbar-container {
  margin-bottom: 20px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.search-box {
  flex-grow: 1;
  min-width: 200px;
}

.notification-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.notification-type {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.notification-type.system {
  background: #e3f2fd;
  color: #1976d2;
}

.notification-type.promotion {
  background: #f3e5f5;
  color: #7b1fa2;
}

.notification-type.update {
  background: #e8f5e9;
  color: #2e7d32;
}

.notification-type.alert {
  background: #fff3e0;
  color: #e65100;
}

.notification-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
}

.status.draft {
  background: #f5f5f5;
  color: #616161;
}

.status.scheduled {
  background: #e3f2fd;
  color: #1976d2;
}

.status.sent {
  background: #e8f5e9;
  color: #2e7d32;
}

.notification-content {
  margin-bottom: 15px;
}

.target-info {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 10px;
}

.target-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  background: #f5f5f5;
}

.schedule-info {
  margin-top: 10px;
  color: #666;
  font-size: 0.9em;
}

.notification-stats {
  display: flex;
  gap: 20px;
  margin: 15px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.notification-actions {
  display: flex;
  gap: 10px;
}

.required::after {
  content: " *";
  color: red;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
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

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.notification-preview {
  text-align: left;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 15px;
}

.notification-details {
  text-align: left;
  padding: 15px;
}

.detail-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-section h6 {
  margin-bottom: 15px;
  color: #2c3e50;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 10px;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-box i {
  font-size: 1.5em;
  color: #3498db;
}

.stat-box div {
  display: flex;
  flex-direction: column;
}

.stat-box strong {
  font-size: 0.9em;
  color: #666;
}

.stat-box span {
  font-size: 1.2em;
  font-weight: 600;
  color: #2c3e50;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.no-results i {
  font-size: 3em;
  color: #ccc;
  margin-bottom: 15px;
}

.no-results p {
  color: #666;
  font-size: 1.1em;
  margin: 0;
}

@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .notification-header {
    flex-direction: column;
    gap: 10px;
  }

  .notification-stats {
    flex-direction: column;
    gap: 10px;
  }

  .notification-actions {
    flex-wrap: wrap;
  }
}
</style>