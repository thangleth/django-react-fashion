import React, { useState, useEffect, useMemo } from 'react';
import Statistics from '../dashboard/Statistics';
import { Bar, Pie } from 'react-chartjs-2'; // Import biểu đồ Bar và Pie
import './MainContent.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MainContent = React.memo(() => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalOrders: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState(0); // Tổng doanh thu
  const [orderCountByStatus, setOrderCountByStatus] = useState({}); // Số lượng đơn hàng theo trạng thái
  const [categories, setCategories] = useState([]); // Danh sách danh mục
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear()); // Khởi tạo với năm hiện tại

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [productsRes, usersRes, categoriesRes, ordersRes, revenueRes, categoriesListRes] = await Promise.all([
          fetch('http://localhost:8000/product/products/count'),
          fetch('http://localhost:8000/user/users/total'),
          fetch('http://localhost:8000/category/categories/count'),
          fetch('http://localhost:8000/orders/orders/total'),
          fetch(`http://localhost:8000/orders/sum/total-revenue?year=${year}`), // Gửi year làm tham số
          fetch('http://localhost:8000/category'), // API lấy danh sách danh mục
        ]);

        if (!productsRes.ok || !usersRes.ok || !categoriesRes.ok || !ordersRes.ok || !revenueRes.ok || !categoriesListRes.ok) {
          throw new Error('Failed to fetch statistics data');
        }

        const [productsData, usersData, categoriesData, ordersData, revenueData, categoriesList] = await Promise.all([
          productsRes.json(),
          usersRes.json(),
          categoriesRes.json(),
          ordersRes.json(),
          revenueRes.json(),
          categoriesListRes.json(), // Lấy danh sách danh mục
        ]);

        setStats({
          totalProducts: productsData.totalProducts ?? 0,
          totalUsers: usersData.totalUsers ?? 0,
          totalCategories: categoriesData.total ?? 0,
          totalOrders: ordersData.totalOrders ?? 0,
        });

        setTotalRevenue(revenueData.totalRevenue ?? 0); // Cập nhật doanh thu
        setOrderCountByStatus(revenueData.orderCountByStatus ?? {}); // Cập nhật số lượng đơn hàng theo trạng thái
        setCategories(categoriesList); // Cập nhật danh sách danh mục
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Unable to fetch statistics at this time. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [year]); // Mỗi khi year thay đổi, fetch lại dữ liệu

  const handleYearChange = (event) => {
    setYear(event.target.value); // Cập nhật năm khi người dùng chọn từ dropdown
  };

  const revenueChartData = useMemo(() => ({
    labels: ['Doanh thu'],
    datasets: [
      {
        label: 'Tổng doanh thu',
        data: [totalRevenue],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }), [totalRevenue]);

  const orderCountByStatusChartData = useMemo(() => ({
    labels: Object.keys(orderCountByStatus),
    datasets: [
      {
        label: 'Số lượng đơn hàng theo trạng thái',
        data: Object.values(orderCountByStatus),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }), [orderCountByStatus]);

  const categoryChartData = useMemo(() => ({
    labels: categories.map(category => category.category_name),
    datasets: [
      {
        label: 'Danh mục',
        data: categories.map(category => category.category_id), // Sử dụng ID danh mục làm dữ liệu mẫu
        backgroundColor: categories.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.6)`),
        borderColor: categories.map((_, index) => `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`),
        borderWidth: 1,
      },
    ],
  }), [categories]);

  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  if (error) {
    return (
      <div className="main-content px-4 py-6 pl-60">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="main-content px-4 py-6 pl-60">
      {/* Bộ lọc năm */}
      

      <section className="statistics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14 w-full">
        <div className="border p-3 rounded -md bg-white shadow-md">
          <Statistics title="Tổng sản phẩm" number={stats.totalProducts || 0} link="/" />
        </div>
        <div className="border p-3 rounded -md bg-white shadow-md">
          <Statistics title="Tổng thành viên" number={stats.totalUsers || 0} link="/" />
        </div>
        <div className="border p-3 rounded -md bg-white shadow-md">
          <Statistics title="Tổng danh mục" number={stats.totalCategories || 0} link="/" />
        </div>
        <div className="border p-3 rounded -md bg-white shadow-md">
          <Statistics title="Tổng đơn hàng" number={stats.totalOrders || 0} link="/" />
        </div>
        <div className="border p-3 rounded -md bg-white shadow-md">
          <Statistics title="Tổng doanh thu" number={totalRevenue || 0} link="/" />
        </div>
      </section>
      
      <div className="chart-containers">
        <Bar data={categoryChartData} />
      </div>
      <div className="year-filter mb-4">
        <label htmlFor="year" className="font-bold text-gray-800 mr-2">Chọn năm:</label>
        <select
          id="year"
          value={year}
          onChange={handleYearChange}
          className="border p-2 rounded"
        >
          {[2025, 2024, 2023, 2022, 2021].map((yearOption) => (
            <option key={yearOption} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </select>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <Bar data={revenueChartData} />
        </div>      
        <div className="chart-container pie-chart-container">
          <Pie data={orderCountByStatusChartData} />
        </div>
      </div>
      
    </div>
  );
});

export default MainContent;