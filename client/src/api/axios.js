import { INITIAL_USER, INITIAL_VEHICLES, INITIAL_SERVICES, INITIAL_MODS } from './mockData';

// Helper to initialize localStorage
const initStorage = () => {
  if (!localStorage.getItem('ev_vehicles')) localStorage.setItem('ev_vehicles', JSON.stringify(INITIAL_VEHICLES));
  if (!localStorage.getItem('ev_services')) localStorage.setItem('ev_services', JSON.stringify(INITIAL_SERVICES));
  if (!localStorage.getItem('ev_mods')) localStorage.setItem('ev_mods', JSON.stringify(INITIAL_MODS));
  if (!localStorage.getItem('ev_users')) localStorage.setItem('ev_users', JSON.stringify([INITIAL_USER]));
};

initStorage();

// Mock Axios implementation to bypass real network calls
const mockApi = {
  get: async (url) => {
    console.log(`[Mock GET] ${url}`);
    await new Promise(r => setTimeout(r, 400)); // Simulate network latency

    if (url.includes('/auth/me')) {
        const user = JSON.parse(localStorage.getItem('ev_curr_user')) || INITIAL_USER;
        return { data: { success: true, user } };
    }
    if (url.includes('/vehicles')) {
        const vehicles = JSON.parse(localStorage.getItem('ev_vehicles'));
        return { data: { success: true, data: vehicles } };
    }
    if (url.includes('/costs/summary')) {
        const services = JSON.parse(localStorage.getItem('ev_services'));
        const mods = JSON.parse(localStorage.getItem('ev_mods'));
        const totalServiceCost = services.reduce((sum, s) => sum + s.cost, 0);
        const totalModCost = mods.reduce((sum, m) => sum + m.cost, 0);
        return { data: { success: true, data: { totalServiceCost, totalModCost } } };
    }
    return { data: { success: true, data: [] } };
  },

  post: async (url, body) => {
    console.log(`[Mock POST] ${url}`, body);
    await new Promise(r => setTimeout(r, 600));

    if (url.includes('/auth/login') || url.includes('/auth/register')) {
        const user = { ...INITIAL_USER, ...body };
        localStorage.setItem('ev_curr_user', JSON.stringify(user));
        return { data: { success: true, token: 'mock-jwt-token', user } };
    }
    if (url.includes('/vehicles')) {
        const vehicles = JSON.parse(localStorage.getItem('ev_vehicles'));
        const newVehicle = { ...body, _id: Date.now().toString(), documents: body.documents || [] };
        vehicles.push(newVehicle);
        localStorage.setItem('ev_vehicles', JSON.stringify(vehicles));
        return { data: { success: true, data: newVehicle } };
    }
    return { data: { success: true } };
  },

  put: async (url, body) => {
      console.log(`[Mock PUT] ${url}`, body);
      await new Promise(r => setTimeout(r, 400));
      return { data: { success: true } };
  },

  delete: async (url) => {
    console.log(`[Mock DELETE] ${url}`);
    await new Promise(r => setTimeout(r, 400));
    if (url.includes('/vehicles/')) {
        const id = url.split('/').pop();
        let vehicles = JSON.parse(localStorage.getItem('ev_vehicles'));
        vehicles = vehicles.filter(v => v._id !== id);
        localStorage.setItem('ev_vehicles', JSON.stringify(vehicles));
    }
    return { data: { success: true } };
  }
};

export default mockApi;
