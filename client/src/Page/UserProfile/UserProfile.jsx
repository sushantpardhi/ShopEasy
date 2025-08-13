import React, { useState, useEffect, useCallback } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    // User state management
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        profileImage: null,
        memberSince: '',
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0
    });

    // Component states
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
        newsletter: true
    });

    // Form validation errors
    const [errors, setErrors] = useState({});

    // Mock data initialization
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setUser({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                dateOfBirth: '1990-05-15',
                gender: 'male',
                profileImage: null,
                memberSince: '2022-03-15',
                totalOrders: 24,
                totalSpent: 2847.50,
                loyaltyPoints: 1250
            });

            setAddresses([
                {
                    id: 1,
                    type: 'home',
                    title: 'Explore Address',
                    firstName: 'John',
                    lastName: 'Doe',
                    street: '123 Main Street',
                    apartment: 'Apt 4B',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'United States',
                    isDefault: true
                },
                {
                    id: 2,
                    type: 'work',
                    title: 'Office Address',
                    firstName: 'John',
                    lastName: 'Doe',
                    street: '456 Business Avenue',
                    apartment: 'Suite 200',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10002',
                    country: 'United States',
                    isDefault: false
                }
            ]);

            setOrders([
                {
                    id: 'ORD-2024-001',
                    date: '2024-01-25',
                    status: 'delivered',
                    total: 129.99,
                    items: [
                        { name: 'Wireless Headphones', quantity: 1, price: 79.99 },
                        { name: 'Phone Case', quantity: 2, price: 25.00 }
                    ],
                    shippingAddress: '123 Main Street, New York, NY 10001',
                    trackingNumber: 'TRK123456789'
                },
                {
                    id: 'ORD-2024-002',
                    date: '2024-01-20',
                    status: 'shipped',
                    total: 89.50,
                    items: [
                        { name: 'Bluetooth Speaker', quantity: 1, price: 89.50 }
                    ],
                    shippingAddress: '456 Business Avenue, New York, NY 10002',
                    trackingNumber: 'TRK987654321'
                },
                {
                    id: 'ORD-2024-003',
                    date: '2024-01-15',
                    status: 'processing',
                    total: 199.99,
                    items: [
                        { name: 'Smart Watch', quantity: 1, price: 199.99 }
                    ],
                    shippingAddress: '123 Main Street, New York, NY 10001',
                    trackingNumber: null
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    // Form validation
    const validateProfileForm = useCallback(() => {
        const newErrors = {};

        if (!user.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!user.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!user.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!user.phone.trim()) newErrors.phone = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [user]);

    // Event handlers
    const handleProfileInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    const handleProfileImageUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setUser(prev => ({
                    ...prev,
                    profileImage: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleProfileSave = async () => {
        if (!validateProfileForm()) return;

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressDelete = (addressId) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        }
    };

    const handleNotificationToggle = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const getOrderStatusColor = (status) => {
        const colors = {
            delivered: '#10b981',
            shipped: '#3b82f6',
            processing: '#f59e0b',
            cancelled: '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    // Navigation Tab Component
    const NavigationTab = ({ tab, label, icon, badge }) => (
        <button
            className={`nav-tab ${activeTab === tab ? 'nav-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
        >
            <span className="nav-tab__icon">{icon}</span>
            <span className="nav-tab__label">{label}</span>
            {badge && <span className="nav-tab__badge">{badge}</span>}
        </button>
    );

    // Profile Statistics Component
    const ProfileStatistics = () => (
        <div className="profile-stats">
            <div className="stat-card">
                <div className="stat-card__icon">📦</div>
                <div className="stat-card__content">
                    <div className="stat-card__number">{user.totalOrders}</div>
                    <div className="stat-card__label">Total Orders</div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card__icon">💰</div>
                <div className="stat-card__content">
                    <div className="stat-card__number">${user.totalSpent.toFixed(2)}</div>
                    <div className="stat-card__label">Total Spent</div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card__icon">⭐</div>
                <div className="stat-card__content">
                    <div className="stat-card__number">{user.loyaltyPoints}</div>
                    <div className="stat-card__label">Loyalty Points</div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card__icon">📅</div>
                <div className="stat-card__content">
                    <div className="stat-card__number">
                        {new Date(user.memberSince).getFullYear()}
                    </div>
                    <div className="stat-card__label">Member Since</div>
                </div>
            </div>
        </div>
    );

    // Profile Information Section
    const ProfileInformationSection = () => (
        <div className="profile-info-section">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.profileImage ? (
                        <img src={user.profileImage} alt="Profile" className="profile-avatar__image" />
                    ) : (
                        <div className="profile-avatar__placeholder">
                            <span>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
                        </div>
                    )}
                    {isEditing && (
                        <label className="profile-avatar__upload" title="Upload new photo">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageUpload}
                                className="profile-avatar__input"
                            />
                            📷
                        </label>
                    )}
                </div>

                <div className="profile-details">
                    <h1 className="profile-details__name">{user.firstName} {user.lastName}</h1>
                    <p className="profile-details__email">{user.email}</p>
                    <p className="profile-details__member-since">
                        Member since {new Date(user.memberSince).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                    })}
                    </p>
                </div>

                <div className="profile-actions">
                    <button
                        className={`btn ${isEditing ? 'btn--secondary' : 'btn--primary'}`}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
                    </button>
                </div>
            </div>

            <ProfileStatistics />

            <div className="profile-form">
                <h3 className="profile-form__title">Personal Information</h3>

                <div className="form-grid">
                    <div className="form-field">
                        <label htmlFor="firstName" className="form-field__label">
                            First Name <span className="form-field__required">*</span>
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={user.firstName}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className={`form-field__input ${errors.firstName ? 'form-field__input--error' : ''}`}
                            placeholder="Enter your first name"
                        />
                        {errors.firstName && <span className="form-field__error">{errors.firstName}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="lastName" className="form-field__label">
                            Last Name <span className="form-field__required">*</span>
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className={`form-field__input ${errors.lastName ? 'form-field__input--error' : ''}`}
                            placeholder="Enter your last name"
                        />
                        {errors.lastName && <span className="form-field__error">{errors.lastName}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="email" className="form-field__label">
                            Email Address <span className="form-field__required">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className={`form-field__input ${errors.email ? 'form-field__input--error' : ''}`}
                            placeholder="Enter your email address"
                        />
                        {errors.email && <span className="form-field__error">{errors.email}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="phone" className="form-field__label">
                            Phone Number <span className="form-field__required">*</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={user.phone}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className={`form-field__input ${errors.phone ? 'form-field__input--error' : ''}`}
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && <span className="form-field__error">{errors.phone}</span>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="dateOfBirth" className="form-field__label">Date of Birth</label>
                        <input
                            id="dateOfBirth"
                            type="date"
                            name="dateOfBirth"
                            value={user.dateOfBirth}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="form-field__input"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="gender" className="form-field__label">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={user.gender}
                            onChange={handleProfileInputChange}
                            disabled={!isEditing}
                            className="form-field__select"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>
                </div>

                {isEditing && (
                    <div className="profile-form__actions">
                        <button
                            className="btn btn--success"
                            onClick={handleProfileSave}
                            disabled={loading}
                        >
                            {loading ? '⏳ Saving...' : '✅ Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Address Management Section
    const AddressManagementSection = () => (
        <div className="address-management-section">
            <div className="section-header">
                <div className="section-header__content">
                    <h3 className="section-header__title">Saved Addresses</h3>
                    <p className="section-header__subtitle">Manage your delivery addresses</p>
                </div>
                <button
                    className="btn btn--success btn--add-address"
                    onClick={() => setShowAddressModal(true)}
                >
                    ➕ Add New Address
                </button>
            </div>

            <div className="address-grid">
                {addresses.map(address => (
                    <div key={address.id} className="address-card">
                        <div className="address-card__header">
                            <div className="address-card__title">
                <span className={`address-card__icon address-card__icon--${address.type}`}>
                  {address.type === 'home' ? '🏠' : '🏢'}
                </span>
                                <h4 className="address-card__name">{address.title}</h4>
                            </div>
                            {address.isDefault && (
                                <span className="address-card__badge">Default</span>
                            )}
                        </div>

                        <div className="address-card__details">
                            <p className="address-card__recipient">
                                {address.firstName} {address.lastName}
                            </p>
                            <p className="address-card__line">{address.street}</p>
                            {address.apartment && (
                                <p className="address-card__line">{address.apartment}</p>
                            )}
                            <p className="address-card__line">
                                {address.city}, {address.state} {address.zipCode}
                            </p>
                            <p className="address-card__country">{address.country}</p>
                        </div>

                        <div className="address-card__actions">
                            <button
                                className="btn btn--small btn--primary"
                                onClick={() => setEditingAddress(address)}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="btn btn--small btn--danger"
                                onClick={() => handleAddressDelete(address.id)}
                            >
                                🗑️ Delete
                            </button>
                            {!address.isDefault && (
                                <button className="btn btn--small btn--warning">
                                    📍 Set Default
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Order History Section
    const OrderHistorySection = () => (
        <div className="order-history-section">
            <div className="section-header">
                <div className="section-header__content">
                    <h3 className="section-header__title">Order History</h3>
                    <p className="section-header__subtitle">Track and manage your orders</p>
                </div>
            </div>

            <div className="orders-list">
                {orders.map(order => (
                    <div key={order.id} className="order-card">
                        <div className="order-card__header">
                            <div className="order-card__info">
                                <h4 className="order-card__id">{order.id}</h4>
                                <p className="order-card__date">
                                    Ordered on {new Date(order.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                </p>
                            </div>
                            <div className="order-card__status-wrapper">
                <span
                    className={`order-card__status order-card__status--${order.status}`}
                    style={{ backgroundColor: getOrderStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                            </div>
                        </div>

                        <div className="order-card__content">
                            <div className="order-card__items">
                                <h5 className="order-card__items-title">Items ({order.items.length})</h5>
                                {order.items.map((item, index) => (
                                    <div key={index} className="order-item">
                                        <span className="order-item__name">{item.name}</span>
                                        <span className="order-item__details">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-card__summary">
                                <div className="order-summary__row">
                                    <span>Total Amount:</span>
                                    <strong>${order.total.toFixed(2)}</strong>
                                </div>
                                {order.trackingNumber && (
                                    <div className="order-summary__row">
                                        <span>Tracking:</span>
                                        <span className="order-summary__tracking">{order.trackingNumber}</span>
                                    </div>
                                )}
                                <div className="order-summary__row">
                                    <span>Shipping to:</span>
                                    <span className="order-summary__address">{order.shippingAddress}</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-card__actions">
                            <button className="btn btn--primary">View Details</button>
                            {order.status === 'delivered' && (
                                <button className="btn btn--secondary">Reorder</button>
                            )}
                            {order.trackingNumber && (
                                <button className="btn btn--secondary">Track Package</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Account Settings Section
    const AccountSettingsSection = () => (
        <div className="account-settings-section">
            <div className="section-header">
                <div className="section-header__content">
                    <h3 className="section-header__title">Account Settings</h3>
                    <p className="section-header__subtitle">Manage your preferences and security</p>
                </div>
            </div>

            <div className="settings-grid">
                <div className="settings-card">
                    <h4 className="settings-card__title">🔔 Notification Preferences</h4>
                    <div className="notification-settings">
                        {Object.entries(notifications).map(([key, value]) => (
                            <label key={key} className="notification-option">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handleNotificationToggle(key)}
                                    className="notification-option__input"
                                />
                                <span className="notification-option__checkbox"></span>
                                <span className="notification-option__label">
                  {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="settings-card">
                    <h4 className="settings-card__title">🔒 Security Settings</h4>
                    <div className="security-settings">
                        <button className="btn btn--full-width btn--primary">Change Password</button>
                        <button className="btn btn--full-width btn--primary">Enable Two-Factor Authentication</button>
                        <button className="btn btn--full-width btn--primary">Download My Data</button>
                    </div>
                </div>

                <div className="settings-card settings-card--danger">
                    <h4 className="settings-card__title">⚠️ Danger Zone</h4>
                    <div className="danger-settings">
                        <button className="btn btn--full-width btn--danger">Deactivate Account</button>
                        <button className="btn btn--full-width btn--danger">Delete Account</button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Loading Screen
    if (loading && activeTab === 'profile') {
        return (
            <div className="user-profile">
                <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="user-profile">
            <div className="user-profile__container">
                {/* Navigation Sidebar */}
                <nav className="navigation-sidebar">
                    <div className="navigation-sidebar__header">
                        <h2 className="navigation-sidebar__title">My Account</h2>
                    </div>

                    <div className="navigation-sidebar__menu">
                        <NavigationTab
                            tab="profile"
                            label="Profile"
                            icon="👤"
                        />
                        <NavigationTab
                            tab="addresses"
                            label="Addresses"
                            icon="📍"
                            badge={addresses.length}
                        />
                        <NavigationTab
                            tab="orders"
                            label="Orders"
                            icon="📦"
                            badge={orders.length}
                        />
                        <NavigationTab
                            tab="settings"
                            label="Settings"
                            icon="⚙️"
                        />
                    </div>

                    <div className="navigation-sidebar__footer">
                        <button className="btn btn--danger btn--logout">
                            🚪 Logout
                        </button>
                    </div>
                </nav>

                {/* Main Content Area */}
                <main className="main-content">
                    {activeTab === 'profile' && <ProfileInformationSection />}
                    {activeTab === 'addresses' && <AddressManagementSection />}
                    {activeTab === 'orders' && <OrderHistorySection />}
                    {activeTab === 'settings' && <AccountSettingsSection />}
                </main>
            </div>
        </div>
    );
};

export default UserProfile;
