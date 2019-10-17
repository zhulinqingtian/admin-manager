'use strict'
// 错误提示
function buildResponse (code, message, data) {
  return {
    status: code,
    msg: message,
    data: data
  }
}
function buildErrorResponse (code, message) {
  return buildResponse(code, message)
}

function _ERR (_code, _message) {
  const error = buildErrorResponse(_code, _message)
  return function (_message) {
    return _message ? buildErrorResponse(_code, _message) : error
  }
}
exports.error = buildErrorResponse
exports.unknownError = _ERR('ERR_UNKNOWN', '未知错误！')
exports.internalServerError = _ERR('ERR_INTERNAL_SERVER', '服务器内部错误！')
exports.loadError = _ERR('ERR_LOAD_FAILED', '加载失败！')
exports.createError = _ERR('ERR_CREATE_FAILED', '创建失败！')
exports.addError = _ERR('ERR_ADD_FAILED', '添加失败！')
exports.updateError = _ERR('ERR_UPDATE_FAILED', '更新失败！')
exports.deleteError = _ERR('ERR_DELETE_FAILED', '删除失败！')
exports.authError = _ERR('ERR_UNAUTHORIZED', '未被授权的操作！')
exports.sessionTimeoutError = _ERR('ERR_SESSION_TIMEOUT', '未登陆或登陆状态已失效！')
exports.notFoundError = _ERR('ERR_NOT_FOUND', '未查找到记录！')
exports.fileParseError = _ERR('ERR_FILE_PARSE', '上传文件解析异常，请检查文件重新上传！')
exports.fileTypeError = _ERR('ERR_FILE_TYPE', '上传文件格式不支持，请检查文件重新上传！')
exports.fileEmptyError = _ERR('ERR_FILE_EMPTY', '上传文件不存在，请重新上传！')
exports.sendError = _ERR('ERR_SEND', '发送失败！')
exports.notEnoughBalanceError = _ERR('ERR_NOT_ENOUGH_BALANCE', '余额不足！')
exports.dataFormatError = _ERR('ERR_DATA_FORMAT', '数据格式错误！')
exports.regError = _ERR('ERR_REG_FAILED', '注册失败！')
exports.loginError = _ERR('ERR_LOGIN_FAILED', '登陆失败！')
exports.stateError = _ERR('STATE_ERROR', '状态异常！')
exports.sysMaintainingError = _ERR('SYS_MAINTAINING_ERROR', '系统维护中！')
exports.orderExpireError = _ERR('ORDER_EXPIRE_ERROR', '订购已过期！')
exports.ordeNoError = _ERR('ORDER_NO_ERROR', '尚未订购软件！')

function buildOkResponse (message, data) {
  return buildResponse(200, message, data)
}
function buildDataResponse (data) {
  return buildResponse(200, undefined, data)
}

exports.ok = buildOkResponse
exports.data = buildDataResponse
