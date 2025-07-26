import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { dummyOrders } from '../assets/assets'
import toast from 'react-hot-toast'

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([])
    const { currency, axios, user, navigate } = useAppContext()

    const fetchMyOrders = async () => {
        try {
            if (!user) {
                navigate('/login')
                return
            }

            const { data } = await axios.get(`/api/order/user?userId=${user._id}`)
            if (data.success) {
                setMyOrders(data.orders)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders")
            console.error("Order fetch error:", error)
        }
    }

    useEffect(() => {
        fetchMyOrders()
    }, [user]) // Refetch when user changes

    if (!user) {
        return (
            <div className='mt-16 pb-16 text-center'>
                <p className='text-xl'>Please login to view your orders</p>
                <button 
                    onClick={() => navigate('/login')}
                    className='mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-primary-dull transition'
                >
                    Login
                </button>
            </div>
        )
    }

    return (
        <div className='mt-16 pb-16'>
            <div className='flex flex-col items-end w-max mb-8'>
                <p className='text-2xl font-medium uppercase'>My orders</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {myOrders.length === 0 ? (
                <div className='text-center py-10'>
                    <p className='text-gray-500 text-lg'>You haven't placed any orders yet</p>
                    <button 
                        onClick={() => navigate('/products')}
                        className='mt-4 bg-primary text-white px-6 py-2 rounded hover:bg-primary-dull transition'
                    >
                        Browse Products
                    </button>
                </div>
            ) : (
                myOrders.map((order, index) => (
                    <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
                        <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
                            <span>OrderId : {order._id}</span>
                            <span>Payment : {order.paymentType}</span>
                            <span>Total Amount : {currency}{order.amount}</span>
                        </p>
                        {order.items.map((item, index) => (
                            <div key={index}
                                className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"
                                    } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>

                                <div className='flex items-center mb-4 md:mb-0'>
                                    <div className='bg-primary/10 p-4 rounded-lg'>
                                        <img src={item.product?.image?.[0] || ''} alt={item.product?.name} className='w-16 h-16' />
                                    </div>
                                    <div className='ml-4'>
                                        <h2 className='text-xl font-medium text-gray-800'>{item.product?.name}</h2>
                                        <p>Category: {item.product?.category}</p>
                                    </div>
                                </div>

                                <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                                    <p>Quantity: {item.quantity || "1"}</p>
                                    <p>Status: {order.status}</p>
                                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className='text-primary text-lg font-medium'>
                                    Amount: {currency}{item.product?.offerPrice * item.quantity || 0}
                                </p>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    )
}

export default MyOrders