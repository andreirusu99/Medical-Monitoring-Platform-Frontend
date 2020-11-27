/**
 * @fileoverview gRPC-Web generated client stub for com.andrei.ds
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.com = {};
proto.com.andrei = {};
proto.com.andrei.ds = require('./PillBox_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.com.andrei.ds.PillBoxServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.com.andrei.ds.PillBoxServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.com.andrei.ds.MedicationTakenRequest,
 *   !proto.com.andrei.ds.MedicationTakenResponse>}
 */
const methodDescriptor_PillBoxService_registerMedsTaken = new grpc.web.MethodDescriptor(
  '/com.andrei.ds.PillBoxService/registerMedsTaken',
  grpc.web.MethodType.UNARY,
  proto.com.andrei.ds.MedicationTakenRequest,
  proto.com.andrei.ds.MedicationTakenResponse,
  /**
   * @param {!proto.com.andrei.ds.MedicationTakenRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.andrei.ds.MedicationTakenResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.com.andrei.ds.MedicationTakenRequest,
 *   !proto.com.andrei.ds.MedicationTakenResponse>}
 */
const methodInfo_PillBoxService_registerMedsTaken = new grpc.web.AbstractClientBase.MethodInfo(
  proto.com.andrei.ds.MedicationTakenResponse,
  /**
   * @param {!proto.com.andrei.ds.MedicationTakenRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.andrei.ds.MedicationTakenResponse.deserializeBinary
);


/**
 * @param {!proto.com.andrei.ds.MedicationTakenRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.com.andrei.ds.MedicationTakenResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.com.andrei.ds.MedicationTakenResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.com.andrei.ds.PillBoxServiceClient.prototype.registerMedsTaken =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/com.andrei.ds.PillBoxService/registerMedsTaken',
      request,
      metadata || {},
      methodDescriptor_PillBoxService_registerMedsTaken,
      callback);
};


/**
 * @param {!proto.com.andrei.ds.MedicationTakenRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.com.andrei.ds.MedicationTakenResponse>}
 *     Promise that resolves to the response
 */
proto.com.andrei.ds.PillBoxServicePromiseClient.prototype.registerMedsTaken =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/com.andrei.ds.PillBoxService/registerMedsTaken',
      request,
      metadata || {},
      methodDescriptor_PillBoxService_registerMedsTaken);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.com.andrei.ds.MedicationNotTakenRequest,
 *   !proto.com.andrei.ds.MedicationNotTakenResponse>}
 */
const methodDescriptor_PillBoxService_registerMedsNotTaken = new grpc.web.MethodDescriptor(
  '/com.andrei.ds.PillBoxService/registerMedsNotTaken',
  grpc.web.MethodType.UNARY,
  proto.com.andrei.ds.MedicationNotTakenRequest,
  proto.com.andrei.ds.MedicationNotTakenResponse,
  /**
   * @param {!proto.com.andrei.ds.MedicationNotTakenRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.andrei.ds.MedicationNotTakenResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.com.andrei.ds.MedicationNotTakenRequest,
 *   !proto.com.andrei.ds.MedicationNotTakenResponse>}
 */
const methodInfo_PillBoxService_registerMedsNotTaken = new grpc.web.AbstractClientBase.MethodInfo(
  proto.com.andrei.ds.MedicationNotTakenResponse,
  /**
   * @param {!proto.com.andrei.ds.MedicationNotTakenRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.andrei.ds.MedicationNotTakenResponse.deserializeBinary
);


/**
 * @param {!proto.com.andrei.ds.MedicationNotTakenRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.com.andrei.ds.MedicationNotTakenResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.com.andrei.ds.MedicationNotTakenResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.com.andrei.ds.PillBoxServiceClient.prototype.registerMedsNotTaken =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/com.andrei.ds.PillBoxService/registerMedsNotTaken',
      request,
      metadata || {},
      methodDescriptor_PillBoxService_registerMedsNotTaken,
      callback);
};


/**
 * @param {!proto.com.andrei.ds.MedicationNotTakenRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.com.andrei.ds.MedicationNotTakenResponse>}
 *     Promise that resolves to the response
 */
proto.com.andrei.ds.PillBoxServicePromiseClient.prototype.registerMedsNotTaken =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/com.andrei.ds.PillBoxService/registerMedsNotTaken',
      request,
      metadata || {},
      methodDescriptor_PillBoxService_registerMedsNotTaken);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.com.andrei.ds.MedicationPlanRequest,
 *   !proto.com.andrei.ds.MedicationPlanResponse>}
 */
const methodDescriptor_PillBoxService_downloadMedicationPlan = new grpc.web.MethodDescriptor(
  '/com.andrei.ds.PillBoxService/downloadMedicationPlan',
  grpc.web.MethodType.UNARY,
  proto.com.andrei.ds.MedicationPlanRequest,
  proto.com.andrei.ds.MedicationPlanResponse,
  /**
   * @param {!proto.com.andrei.ds.MedicationPlanRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.andrei.ds.MedicationPlanResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.com.andrei.ds.MedicationPlanRequest,
 *   !proto.com.andrei.ds.MedicationPlanResponse>}
 */
const methodInfo_PillBoxService_downloadMedicationPlan = new grpc.web.AbstractClientBase.MethodInfo(
  proto.com.andrei.ds.MedicationPlanResponse,
  /**
   * @param {!proto.com.andrei.ds.MedicationPlanRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.com.andrei.ds.MedicationPlanResponse.deserializeBinary
);


/**
 * @param {!proto.com.andrei.ds.MedicationPlanRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.com.andrei.ds.MedicationPlanResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.com.andrei.ds.MedicationPlanResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.com.andrei.ds.PillBoxServiceClient.prototype.downloadMedicationPlan =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/com.andrei.ds.PillBoxService/downloadMedicationPlan',
      request,
      metadata || {},
      methodDescriptor_PillBoxService_downloadMedicationPlan,
      callback);
};


/**
 * @param {!proto.com.andrei.ds.MedicationPlanRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.com.andrei.ds.MedicationPlanResponse>}
 *     Promise that resolves to the response
 */
proto.com.andrei.ds.PillBoxServicePromiseClient.prototype.downloadMedicationPlan =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/com.andrei.ds.PillBoxService/downloadMedicationPlan',
      request,
      metadata || {},
      methodDescriptor_PillBoxService_downloadMedicationPlan);
};


module.exports = proto.com.andrei.ds;

