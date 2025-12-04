import api from "./api";

// ⭐ Named export (TrainForm.jsx expects this)
export const searchTrains = async (params) => {
  try {
    const res = await api.get("/transport/trains", { params });
    return res.data;
  } catch (error) {
    console.error("Train API Error:", error);
    return { success: false, trains: [] };
  }
};

// Object export (optional)
export const transportAPI = {
  searchTrains,
};
