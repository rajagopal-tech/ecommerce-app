const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./backend/models/User');

const testAdminRole = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

        // 1. Register a test user
        const testEmail = `test${Date.now()}@example.com`;
        const regRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test Admin',
            email: testEmail,
            password: 'password123'
        });

        // 2. Login to get token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: testEmail,
            password: 'password123'
        });
        const token = loginRes.data.token;

        let success = true;

        // 3. Try to create product as normal user (should fail)
        try {
            await axios.post('http://localhost:5000/api/products', {
                name: "Test Admin Product",
                price: 100,
                description: "Testing admin",
                category: "Test",
                stock: 10
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("❌ ERROR: User was able to create product!");
            success = false;
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log("✅ SUCCESS: Regular user blocked with 401 -", err.response.data.message);
            } else {
                console.log("❌ ERROR: Unexpected error blocking user", err.response?.data);
                success = false;
            }
        }

        // 4. Elevate user to admin in DB
        await User.findOneAndUpdate({ email: testEmail }, { role: 'admin' });
        console.log("Elevated user to admin...");

        // 5. Try to create product as admin (should succeed)
        try {
            const prodRes = await axios.post('http://localhost:5000/api/products', {
                name: "Test Admin Product",
                price: 100,
                description: "Testing admin",
                category: "Test",
                stock: 10
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅ SUCCESS: Admin user successfully created product! Status:", prodRes.status);
        } catch (err) {
            console.log("❌ ERROR: Admin user blocked:", err.response?.data);
            success = false;
        }

        if (success) {
            console.log("\n🚀 ADMIN ROLE VERIFICATION PASSED PERFECTLY!");
        } else {
            console.log("\n⚠️ ADMIN ROLE VERIFICATION FAILED!");
        }

        process.exit(0);
    } catch (e) {
        console.error("Test framework error:", e.response?.data || e.message);
        process.exit(1);
    }
};

testAdminRole();
