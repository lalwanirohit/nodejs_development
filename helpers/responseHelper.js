export const generateSuccessResponse = (success, message, data) => {
    return {
        success: success,
        message: message,
        data: data
    };
}

export const generateFailureResponse = (message = "Something went wrong, try again!") => {
    return {
        success: false,
        message: message
    }
}