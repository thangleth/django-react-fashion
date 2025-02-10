import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Products.css';
import { API_URL } from "../../../../configs/varibles";

function DetailAdd() {
  const [detail, setDetail] = useState({
    size_id: '',
    color_id: '',
    description: '',
    product_id: '',
    isFeature: false,
    isHot: false,
    image: null,
  });
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const navigate = useNavigate(); // Khai báo hook navigate

  // Lấy danh sách size và màu
  useEffect(() => {
    // Lấy danh sách size
    axios.get(`${API_URL}/sizes`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setSizes(response.data);
        } else {
          console.error('Dữ liệu trả về không hợp lệ');
        }
      })
      .catch((error) => {
        console.error('Error fetching sizes:', error);
      });

    // Lấy danh sách màu
    axios.get(`${API_URL}/colors`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setColors(response.data);
        } else {
          console.error('Dữ liệu trả về không hợp lệ');
        }
      })
      .catch((error) => {
        console.error('Error fetching colors:', error);
      });
  }, []);

  const submitDuLieu = (e) => {
    e.preventDefault();

    if (!detail.size_id || !detail.color_id) {
      console.error('Vui lòng chọn size và màu.');
      return;
    }

    const formData = new FormData();
    formData.append("size_id", detail.size_id);
    formData.append("color_id", detail.color_id);
    formData.append("description", detail.description);
    formData.append("product_id", detail.product_id);
    formData.append("isFeature", detail.isFeature);
    formData.append("isHot", detail.isHot);

    if (detail.image) {
      formData.append("image", detail.image);
    }

    axios.post(`${API_URL}/detail`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
      .then((response) => {
        alert("Đã thêm chi tiết sản phẩm thành công!");
        setDetail({
          size_id: '',
          color_id: '',
          description: '',
          product_id: '',
          isFeature: false,
          isHot: false,
          image: null,
        });
        navigate('/admin/productdetaillist');
      })
      .catch((error) => {
        console.error("Lỗi khi thêm chi tiết sản phẩm:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setDetail(prevDetail => ({
        ...prevDetail,
        [name]: files[0],
      }));
    } else {
      setDetail(prevDetail => ({
        ...prevDetail,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  return (
    <form id="frmaddproduct" className="frmaddproduct" onSubmit={submitDuLieu}>
      <h2 className="title-page-products">Thêm chi tiết sản phẩm</h2>
      <div className='col'>
        <label>Size:</label>
        <select className="form-control" name="size_id" value={detail.size_id} onChange={handleChange} required>
          <option value="">Chọn size</option>
          {sizes.map(size => (
            <option key={size.size_id} value={size.size_id}>
              {size.size_name}
            </option>
          ))}
        </select>
      </div>
      <div className='col'>
        <label>Color:</label>
        <select className="form-control" name="color_id" value={detail.color_id} onChange={handleChange} required>
          <option value="">Chọn màu</option>
          {colors.map(color => (
            <option key={color.color_id} value={color.color_id}>
              {color.color_name}
            </option>
          ))}
        </select>
      </div>
      <div className='col'>
        <label>Mô tả:</label>
        <textarea value={detail.description} className="form-control" name="description" onChange={handleChange} />
      </div>
      <div className="col">
        <label>Phổ biến:</label>
        <input type="checkbox" name="isFeature" checked={detail.isFeature} onChange={handleChange} />
      </div>
      <div className="col">
        <label>Hot:</label>
        <input type="checkbox" name="isHot" checked={detail.isHot} onChange={handleChange} />
      </div>
      <div className="col">
        <label>Chọn hình ảnh:</label>
        <input type="file" className="form-control" name="image" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <button className="add-btn-products" type="submit">Thêm chi tiết sản phẩm</button> &nbsp;
        <Link to="/admin/productdetaillist/${productdetail.productdetail_id}" className="btn-products-list">Danh sách chi tiết</Link>
      </div>
    </form>
  );
}

export default DetailAdd;