const dialTask = {
  state: {
    rowInfo: {},
    taskId: '',
    campaignId: '',
    customerId: '',
    isBlacklist: '',
    customerPhone: '',
    taskIds: [],
    campaignIds: [],
    customerIds: [],
    isBlacklists: []
  },
  mutations: {
    SET_ROWINFO: (state, rowInfo) => {
      state.rowInfo = rowInfo
    },
    SET_RADIO: (state, radio) => {
      state.radio = radio
    },
    SET_DETAIL: (state, arr) => {
      state.taskId = arr[0] // taskId
      state.campaignId = arr[1]// campaignId
      state.customerId = arr[2]// customerId
      state.isBlacklist = arr[3]// isBlacklist
      state.customerPhone = arr[4]// customerPhone
    },
    SET_DETAILS: (state, arr2) => {
      state.taskIds = arr2[0] // taskIds
      state.campaignIds = arr2[1]// campaignIds
      state.isBlacklists = arr2[2]// isBlacklists
      state.customerIds = arr2[3]// customerIds
    }
  },
  actions: {
    setReq({ commit }, req) {
      commit('SET_REQ', req)
    },
    setRowInfo({ commit }, rowInfo) {
      commit('SET_ROWINFO', rowInfo)
    },
    setRadio({ commit }, radio) {
      commit('SET_RADIO', radio)
    },
    setDetail({ commit }, arr) {
      commit('SET_DETAIL', arr)
    },
    setDetails({ commit }, arr2) {
      commit('SET_DETAILS', arr2)
    }
  }
}

export default dialTask
