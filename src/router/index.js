import { createRouter, createWebHistory } from 'vue-router';
import IndexPage from '@/views/IndexPage.vue';
// Import cho Admin
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import AdminContractManagement from '@/views/admin/AdminContractManagement.vue';
import AdminLandlordContractManagement from '@/views/admin/AdminLandlordContractManagement.vue';
import AdminReportManagement from '@/views/admin/AdminReportManagement.vue';
import AdminUserManagement from '@/views/admin/AdminUserManagement.vue';
import AdminFinancialManagement from "@/views/admin/AdminFinancialManagement.vue";
import AdminMaintenanceServiceManagement from "@/views/admin/AdminMaintenanceServiceManagement.vue";

import AdminFeedbackManagement from "@/views/admin/AdminFeedbackManagement.vue";
import AdminNotificationManagement from "@/views/admin/AdminNotificationManagement.vue";
import AdminSettings from '@/views/admin/AdminSettings.vue';

// Import cho Tenant
import TenantDashboard from '@/views/tenant/TenantDashboard.vue';
import TenantActivityHistory from '@/views/tenant/TenantActivityHistory.vue';
import TenantContracts from '@/views/tenant/TenantContracts.vue';
import TenantNotifications from '@/views/tenant/TenantNotifications.vue';
import TenantPaymentHistory from '@/views/tenant/TenantPaymentHistory.vue';
import TenantPayments from '@/views/tenant/TenantPayments.vue';
import TenantProfile from '@/views/tenant/TenantProfile.vue';

// Import cho Landlord
import LandlordProperties from "@/views/landlord/LandlordProperties.vue";
import LandlordDashboard from '@/views/landlord/LandlordDashboard.vue';
import LandlordContracts from '@/views/landlord/LandlordContracts.vue';
import LandlordDepositManagement from '@/views/landlord/LandlordDepositManagement.vue';
import LandlordExpenseManagement from '@/views/landlord/LandlordExpenseManagement.vue';
import LandlordInvoiceSummary from '@/views/landlord/LandlordInvoiceSummary.vue';
import LandlordMeterManagement from '@/views/landlord/LandlordMeterManagement.vue';
import LandlordRoomManagement from '@/views/landlord/LandlordRoomManagement.vue';
import LandlordRoomAssetManagement from '@/views/landlord/LandlordRoomAssetManagement.vue';
import LandlordRoomMemberManagement from '@/views/landlord/LandlordRoomMemberManagement.vue';
import LandlordServiceManagement from '@/views/landlord/LandlordServiceManagement.vue';

// Import Layouts
import AdminTenantLayout from '@/layouts/AdminTenantLayout.vue';
import LandlordLayout from '@/layouts/LandlordLayout.vue';
import LoginPage from "@/views/auth/LoginPage.vue";
import RegisterPage from "@/views/auth/RegisterPage.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";


// Định nghĩa các routes
const routes = [
    {
        path: '/',
        component: IndexPage,
    },
    {
        path: '/login',
        component: LoginPage,
    },
    {
        path: '/register',
        component: RegisterPage,
    },
    {
        path: '/forgot-password',
        component: ForgotPassword,
    },
    {
        path: '/admin',
        component: AdminTenantLayout,  // Layout cho admin và tenant
        meta: { requiresAdmin: true },  // Đánh dấu yêu cầu quyền admin
        children: [
            { path: 'dashboard', component: AdminDashboard },
            { path: 'contracts', component: AdminContractManagement },
            { path: 'landlord-contracts', component: AdminLandlordContractManagement },
            { path: 'reports', component: AdminReportManagement },
            { path: 'users', component: AdminUserManagement },
            { path: 'financial', component: AdminFinancialManagement },
            { path: 'service', component: AdminMaintenanceServiceManagement },
            { path: 'feedback', component: AdminFeedbackManagement },
            { path: 'notification', component: AdminNotificationManagement },
            { path: 'settings', component: AdminSettings }
        ]
    },
    {
        path: '/tenant',
        component: AdminTenantLayout,  // Layout cho tenant
        meta: { requiresTenant: true },  // Đánh dấu yêu cầu quyền tenant
        children: [
            { path: 'dashboard', component: TenantDashboard },
            { path: 'activity-history', component: TenantActivityHistory },
            { path: 'contracts', component: TenantContracts },
            { path: 'notifications', component: TenantNotifications },
            { path: 'payment-history', component: TenantPaymentHistory },
            { path: 'payments', component: TenantPayments },
            { path: 'profile', component: TenantProfile }
        ]
    },
    {
        path: '/landlord',
        component: LandlordLayout,  // Layout riêng cho landlord
        meta: { requiresLandlord: true },  // Đánh dấu yêu cầu quyền landlord
        children: [
            { path: 'dashboard', component: LandlordDashboard },
            { path: 'contracts', component: LandlordContracts },
            { path: 'properties', component: LandlordProperties },
            { path: 'deposit-management', component: LandlordDepositManagement },
            { path: 'expense-management', component: LandlordExpenseManagement },
            { path: 'invoice-summary', component: LandlordInvoiceSummary },
            { path: 'meter-management', component: LandlordMeterManagement },
            { path: 'room-management', component: LandlordRoomManagement },
            { path: 'room-asset-management', component: LandlordRoomAssetManagement },
            { path: 'room-member-management', component: LandlordRoomMemberManagement },
            { path: 'service-management', component: LandlordServiceManagement }
        ]
    }
];

// Tạo và export router
const router = createRouter({
    history: createWebHistory(),  // Sử dụng chế độ history mode
    routes
});

// Thêm logic để bảo vệ các route yêu cầu quyền admin, landlord, tenant
router.beforeEach((to, from, next) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (currentUser && currentUser.role === 'admin') {
            next();
        } else {
            next('/login');
        }
    } else if (to.matched.some(record => record.meta.requiresLandlord)) {
        if (currentUser && currentUser.role === 'landlord') {
            next();
        } else {
            next('/login');
        }
    } else if (to.matched.some(record => record.meta.requiresTenant)) {
        if (currentUser && currentUser.role === 'tenant') {
            next();
        } else {
            next('/login');
        }
    } else {
        next();
    }
});

export default router;
