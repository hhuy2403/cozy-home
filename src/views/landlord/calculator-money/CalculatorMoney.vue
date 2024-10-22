<template>
  <div class="calculator-money container mt-4">
    <!-- Header Section -->
    <div class="row mb-4 align-items-start">
      <div class="col-md-6">
        <h2>Tính tiền</h2>
      </div>
      <div class="col-md-6 text-end">
        <!-- Action Buttons -->
        <button class="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#calculatorModal">
          <i class="fas fa-calculator"></i> Tính
        </button>

        <button class="btn btn-success me-2" @click="exportToExcel"><i class="fas fa-floppy-disk"></i> Xuất file excel</button>
        <button class="btn btn-warning me-2" @click="printList"><i class="fas fa-print"></i> In danh sách</button>
        <button class="btn btn-success me-2" @click="collectMoney"><i class="fas fa-money-bill"></i> Thu tiền</button>
        <button class="btn btn-info me-2" ><i class="fas fa-mail-forward"></i> Email</button>
        <button class="btn btn-danger" @click="deleteSelected"><i class="fas fa-trash"></i> Xóa</button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="row mb-3">
      <div class="col-md-3">
        <label for="selectedMonth">Tháng/năm</label>
        <input type="month" id="selectedMonth" v-model="selectedMonth" class="form-control" />
      </div>
      <div class="col-md-3">
        <label for="selectedCycle">Kỳ</label>
        <select id="selectedCycle" v-model="selectedCycle" class="form-select">
          <option value="">Tất cả</option>
          <option value="Kỳ 30">Kỳ 30</option>
          <option value="Kỳ 15">Kỳ 15</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="selectedHouse">Nhà</label>
        <select id="selectedHouse" v-model="selectedHouse" class="form-select">
          <option value="">Tất cả</option>
          <option v-for="house in houses" :key="house.name" :value="house.name">{{ house.name }}</option>
        </select>
      </div>
      <div class="col-md-3">
        <label for="searchQuery">Tìm kiếm</label>
        <input type="text" id="searchQuery" v-model="searchQuery" class="form-control" placeholder="Tìm kiếm..." />
      </div>
    </div>

    <!-- Note Section -->
    <div class="alert alert-info">
      <p>
        - Bạn phải thực hiện việc "Thêm khách" ở chức năng "Phòng" và gắn các dịch vụ cho khách thuê trước khi tính tiền.<br />
        - Nếu có bất kỳ thay đổi liên quan đến tiền nhà tháng đang tính (vd: thay đổi CS điện, nước, giá phòng, ngày vào, giá dịch vụ, ...) thì bạn phải tính tiền lại cho tháng đó.
      </p>
    </div>

    <!-- Table Section -->
    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
        <tr>
          <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
          <th>Nhà</th>
          <th>Phòng</th>
          <th>Tên khách</th>
          <th>Tháng</th> <!-- Hiển thị tháng -->
          <th>Số tiền (VND)</th>
          <th>Đã trả (VND)</th>
          <th>Còn lại (VND)</th>
          <th>Thao tác</th>
        </tr>
        </thead>
        <tbody>
        <tr  v-for="(item, index) in filteredCustomers" :key="index" >
          <td><input type="checkbox" v-model="selectedCustomers" :value="item" /></td>
          <td>{{ item.house }}</td>
          <td>{{ item.roomNumber }}</td>
          <td>{{ item.customer.fullName }}</td>
          <td>{{ selectedMonth }}</td> <!-- Hiển thị tháng -->
          <td>{{ formatCurrency(item.paymentHistory?.[selectedMonth]?.totalAmount || 0) }}</td>
          <td>{{ formatCurrency(item.paymentHistory?.[selectedMonth]?.paidAmount || 0) }}</td>
          <td>{{ formatCurrency(item.paymentHistory?.[selectedMonth]?.remainingAmount || 0) }}</td>
          <td>
            <button class="btn" @click="showBillDetail(item)"><i class="fas fa-file-invoice"></i></button>
          </td>
        </tr>
        <tr v-if="filteredCustomers.length === 0">
          <td colspan="8" class="text-center">Không tìm thấy dòng nào phù hợp</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Bill Detail Modal -->
    <div class="modal fade" id="billDetailModal" tabindex="-1" aria-labelledby="billDetailModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="billDetailModalLabel">Chi Tiết Hóa Đơn</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="selectedBill && selectedBill.house">
            <h3 class="text-center">HÓA ĐƠN TIỀN NHÀ</h3>
            <p><strong>Nhà:</strong> {{ selectedBill.house }}</p>
            <p><strong>Phòng:</strong> {{ selectedBill.roomNumber }}</p>
            <p><strong>Khách thuê:</strong> {{ selectedBill.customer.fullName }}</p>
            <p><strong>Tháng:</strong> {{ selectedMonth }}</p>

            <table class="table table-bordered">
              <thead>
              <tr>
                <th>Khoản mục</th>
                <th>Số lượng</th>
                <th>Đơn giá (VND)</th>
                <th>Tổng (VND)</th>
              </tr>
              </thead>
              <tbody>
              <!-- Tiền nhà -->
              <tr>
                <td>Tiền nhà</td>
                <td>-</td>
                <td>{{ formatCurrency(selectedBill.customer.rentalCost) }}</td>
                <td>{{ formatCurrency(selectedBill.customer.rentalCost) }}</td>
              </tr>

              <!-- Điện -->
              <tr v-if="selectedBill.services.find(service => service.name === 'Điện' && service.selected)">
                <td>Điện</td>
                <td>{{ getElectricUsage(selectedBill) }} kWh</td>
                <td>{{ formatCurrency(selectedBill.services.find(service => service.name === 'Điện').price) }}</td>
                <td>{{ formatCurrency(getElectricUsage(selectedBill) * selectedBill.services.find(service => service.name === 'Điện').price) }}</td>
              </tr>

              <!-- Nước -->
              <tr v-if="selectedBill.services.find(service => service.name === 'Nước' && service.selected)">
                <td>Nước</td>
                <td>{{ getWaterUsage(selectedBill) }} m³</td>
                <td>{{ formatCurrency(selectedBill.services.find(service => service.name === 'Nước').price) }}</td>
                <td>{{ formatCurrency(getWaterUsage(selectedBill) * selectedBill.services.find(service => service.name === 'Nước').price) }}</td>
              </tr>

              <!-- Các dịch vụ khác (Rác, Gửi xe) -->
              <tr v-for="(service, index) in selectedBill.services.filter(service => service.selected && service.name !== 'Điện' && service.name !== 'Nước')" :key="index">
                <td>{{ service.name }}</td>
                <td>{{ service.quantity || 1 }}</td>
                <td>{{ formatCurrency(service.price) }}</td>
                <td>{{ formatCurrency(service.price * (service.quantity || 1)) }}</td>
              </tr>
              </tbody>
            </table>

            <!-- Nhập số tiền đã trả -->
            <div class="form-group">
              <label for="paidAmount">Số tiền đã trả (VND):</label>
              <input type="number" class="form-control" v-model.number="selectedBill.paymentHistory[selectedMonth].paidAmount" @input="updateRemainingAmount" />
            </div>

            <h5 class="text-end">Số tiền còn lại: {{ formatCurrency(selectedBill.paymentHistory[selectedMonth].remainingAmount) }}</h5>
            <h5 class="text-end">Tổng cộng: {{ formatCurrency(selectedBill.paymentHistory[selectedMonth].remainingAmount) }}</h5>
          </div>
          <div class="modal-footer">
            <button class="btn btn-info me-2" @click="print"><i class="fas fa-print"></i> In</button>
            <button type="button" class="btn btn-danger" @click="exportToPDF">Tải file PDF</button>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>


    <!-- Modal Section -->
    <div class="modal fade" id="calculatorModal" tabindex="-1" aria-labelledby="calculatorModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title-sm" id="calculatorModalLabel">Tính tiền</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <label for="modalCycle">Kỳ</label>
            <select id="modalCycle" v-model="modalCycle" class="form-select-sm mb-3">
              <option value="">Tất cả</option>
              <option value="Kỳ 30">Kỳ 30</option>
              <option value="Kỳ 15">Kỳ 15</option>
            </select>

            <label for="modalDate">Ngày</label>
            <input type="date" id="modalDate" v-model="modalDate" class="form-control-sm mb-3" />

            <label for="modalMonthYear">Tháng năm</label>
            <input type="month" id="modalMonthYear" v-model="modalMonthYear" class="form-control-sm mb-3" />

            <label for="modalHouse">Nhà</label>
            <select id="modalHouse" v-model="modalHouse" class="form-select-sm mb-3">
              <option value="">Tất cả</option>
              <option v-for="house in homes" :key="house.name" :value="house.name">{{ house.name }}</option>
            </select>

            <label for="modalRoom">Phòng</label>
            <select id="modalRoom" v-model="modalRoom" class="form-select-sm mb-3">
              <option value="">Phòng</option>
              <option v-for="room in filteredRooms" :key="room.roomNumber" :value="room.roomNumber">{{ room.roomNumber }}</option>
            </select>

            <div class="form-check-sm">
              <input class="form-check-input" type="checkbox" v-model="recalculatePaidRooms" id="recalculatePaidRooms">
              <label class="form-check-label" for="recalculatePaidRooms">Tính lại tiền các phòng đã trả trong tháng</label>
            </div>
          </div>
          <div class="modal-footer-sm">
            <button type="button" class="btn btn-primary" @click="calculate"><i class="fas fa-calculator"></i> Tính</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-xmark"></i> Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { Modal } from 'bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  data() {
    return {
      selectedMonth: new Date().toISOString().substring(0, 7),
      selectedCycle: '',
      selectedHouse: '',
      searchQuery: '',
      selectAll: false,
      houses: [],
      customers: [],
      selectedCustomers: [],
      modalCycle: '',
      modalDate: new Date().toISOString().substring(0, 10),
      modalMonthYear: new Date().toISOString().substring(0, 7),
      modalHouse: '',
      modalRoom: '',
      recalculatePaidRooms: false,
      selectedBill: {
        house: '',
        roomNumber: '',
        customer: {
          fullName: '',
          rentalCost: 0,
        },
        services: [],
        paymentHistory: {
          [this.selectedMonth]: {
            totalAmount: 0,
            paidAmount: 0,
            remainingAmount: 0,
          },
        },
      }
    };
  },
  computed: {
    filteredCustomers() {
      let filtered = this.customers.filter(customer => {
        // Lọc những phòng có paymentHistory và không rỗng
        const paymentHistoryForSelectedMonth = customer.paymentHistory?.[this.selectedMonth];
        return paymentHistoryForSelectedMonth && Object.keys(paymentHistoryForSelectedMonth).length > 0;
      });

      if (this.selectedHouse) {
        filtered = filtered.filter(item => item.house === this.selectedHouse);
      }

      if (this.searchQuery.trim()) {
        filtered = filtered.filter(item =>
            item.customer.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            item.roomNumber.includes(this.searchQuery)
        );
      }

      return filtered;
    },
    filteredRooms() {
      return this.customers.filter(room => room.house === this.modalHouse);
    }
  },
  methods: {
    deleteSelected() {
      if (this.selectedCustomers.length === 0) {
        alert('Vui lòng chọn ít nhất một phòng để xóa dữ liệu thanh toán.');
        return;
      }

      const confirmation = confirm('Bạn có chắc chắn muốn xóa dữ liệu thanh toán của các phòng đã chọn không?');

      if (confirmation) {
        // Lấy dữ liệu từ localStorage
        let homes = JSON.parse(localStorage.getItem('homes')) || [];

        // Duyệt qua danh sách khách hàng đã chọn
        this.selectedCustomers.forEach(customer => {
          // Tìm đúng nhà và phòng trong danh sách homes
          const home = homes.find(home => home.name === customer.house);
          if (home) {
            const room = home.rooms.find(room => room.roomNumber === customer.roomNumber);

            if (room) {
              // Xóa dữ liệu paymentHistory cho tháng đã chọn
              delete room.customer.paymentHistory[this.selectedMonth];

              alert(`Đã xóa dữ liệu thanh toán của phòng ${room.roomNumber} thuộc nhà ${customer.house} cho tháng ${this.selectedMonth}.`);
            }
          }
        });

        // Cập nhật lại localStorage sau khi xóa
        localStorage.setItem('homes', JSON.stringify(homes));

        // Cập nhật lại danh sách khách hàng hiển thị
        this.loadDataFromLocalStorage();
      }
    },
    printList() {
      if (this.filteredCustomers.length === 0) {
        alert('Không có khách hàng nào để in danh sách.');
        return;
      }

      let printContents = `
      <h3 style="text-align: center;">Danh Sách Khách Hàng</h3>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Nhà</th>
            <th>Phòng</th>
            <th>Tên khách</th>
            <th>Tháng</th>
            <th>Số tiền (VND)</th>
            <th>Đã trả (VND)</th>
            <th>Còn lại (VND)</th>
          </tr>
        </thead>
        <tbody>
    `;

      this.filteredCustomers.forEach(customer => {
        printContents += `
        <tr>
          <td>${customer.house}</td>
          <td>${customer.roomNumber}</td>
          <td>${customer.customer.fullName}</td>
          <td>${this.selectedMonth}</td>
          <td>${this.formatCurrency(customer.paymentHistory?.[this.selectedMonth]?.totalAmount || 0)}</td>
          <td>${this.formatCurrency(customer.paymentHistory?.[this.selectedMonth]?.paidAmount || 0)}</td>
          <td>${this.formatCurrency(customer.paymentHistory?.[this.selectedMonth]?.remainingAmount || 0)}</td>
        </tr>
      `;
      });

      printContents += `</tbody></table>`;

      // Open a new window and print the contents
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
      <html>
        <head>
          <title>In danh sách khách hàng</title>
          <style>
            h3, p, table { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.print();
    },
    collectMoney() {
      if (this.selectedCustomers.length === 0) {
        alert('Vui lòng chọn ít nhất một phòng để thu tiền.');
        return;
      }

      // Lấy dữ liệu từ localStorage
      let homes = JSON.parse(localStorage.getItem('homes')) || [];

      this.selectedCustomers.forEach(customer => {
        // Kiểm tra nếu chưa có thông tin thanh toán của tháng đó, tạo đối tượng rỗng
        if (!customer.paymentHistory[this.selectedMonth]) {
          customer.paymentHistory[this.selectedMonth] = {
            totalAmount: 0,
            paidAmount: 0,
            remainingAmount: 0
          };
        }

        const totalAmount = customer.paymentHistory[this.selectedMonth].totalAmount || 0;
        let paidAmount = customer.paymentHistory[this.selectedMonth].paidAmount || 0;


        // Nếu số tiền đã trả nhỏ hơn tổng tiền cần thanh toán
        if (paidAmount < totalAmount) {
          const amountToCollect = prompt(`Số tiền cần thu cho ${customer.customer.fullName} là ${this.formatCurrency(totalAmount - paidAmount)}. Nhập số tiền bạn muốn thu:`, totalAmount - paidAmount);

          if (amountToCollect && !isNaN(amountToCollect)) {
            const amountCollected = parseFloat(amountToCollect);
            paidAmount += amountCollected;

            // Cập nhật lại các giá trị trong paymentHistory
            customer.paymentHistory[this.selectedMonth].paidAmount = paidAmount;
            customer.paymentHistory[this.selectedMonth].remainingAmount = totalAmount - paidAmount;

            // Tìm đúng nhà và phòng trong danh sách homes
            const home = homes.find(home => home.name === customer.house);
            if (home) {
              const room = home.rooms.find(room => room.roomNumber === customer.roomNumber);

              if (room) {
                // Cập nhật trạng thái phòng trong room và thông tin paymentHistory
                if (paidAmount >= totalAmount) {
                  room.isPaid = true;  // Đánh dấu là đã thu đủ tiền
                  alert(`Phòng ${customer.roomNumber} đã thu đủ tiền.`);
                } else {
                  room.isPaid = false;  // Chưa thanh toán đủ
                  alert(`Phòng ${customer.roomNumber} còn thiếu ${this.formatCurrency(totalAmount - paidAmount)}.`);
                }

                // Cập nhật thông tin paymentHistory vào room
                room.customer.paymentHistory[this.selectedMonth] = { ...customer.paymentHistory[this.selectedMonth] };
              }
            }

            // Cập nhật lại dữ liệu vào localStorage
            localStorage.setItem('homes', JSON.stringify(homes));
          } else {
            alert('Số tiền không hợp lệ.');
          }
        } else {
          alert(`Khách hàng ${customer.customer.fullName} đã trả đủ tiền.`);
        }
      });

      // Cập nhật lại danh sách phòng và reload dữ liệu
      this.loadDataFromLocalStorage();
    },
    print() {
      if (this.selectedCustomers.length === 0) {
        alert('Vui lòng chọn ít nhất một phòng để in hoá đơn.');
        return;
      }

      let printContents = '';

      // Loop over each selected customer and generate the bill content
      this.selectedCustomers.forEach(customer => {
        let serviceDetails = '';


        customer.services.forEach(service => {
          let serviceUsage = 0;
          let totalAmount = 0;

          // Calculate usage and total cost for each service
          if (service.name === 'Điện') {
            serviceUsage = this.getElectricUsage(customer);
            totalAmount = serviceUsage * service.price;
          } else if (service.name === 'Nước') {
            serviceUsage = this.getWaterUsage(customer);
            totalAmount = serviceUsage * service.price;
          } else {
            serviceUsage = service.quantity || 1;
            totalAmount = serviceUsage * service.price;
          }

          serviceDetails += `
        <tr>
          <td>${service.name}</td>
          <td>${serviceUsage}</td>
          <td>${this.formatCurrency(service.price)}</td>
          <td>${this.formatCurrency(totalAmount)}</td>
        </tr>
      `;
        });

        // Generate bill content for each selected customer
        let billContent = `
      <h3 style="text-align: center;">HÓA ĐƠN TIỀN NHÀ</h3>
      <p><strong>Nhà:</strong> ${customer.house}</p>
      <p><strong>Phòng:</strong> ${customer.roomNumber}</p>
      <p><strong>Khách thuê:</strong> ${customer.customer.fullName}</p>
      <p><strong>Tháng:</strong> ${this.selectedMonth}</p>

      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Khoản mục</th>
            <th>Số lượng</th>
            <th>Giá (VND)</th>
            <th>Tổng (VND)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tiền nhà</td>
            <td>-</td>
            <td>${this.formatCurrency(customer.customer.rentalCost)}</td>
            <td>${this.formatCurrency(customer.customer.rentalCost)}</td>
          </tr>
          ${serviceDetails} <!-- Include all services like Điện, Nước, Gửi xe máy, Rác here -->
        </tbody>
      </table>
        <h3  style="text-align: left;">Số tiền đã trả: ${this.formatCurrency(customer.paymentHistory?.[this.selectedMonth]?.paidAmount || 0)}</h3>
      <h3 style="text-align: right;">Tổng cộng: ${this.formatCurrency(customer.paymentHistory?.[this.selectedMonth]?.remainingAmount || 0)}</h3>
      <hr>
    `;

        printContents += billContent;
      });

      // Open a new window and print the contents
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(`
    <html>
      <head>
        <title>Hóa đơn tiền nhà</title>
        <style>
          h3, p, table { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);
      printWindow.document.close();
      printWindow.print();
    },
    showBillDetail(bill) {
      this.selectedBill = bill;  // Lưu thông tin hóa đơn của phòng hiện tại
      const billDetailModal = new Modal(document.getElementById('billDetailModal'));  // Sử dụng Modal từ bootstrap
      billDetailModal.show();  // Hiển thị modal chi tiết hóa đơn
    },
    exportToPDF() {
      const doc = new jsPDF();

      // Set up the title
      doc.setFontSize(18);
      doc.text("HÓA ĐƠN TIỀN NHÀ", 105, 20, { align: 'center' });

      // Information section
      doc.setFontSize(12);
      doc.text(`Nhà: ${this.selectedBill.house}`, 10, 30);
      doc.text(`Phòng: ${this.selectedBill.roomNumber}`, 10, 40);
      doc.text(`Khách thuê: ${this.selectedBill.customer.fullName}`, 10, 50);
      doc.text(`Tháng: ${this.selectedMonth}`, 10, 60);

      // Set up the table header
      const tableColumns = ["Khoản mục", "Số lượng", "Giá (VND)", "Tổng (VND)"];
      const tableRows = [];

      // Add rent row
      tableRows.push([
        "Tiền nhà", "-", this.formatCurrency(this.selectedBill.customer.rentalCost), this.formatCurrency(this.selectedBill.customer.rentalCost)
      ]);

      // Add services (Điện, Nước, Rác, etc.)
      this.selectedBill.services.forEach(service => {
        if (service.selected) {
          let serviceUsage = 1; // Default quantity to 1 for services without usage
          let totalCost = service.price;

          if (service.name === 'Điện') {
            serviceUsage = this.getElectricUsage(this.selectedBill);
            totalCost = service.price * serviceUsage;
          } else if (service.name === 'Nước') {
            serviceUsage = this.getWaterUsage(this.selectedBill);
            totalCost = service.price * serviceUsage;
          }

          tableRows.push([
            service.name,
            `${serviceUsage} ${service.name === 'Điện' ? 'kWh' : service.name === 'Nước' ? 'm³' : ''}`,
            this.formatCurrency(service.price),
            this.formatCurrency(totalCost)
          ]);
        }
      });

      // Add the table to the PDF
      doc.autoTable({
        head: [tableColumns],
        body: tableRows,
        startY: 70,
        theme: 'grid',
        styles: {
          halign: 'center',
          fontSize: 10,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [52, 58, 64],
          textColor: [255, 255, 255],
        },
      });

      // Summary section
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.text(`Tổng cộng: ${this.formatCurrency(this.selectedBill.paymentHistory?.[this.selectedMonth]?.totalAmount || 0)}`, 105, finalY, { align: 'right' });

      const paidAmount = this.selectedBill.paymentHistory?.[this.selectedMonth]?.paidAmount || 0;
      const remainingAmount = this.selectedBill.paymentHistory?.[this.selectedMonth]?.remainingAmount || 0;

      doc.text(`Đã trả: ${this.formatCurrency(paidAmount)}`, 105, finalY + 10, { align: 'right' });
      doc.text(`Còn lại: ${this.formatCurrency(remainingAmount)}`, 105, finalY + 20, { align: 'right' });

      // Save the PDF
      doc.save('hoa_don_tien_nha.pdf');
    },
    loadDataFromLocalStorage() {
      const storedHomes = localStorage.getItem('homes');

      if (storedHomes) {
        this.homes = JSON.parse(storedHomes);
        this.customers = [];

        // Nạp dữ liệu từ localStorage và gán vào houses
        const homesData = JSON.parse(storedHomes);
        this.houses = homesData.map(home => ({
          name: home.name
        }));

        // Lấy giá trị của selectedHouse từ localStorage nếu đã lưu trước đó
        const storedSelectedHouse = localStorage.getItem('selectedHouse');
        if (storedSelectedHouse) {
          this.selectedHouse = storedSelectedHouse;
        }

        this.homes.forEach(home => {
          home.rooms.forEach(room => {
            if (room.customer) {
              this.customers.push({
                house: home.name,
                roomNumber: room.roomNumber,
                customer: room.customer,
                services: room.services || [],
                otherFees: room.otherFees || [],
                electricData: room.electricData || [],
                waterData: room.waterData || [],
                paymentHistory: room.customer.paymentHistory || {},
                isPaid: room.customer.isPaid || false,
              });
            }
          });
        });
      }
      const storedSelectedHouse = localStorage.getItem('selectedHouse');
      if (storedSelectedHouse) {
        this.selectedHouse = storedSelectedHouse;
      }
    },
    getElectricUsage(customer) {
      const electricData = customer.electricData.find(e => e.monthYear === this.selectedMonth);
      return electricData ? electricData.electricUsage : 0;
    },
    getWaterUsage(customer) {
      const waterData = customer.waterData.find(w => w.monthYear === this.selectedMonth);
      return waterData ? waterData.waterUsage : 0;
    },
    calculate() {
      this.customers.forEach(customer => {
        if (
            (this.modalHouse === '' || customer.house === this.modalHouse) &&
            (this.modalRoom === '' || customer.roomNumber === this.modalRoom)
        ) {
          let totalAmount = customer.customer.rentalCost || 0;  // Đảm bảo totalAmount không bị null

          // Lấy thông tin các dịch vụ của phòng từ room
          const roomServices = customer.services || [];  // Nếu services không tồn tại, gán thành mảng rỗng

          // Tính toán cho các dịch vụ có selected = true
          let serviceAmount = 0;
          roomServices.forEach(service => {
            if (service.selected) {  // Chỉ tính toán cho các dịch vụ có selected = true
              if (service.name === 'Điện') {
                const electricityUsage = this.getElectricUsage(customer);
                serviceAmount += service.price * electricityUsage;
              } else if (service.name === 'Nước') {
                const waterUsage = this.getWaterUsage(customer);
                serviceAmount += service.price * waterUsage;
              } else {
                // Các dịch vụ khác như rác, gửi xe máy
                serviceAmount += service.price * service.quantity;
              }
            }
          });

          totalAmount += serviceAmount;

          // Cộng các khoản phí phát sinh khác
          let otherFeesAmount = 0;
          customer.otherFees.forEach(fee => {
            otherFeesAmount += fee.amount || 0;  // Đảm bảo otherFeesAmount không bị null
          });
          totalAmount += otherFeesAmount;

          const paidAmount = customer.customer.paidAmount || 0;  // Đảm bảo paidAmount không bị null
          const remainingAmount = totalAmount - paidAmount;  // Tránh giá trị null

          // Lưu vào paymentHistory của tháng được chọn
          if (!customer.paymentHistory) {
            customer.paymentHistory = {};
          }
          customer.paymentHistory[this.selectedMonth] = {
            totalAmount,
            paidAmount,
            remainingAmount: remainingAmount >= 0 ? remainingAmount : 0  // Đảm bảo không có giá trị âm hoặc null
          };

          // Cập nhật dữ liệu vào localStorage
          const storedHomes = JSON.parse(localStorage.getItem('homes')) || [];
          const home = storedHomes.find(home => home.name === customer.house);
          if (home) {
            const room = home.rooms.find(room => room.roomNumber === customer.roomNumber);
            if (room) {
              room.customer.paymentHistory = customer.paymentHistory;
            }
          }
          localStorage.setItem('homes', JSON.stringify(storedHomes));
        }
      });

      this.loadDataFromLocalStorage();
      alert('Tiền phòng đã được tính xong!');
    },
    updateRemainingAmount() {
      const totalAmount = this.selectedBill.paymentHistory?.[this.selectedMonth]?.totalAmount || 0;
      const paidAmount = this.selectedBill.paymentHistory?.[this.selectedMonth]?.paidAmount || 0;

      const remainingAmount = totalAmount - paidAmount;
      this.selectedBill.paymentHistory[this.selectedMonth].remainingAmount = remainingAmount >= 0 ? remainingAmount : 0;
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
    exportToExcel() {
      const worksheet = XLSX.utils.json_to_sheet(this.filteredCustomers.map(item => ({
        "Nhà": item.house,
        "Phòng": item.roomNumber,
        "Tên khách": item.customer.fullName,
        "Tháng": this.selectedMonth,
        "Số tiền (VND)": item.paymentHistory?.[this.selectedMonth]?.totalAmount || 0,
        "Đã trả (VND)": item.paymentHistory?.[this.selectedMonth]?.paidAmount || 0,
        "Còn lại (VND)": item.paymentHistory?.[this.selectedMonth]?.remainingAmount || 0
      })));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_sach_tinh_tien");
      XLSX.writeFile(workbook, "Danh_sach_tinh_tien.xlsx");
    }
  },
  mounted() {
    this.loadDataFromLocalStorage();
  },
  watch: {
    selectedHouse(newVal) {
      // Mỗi khi giá trị selectedHouse thay đổi, lưu lại vào localStorage
      localStorage.setItem('selectedHouse', newVal);
    }
  }
};
</script>


<style scoped>
.calculator-money {
  margin-top: 3em !important;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: left;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e2d3b;
}

.table-responsive {
  margin-top: 20px;
}

.table th, .table td {
  text-align: center;
  vertical-align: middle;
}

.alert-info {
  margin-top: 20px;
}

.form-check-sm {
  display: flex;
  align-items: center;
}

.form-check-input {
  width: 5px;
  margin-right: 5px;
}
</style>
