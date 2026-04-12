// EliteTrack - Premium Showroom Seed Data
export const INITIAL_USER = {
    id: 'mock-user-1',
    name: 'Panduka Wijekoon',
    email: 'admin@elitetrack.io',
    role: 'Commander'
};

export const INITIAL_VEHICLES = [
    {
        _id: 'v1',
        make: 'Nissan',
        model: 'GT-R R35',
        year: 2021,
        registrationNumber: 'EX-9999',
        mileage: 18500,
        fuelType: '98 Octane',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
        lastServiceMileage: 15000,
        serviceInterval: 10000,
        averageMonthlyMileage: 800,
        serviceReminderSent: false,
        documentRemindersSent: false,
        documents: [
            { type: 'Insurance', expiryDate: '2026-12-31' },
            { type: 'Revenue License', expiryDate: '2026-10-15' }
        ]
    },
    {
        _id: 'v2',
        make: 'Toyota',
        model: 'Supra MK5',
        year: 2023,
        registrationNumber: 'SZ-1001',
        mileage: 4200,
        fuelType: 'Premium',
        image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200',
        lastServiceMileage: 1000,
        serviceInterval: 8000,
        averageMonthlyMileage: 500,
        serviceReminderSent: false,
        documentRemindersSent: false,
        documents: [
            { type: 'Insurance', expiryDate: '2027-01-20' }
        ]
    }
];

export const INITIAL_SERVICES = [
    { _id: 's1', vehicleId: 'v1', date: '2025-01-15', description: 'Major Engine Oil & Filter Change', cost: 45000, mileage: 14800, type: 'Maintenance' },
    { _id: 's2', vehicleId: 'v1', date: '2025-02-10', description: 'Performance Brake Pad Replacement', cost: 85000, mileage: 16200, type: 'Maintenance' }
];

export const INITIAL_MODS = [
    { _id: 'm1', vehicleId: 'v1', date: '2025-03-01', description: 'Stage 2 ECU Remap + Downpipes', cost: 350000, category: 'Performance', image: '' },
    { _id: 'm2', vehicleId: 'v1', date: '2025-03-15', description: 'HKS Full Exhaust System', cost: 720000, category: 'Performance', image: '' }
];
