export default
{
    POST_auth_login: '/api/auth/jwt/login',
    POST_auth_logout: '/api/auth/jwt/logout',
    POST_auth_register: '/api/auth/register',
    POST_auth_forget_password: '/api/auth/forgot-password',

    POST_quest_add: '/api/questionnaire/add',
    POST_quest_edit: '/api/questionnaire/modify_questionnaire',
    GET_quest_list: '/api/questionnaire/user_questionnaires',
    DELETE_quest_delete: '/api/questionnaire/delete_questionnaire?questionnaire_id={id}',

    POST_question_add: '/api/questionnaire/add_question',
    POST_question_edit: '/api/questionnaire/modify_question',
    DELETE_question_delete: '/api/questionnaire/delete_question?question_id={id}',
    GET_question_list: '/api/questionnaire/get_quest_list?questionnaire_id={id}',
}