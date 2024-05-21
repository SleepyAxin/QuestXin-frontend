import { createStore } from 'vuex'

export default createStore
(
    {
        state:
            {
                user_info: null
            },
        mutations:
            {
                setUserInfo(state, info)
                {
                    state.user_info = info;
                }
            },
        actions:
            {
                updateUserInfo({ commit }, info)
                {
                    commit('setUserInfo', info);
                }
            },
        getters:
            {
                getUserInfo(state)
                {
                    return state.user_info;
                }
            },
        modules: {}
    }
)
