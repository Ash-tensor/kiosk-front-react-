import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import {format} from 'date-fns';

interface Order{
    id: number;
    customerId: number;
    kioskId: number;
    dateTime: Date;
    totalPrice: number;
    paymentUid: string;
}

interface Refund{
    imp_uid: string
}

const RefundManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [refunds, setRefunds] = useState<Refund[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL;
    const iamportHost = "https://api.iamport.kr";

    useEffect(() => {
        axios.get(`${API_URL}/admin/payment/all`)
            .then(response => setOrders(response.data))
            .catch(err => console.log('에러 확인: ', err));
    },[])

    const handleDeleteOrder = (id:number) => {
        if(!window.confirm('결제를 취소하시겠습니까?')){
            return;
        }
        const order = orders.find(order => order.id === id);
        const paymentUid = order?.paymentUid;
        /*axios.post(`${iamportHost}/users/getToken`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                data: {
                    "imp_key": "3138755861825685",
                    "imp_secret": "r8nLkhIcnS0ml1IUnbWIDRklNnoUWMpMmsjQmeU7jbfAlDrnKEjKSZ5vaxGajaKRLMx8N2eH7C9ujrtL"
                }
            })
            .then((response) => console.log(response))
            .catch(err => console.log(err));
        axios.post(`https://api.iamport.kr/payments/cancel?_token=ef40495dd39d10d51dfb289d9789af246659cc51`,
            {imp_uid: {paymentUid}})*/
        axios.delete(`${API_URL}/admin/payment/delete`, {params: {id}})
            .then(()=>{
                setOrders(orders.filter(order => order.id !== id))
                alert('취소되었습니다.');
            })
            .catch(error => console.error('삭제 오류 확인: ', error));
    }

    const handleCloseModal = () => {
        setShowAddModal(false);
    }

    const handleOpenModal = () => {
        handleCloseModal();
        setShowAddModal(true);
    }

    return (
        <>
            <h2>결제 취소 관리</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        <>구매시간 : {format(order.dateTime, 'yyyy-MM-dd HH:mm')} / 가격 : {order.totalPrice}</>
                        <button onClick={() => handleDeleteOrder(order.id)}>취소</button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default RefundManagement;