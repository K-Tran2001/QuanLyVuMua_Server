const Bill = require("../models/billModel");
const mongoose = require("mongoose");

module.exports.GetRevenue12Month = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const defaultFromDate = new Date(currentYear, 0, 1); // 1st Jan of current year
        const defaultToDate = new Date(currentYear, 11, 31, 23, 59, 59); // 31st Dec of current year

        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : defaultFromDate;
        const toDate = req.query.toDate ? new Date(req.query.toDate) : defaultToDate;

        const revenueData = await Bill.aggregate([
            {
                $match: {
                    createdAt: { $gte: fromDate, $lte: toDate },
                    isConfirm: true, // Chỉ lấy hóa đơn đã xác nhận
                    type: "sales-invoices" // Chỉ lấy hóa đơn bán hàng
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalRevenue: { $sum: "$totalActual" }
                }
            },
            {
                $sort: { "_id": 1 }
            }
        ]);

        // Chuẩn hóa dữ liệu để đảm bảo đủ 12 tháng
        const monthlyRevenue = Array(12).fill(0);
        let sumOfTotal = 0;
        revenueData.forEach(item => {
            monthlyRevenue[item._id - 1] = item.totalRevenue;
            sumOfTotal += item.totalRevenue;
        });

        res.json({ success: true, data: {
            monthlyRevenue, sumOfTotal
        } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.GetBillDataWithAllType = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const defaultFromDate = new Date(currentYear, 0, 1); // 1st Jan of current year
        const defaultToDate = new Date(currentYear, 11, 31, 23, 59, 59); // 31st Dec of current year

        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : defaultFromDate;
        const toDate = req.query.toDate ? new Date(req.query.toDate) : defaultToDate;
        const gardenId = req.query.gardenId ? new mongoose.Types.ObjectId(req.query.gardenId) : null;

        const matchCondition = {
            createdAt: { $gte: fromDate, $lte: toDate },
            isConfirm: true,
        };

        if (gardenId) {
            matchCondition.gardenId = gardenId;
        }

        const revenueData = await Bill.aggregate([
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: { type: "$type", month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$totalActual" }
                }
            },
            {
                $sort: { "_id.month": 1 }
            }
        ]);

        // Chuẩn hóa dữ liệu cho cả hai loại hóa đơn
        const salesRevenue = Array(12).fill(0);
        const purchaseRevenue = Array(12).fill(0);
        let sumSalesTotal = 0;
        let sumPurchaseTotal = 0;

        revenueData.forEach(item => {
            if (item._id.type === "sales-invoices") {
                salesRevenue[item._id.month - 1] = item.totalRevenue;
                sumSalesTotal += item.totalRevenue;
            } else if (item._id.type === "purchase-invoices") {
                purchaseRevenue[item._id.month - 1] = item.totalRevenue;
                sumPurchaseTotal += item.totalRevenue;
            }
        });

        res.json({
            success: true,
            data:{
                salesData: salesRevenue,
                purchaseData: purchaseRevenue,
                sumSalesTotal,
                sumPurchaseTotal
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports.GetPendingBills = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const defaultFromDate = new Date(currentYear, 0, 1);
        const defaultToDate = new Date(currentYear, 11, 31, 23, 59, 59);

        const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : defaultFromDate;
        const toDate = req.query.toDate ? new Date(req.query.toDate) : defaultToDate;
        const gardenId = req.query.gardenId ? new mongoose.Types.ObjectId(req.query.gardenId) : null;

        const matchCondition = {
            createdAt: { $gte: fromDate, $lte: toDate },
            isConfirm: false
        };

        if (gardenId) {
            matchCondition.gardenId = gardenId;
        }

        const pendingSalesBills = await Bill.find({ ...matchCondition, type: "sales-invoices" })
            .sort({ createdAt: -1 })
            .limit(10);
        
        const pendingPurchaseBills = await Bill.find({ ...matchCondition, type: "purchase-invoices" })
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({ success: true, data:{
            pendingSalesBills, 
            pendingPurchaseBills
        } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


