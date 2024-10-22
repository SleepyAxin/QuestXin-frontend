export default
{
    POST_auth_login: '/api/auth/jwt/login',
    POST_auth_logout: '/api/auth/jwt/logout',
    POST_auth_register: '/api/auth/register',
    POST_auth_forget_password: '/api/auth/forgot-password',

    POST_default_custom_register: '/api/custom_register',
    POST_default_modify_password: '/api/reset_password',
    POST_default_forget_password: '/api/forget_password',
    POST_default_send_verification_code: '/api/sent_verification_code',

    POST_quest_add: '/api/questionnaire/add',
    POST_quest_edit: '/api/questionnaire/modify_questionnaire',
    PATCH_quest_status: '/api/questionnaire/publish_questionnaire',
    GET_quest_list_by_user: '/api/questionnaire/user_questionnaires',
    GET_quest_list: '/api/questionnaire/get_questionnaire?questionnaire_id={id}',
    DELETE_quest_delete: '/api/questionnaire/delete_questionnaire?questionnaire_id={id}',
    POST_question_add: '/api/questionnaire/add_question',
    POST_question_edit: '/api/questionnaire/modify_question',
    DELETE_question_delete: '/api/questionnaire/delete_question?question_id={id}',
    GET_question_list: '/api/questionnaire/get_quest_list?questionnaire_id={id}',

    POST_answer_upload: '/api/answer/upload_answers_list',

    POST_result_get: '/api/result/get_result?questionnaire_id={id}',
    POST_result_excel: '/api/result/get_result_excel?questionnaire_id={id}'
}