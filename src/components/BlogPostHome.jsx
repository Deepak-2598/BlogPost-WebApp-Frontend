import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/BlogEditor.css'; 
import { useNavigate } from 'react-router-dom';
import WrappedCheckout from './Checkout';
import Modal from './Modal';

const Editor = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [location, setLocation] = useState('');
    const [amount, setAmount] = useState(1000);
    const [isPaying, setIsPaying] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await axios.get('https://ipapi.co/json/');
                setLocation(`${response.data.city}, ${response.data.region}, ${response.data.country}`);
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        };

        fetchLocation();
    }, []);

    const handlePaymentSuccess = async () => {
        setPaymentSuccess(true);
        try {
            await axios.post('http://localhost:5000/blogs', {
                title,
                content,
                location
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            navigate('/success');
        } catch (error) {
            console.error('Error creating blog post:', error);
        }
    };

    const handlePaymentError = (error) => {
        console.error('Payment error:', error);
    };

    const handlePreview = () => {
        navigate('/preview', {
            state: { title, content, location }
        });
    };

    return (
        <div className="editor-container">
            <form className="editor-form">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="editor-title"
                />
                <ReactQuill 
                    value={content} 
                    onChange={setContent} 
                    modules={Editor.modules}
                    formats={Editor.formats}
                    className="editor-content"
                />
                
                <div className="location-info">
                    <label>Location: {location}</label>
                </div>
                
                <button type="button" onClick={() => setIsPaying(true)} className="editor-submit">Publish Blog</button>
                <button type="button" onClick={handlePreview} className="editor-preview">Preview</button>
            </form>

            <Modal isOpen={isPaying} onClose={() => setIsPaying(false)}>
                <WrappedCheckout 
                    amount={amount} 
                    onSuccess={handlePaymentSuccess} 
                    onError={handlePaymentError} 
                />
            </Modal>
        </div>
    );
};

Editor.modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'] 
    ],
};

Editor.formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'link', 'image', 'video',
    'color', 'background', 'font', 'align'
];

export default Editor;
