import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './Voucher.css';  // Thay đổi tên file CSS nếu cần
import { API_URL } from "../../../../configs/varibles";

function VoucherAdd() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            code: '',
            discount_amount: '',
            expiration_date: ''
        },
        validationSchema: Yup.object({
            code: Yup.string().required('Mã voucher là bắt buộc'),
            discount_amount: Yup.number().required('Số tiền giảm là bắt buộc').positive('Số tiền giảm phải là số dương'),
            expiration_date: Yup.date().required('Ngày hết hạn là bắt buộc').min(new Date(), 'Ngày hết hạn phải lớn hơn hoặc bằng hôm nay')
        }),
        onSubmit: async (values) => {
            try {
                const res = await fetch(`${API_URL}/vouchers/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values),
                });

                // Kiểm tra phản hồi lỗi
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Phản hồi lỗi:', errorText);
                    alert('Có lỗi xảy ra, vui lòng thử lại!');
                    return;
                }
                alert('Thêm voucher thành công!');
                navigate('/admin/voucherlist');
            } catch (err) {
                console.error('Error:', err);
                alert('Có lỗi xảy ra, vui lòng thử lại!');
            }
        }
    });

    return (
        <form className="frmaddvoucher" id="frmaddvoucher" onSubmit={formik.handleSubmit}>
            <h2 className="title-page-voucher">Thêm Voucher</h2>
            <div className='col'>
                <label>Mã Voucher:</label>
                <input
                    type="text"
                    className="form-control"
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.code && formik.errors.code && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.code}</div>
                )}
            </div>
            <div className='col'>
                <label>Số tiền giảm:</label>
                <input
                    type="number"
                    className="form-control"
                    name="discount_amount"
                    value={formik.values.discount_amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.discount_amount && formik.errors.discount_amount && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.discount_amount}</div>
                )}
            </div>
            <div className='col'>
                <label>Ngày hết hạn:</label>
                <input
                    type="date"
                    className="form-control"
                    name="expiration_date"
                    value={formik.values.expiration_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.expiration_date && formik.errors.expiration_date && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.expiration_date}</div>
                )}
            </div>

            <div className="mb-3">
                <button className="add-btn-voucher" type="submit">
                    Thêm Voucher
                </button> &nbsp;
                <Link to={`/admin/voucherlist`} href="/#" className="btn-voucher-list">Danh sách Voucher</Link>
            </div>
        </form>
    );
}

export default VoucherAdd;
