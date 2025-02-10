import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { API_URL } from "../../../../configs/varibles";

const NewsPage = () => {
    const [newsArticles, setNewsArticles] = useState([]);
    const [loading, setLoading] = useState(null);  // Trạng thái loading

    useEffect(() => {
        fetch(`${API_URL}/news`)
            .then(response => response.json())
            .then(data => {
                // Kiểm tra xem dữ liệu có phải là mảng không
                if (Array.isArray(data)) {
                    setNewsArticles(data);
                } else {
                    console.error("API trả về dữ liệu không phải là mảng:", data);
                    setNewsArticles([]); // Gán mảng rỗng để tránh lỗi
                }
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu tin tức:", error);
                setNewsArticles([]); // Gán mảng rỗng trong trường hợp lỗi
            });
    }, []);

    const handleIncrementViews = (id) => {
        // Kiểm tra nếu đang xử lý yêu cầu cho bài viết này
        if (loading === id) return;

        setLoading(id);  // Đánh dấu là đang xử lý

        fetch(`${API_URL}/news/increment-views/${id}`, { method: 'PATCH' })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Lỗi khi cập nhật lượt xem");
                }
                return response.json();
            })
            .then(data => {
                console.log("Lượt xem đã được cập nhật", data);
            })
            .catch(error => console.error("Lỗi khi cập nhật lượt xem", error))
            .finally(() => {
                setLoading(null);  // Khi xong thì reset lại loading
            });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsArticles.length === 0 ? (
                    <div className="col-span-3 text-center text-lg text-gray-700">Không có tin tức nào</div>
                ) : (
                    newsArticles.map(article => (
                        <article key={article.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <img src={article.image_news ? `${API_URL}/img/${article.image_news}` : 'default-image.jpg'} alt={article.title_news} className="w-full h-96 object-cover rounded-t-lg" />
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-3">{article.title_news}</h2>
                                <p className="text-gray-700 mb-4">{article.summary}</p>
                                <p className="text-gray-500 mb-4">Tác giả: {article.author}</p>
                                <p className="text-sm text-gray-400 text-right">Lượt xem: {article.views}</p>
                                <Link to={`/news/${article.id}`} className="inline-block text-blue-600 hover:underline" onClick={() => handleIncrementViews(article.id)}>Đọc thêm</Link>
                            </div>
                        </article>
                    ))
                )}
            </main>
        </div>
    );  
};

export default NewsPage;