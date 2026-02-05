const axios = require('axios');

async function fetchData(url) {
  const state = {
    data: [],
    isLoading: true,
    error: null,
  };

  try {
    const response = await axios.get(url);
    state.data = response.data;
    state.isLoading = false;
    return state;
  } catch (err) {
    state.error = err;
    state.isLoading = false;
    return state;
  }
}

module.exports = {
  fetchData,
};

