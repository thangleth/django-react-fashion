import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_URL } from "../../../../configs/varibles";

const DetailPage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [otherArticles, setOtherArticles] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/news/${id}`)
            .then(response => response.json())
            .then(data => setArticle(data))
            .catch(error => console.error("Lỗi khi lấy bài viết chi tiết", error));
    }, [id]);

    useEffect(() => {
        fetch(`${API_URL}/news`)
            .then(response => response.json())
            .then(data => {
                const filteredArticles = data.filter(article => article.id !== Number(id)).slice(0, 3);
                setOtherArticles(filteredArticles);
            })
            .catch(error => console.error("Lỗi khi lấy danh sách tin tức khác", error));
    }, [id]);

    if(!article){
        return <div className="text-center py-10 text-lg text-gray-700">Bài viết không tồn tại</div>;
    }

    const formattedDate = new Date(article.createdAt).toLocaleDateString();
    
    return (
        <div className="bg-gray-50 min-h-screen flex justify-center">
            <div className="max-w-screen-xl w-full grid grid-cols-1 md:grid-cols-3 gap-12 p-10">
                <div className="md:col-span-2">
                    <article className="bg-white rounded-lg shadow-2xl overflow-hidden">
                        <img src={article.image_news ? `${API_URL}/img/${article.image_news}` : 'default-image.jpg'} alt={article.title_news}  className="w-full h-96 object-cover rounded-t-lg" />
                        <div className="p-8">
                            <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">{article.title_news}</h2>
                            <p className="text-xl text-gray-700 leading-relaxed">{article.content}</p>
                            <div className="mt-6 flex justify-between text-sm text-gray-500">
                                <p className="text-left">Ngày tạo: {formattedDate}</p>
                                <p className="text-right">Tác giả: {article.author}</p>
                            </div>
                        </div>
                    </article>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Tin tức khác</h3>
                    <div className="space-y-6">
                        {otherArticles.map((other) => (
                            <Link key={other.id} to={`/news/${other.id}`} className="block bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow">
                                <div className="flex items-center space-x-4">
                                    <img src={other.image_news ? `${API_URL}/img/${other.image_news}` : 'default-image.jpg'}  alt={other.title_news} className="w-16 h-16 object-cover rounded-md" />
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-800">{other.title_news}</h4>
                                        <p className="text-sm text-gray-500 mt-2">{other.summary}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailPage;