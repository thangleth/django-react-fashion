import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Voucher.css';
import axios from 'axios';
import { API_URL } from "../../../../configs/varibles";

function VoucherList() {
    const [vouchers, setVouchers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortOrder, setSortOrder] = useState('asc');
    const vouchersPerPage = 5;

    // Fetch vouchers from API
    const fetchVouchers = async () => {
        try {
            const response = await axios.get(`${API_URL}/vouchers`);
            setVouchers(response.data);
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        }
    };

    // Hide or show voucher
    const toggleVoucherVisibility = async (voucher_id, is_hidden) => {
        const newStatus = is_hidden ? "show" : "hide";
        if (window.confirm(`Bạn có chắc chắn muốn ${newStatus} voucher này?`)) {
            try {
                const response = await axios.patch(`${API_URL}/vouchers/${newStatus}/${voucher_id}`, {}, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.status === 200) {
                    console.log(`Voucher đã được ${newStatus} thành công`);
                    fetchVouchers();
                } else {
                    console.error("Lỗi khi thay đổi trạng thái voucher");
                }
            } catch (error) {
                console.error("Error changing voucher status:", error);
            }
        }
    };

    // Filter vouchers based on search
    const filteredVouchers = vouchers.filter(voucher =>
        voucher.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        voucher.discount_amount.toString().includes(searchKeyword)
    );

    // Sort vouchers by ID
    const sortedVouchers = [...filteredVouchers].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.voucher_id - b.voucher_id;
        } else {
            return b.voucher_id - a.voucher_id;
        }
    });

    // Pagination logic
    const indexOfLastVoucher = currentPage * vouchersPerPage;
    const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
    const currentVouchers = sortedVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

    const totalPages = Math.ceil(sortedVouchers.length / vouchersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleSortById = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    return (
        <div className="vouchers-table">
            <h2 className="title-page-voucher">Danh sách Voucher</h2>
            <div className="search-flex-voucher">
                <Link to={`/admin/voucherlist/add-vouchers`} className="add-btn-voucher">Thêm Voucher</Link>
                <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="form-control-search-voucher"
                        type="search"
                        placeholder="Tìm kiếm theo mã hoặc số tiền giảm"
                        aria-label="Search"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                    <button className="search-btn-voucher" type="button">Tìm kiếm</button>
                </form>
            </div>
            <table className="table-voucher">
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>
                            <span>ID</span>
                            <button className="sort-btn" onClick={handleSortById}>
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </th>
                        <th>Mã Voucher</th>
                        <th>Số tiền giảm</th>
                        <th>Ngày hết hạn</th>
                        <th>Công cụ</th>
                    </tr>
                </thead>
                <tbody>
                    {currentVouchers.map((voucher) => (
                        <tr key={voucher.id}>
                            <td>{voucher.id}</td>
                            <td>{voucher.code}</td>
                            <td>{voucher.discount_amount}</td>
                            <td>{new Date(voucher.expiration_date).toLocaleDateString()}</td>
                            <td>
                                <button
                                    className={`hide-btn-voucher ${voucher.is_hidden ? 'show-text' : ''}`}
                                    onClick={() => toggleVoucherVisibility(voucher.voucher_id, voucher.is_hidden)}
                                >
                                    {voucher.is_hidden ? "Hiện" : "Ẩn"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-btn">Trang trước</button>
                <span className="pagination-info">Trang {currentPage} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">Trang sau</button>
            </div>
        </div>
    );
}

export default VoucherList;
