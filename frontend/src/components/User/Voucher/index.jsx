import React, { useState, useEffect } from "react";
import axios from "axios";
import bg_voucher from "../../../../public/images/discount/bg-voucher.webp"

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const VoucherComponent = () => {
  const [vouchers, setVouchers] = useState([]);
  const [copiedVoucherId, setCopiedVoucherId] = useState(null);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/vouchers");
        setVouchers(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };  

    fetchVouchers();
  }, []);

  const handleCopyCode = (id, code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedVoucherId(id); // Lưu ID của voucher được sao chép
      setTimeout(() => setCopiedVoucherId(null), 3000); // Xóa trạng thái sau 3 giây
    });
  };

  return (
    <div className="container mx-auto my-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-center py-10 px-20 rounded-lg shadow-md relative">
            <img
              src={bg_voucher}
              className="w-20 mx-auto mb-4 rounded-lg"
            />
            <h3 className="text-2xl font-semibold mb-4">
                Mã giảm giá {voucher.discount_amount}%
                <br/>
                Áp dụng cho tất cả sản phẩm   
            </h3>
            <div className="flex items-center mb-6 justify-center">
              <span
                id="cpnCode"
                className="border-dashed border text-white px-4 py-2 rounded-l"
              > 
                {voucher.code} 
              </span>
              <span
                id="cpnBtn"
                className="border border-white bg-white text-purple-600 px-4 py-2 rounded-r cursor-pointer"
                onClick={() => handleCopyCode(voucher.id, voucher.code)}
              >
                {copiedVoucherId === voucher.id ? "Đã sao chép!" : "Sao chép"}
              </span>
            </div>
            <p className="text-md">Hạn sử dụng: {formatDate(voucher.expiration_date)}</p>
            <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
            <div className="w-12 h-12 bg-white rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherComponent;
