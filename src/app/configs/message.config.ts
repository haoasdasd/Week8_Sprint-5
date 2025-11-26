export const MESSAGES_POST = {
    GET_ALL_ACTIVE_CLINIC_CATALOGS: 'Get all active clinic catalogs',
    GET_ALL_ACTIVE_SPECIALTY_CATALOGS: 'Get all active specialty catalogs'
}

export const MESSAGE_ERROR: Record<string, string> = {
    AN_UNEXPECTED_ERROR_OCCURRED: 'An unexpected error occurred.',
    INTERCEPTOR_NOT_FOUND_KEY: 'Error: key not found in metadataCommand',
    INVALID_FILE_TYPE: 'Only .png, .jpg, and .jpeg files are allowed',
    FILE_SIZE_LIMIT_EXCEEDED: 'File size must be less than 2MB',
    ERROR_GRPC: 'Error calling gRPC:',
    ERROR_PARSING_USER_PROFILE: 'Error parsing the user profile:'
}

export const MESSAGES = {
    REGISTER_SUCCESS: 'Đăng ký tài khoản thành công',
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    UPDATE_USER_INFORMATION_SUCCESS: 'Cập nhật thông tin thành công',
    CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công'
}
