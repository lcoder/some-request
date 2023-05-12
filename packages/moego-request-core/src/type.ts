
/** 响应中包含的数据类型 */
export enum ResponseType {
  Default = '',
  /** 二进制数据的 JavaScript ArrayBuffer */
  Arraybuffer = 'arraybuffer',
  /** 二进制数据的 Blob 对象 */
  Blob = 'blob',
  /**  HTML Document 或 XML XMLDocument文档，根据接收到的数据的 MIME 类型而定 */
  Document = 'document',
  /** JSON对象 */
  Json = 'json',
  /** utf-16字符串 */
  Text = 'text',
}

/** http请求方法 */
export enum Method {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  TRACE = 'TRACE',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
}
