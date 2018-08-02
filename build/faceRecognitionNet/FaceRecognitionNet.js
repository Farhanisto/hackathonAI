"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var tf = require("@tensorflow/tfjs-core");
var NeuralNetwork_1 = require("../commons/NeuralNetwork");
var toNetInput_1 = require("../toNetInput");
var convLayer_1 = require("./convLayer");
var extractParams_1 = require("./extractParams");
var loadQuantizedParams_1 = require("./loadQuantizedParams");
var normalize_1 = require("./normalize");
var residualLayer_1 = require("./residualLayer");
var FaceRecognitionNet = /** @class */ (function (_super) {
    tslib_1.__extends(FaceRecognitionNet, _super);
    function FaceRecognitionNet() {
        return _super.call(this, 'FaceRecognitionNet') || this;
    }
    FaceRecognitionNet.prototype.forwardInput = function (input) {
        var params = this.params;
        if (!params) {
            throw new Error('FaceRecognitionNet - load model before inference');
        }
        return tf.tidy(function () {
            var batchTensor = input.toBatchTensor(150, true);
            var normalized = normalize_1.normalize(batchTensor);
            var out = convLayer_1.convDown(normalized, params.conv32_down);
            out = tf.maxPool(out, 3, 2, 'valid');
            out = residualLayer_1.residual(out, params.conv32_1);
            out = residualLayer_1.residual(out, params.conv32_2);
            out = residualLayer_1.residual(out, params.conv32_3);
            out = residualLayer_1.residualDown(out, params.conv64_down);
            out = residualLayer_1.residual(out, params.conv64_1);
            out = residualLayer_1.residual(out, params.conv64_2);
            out = residualLayer_1.residual(out, params.conv64_3);
            out = residualLayer_1.residualDown(out, params.conv128_down);
            out = residualLayer_1.residual(out, params.conv128_1);
            out = residualLayer_1.residual(out, params.conv128_2);
            out = residualLayer_1.residualDown(out, params.conv256_down);
            out = residualLayer_1.residual(out, params.conv256_1);
            out = residualLayer_1.residual(out, params.conv256_2);
            out = residualLayer_1.residualDown(out, params.conv256_down_out);
            var globalAvg = out.mean([1, 2]);
            var fullyConnected = tf.matMul(globalAvg, params.fc);
            return fullyConnected;
        });
    };
    FaceRecognitionNet.prototype.forward = function (input) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.forwardInput;
                        return [4 /*yield*/, toNetInput_1.toNetInput(input, true)];
                    case 1: return [2 /*return*/, _a.apply(this, [_b.sent()])];
                }
            });
        });
    };
    FaceRecognitionNet.prototype.computeFaceDescriptor = function (input) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var netInput, faceDescriptorTensors, faceDescriptorsForBatch;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, toNetInput_1.toNetInput(input, true)];
                    case 1:
                        netInput = _a.sent();
                        faceDescriptorTensors = tf.tidy(function () { return tf.unstack(_this.forwardInput(netInput)); });
                        return [4 /*yield*/, Promise.all(faceDescriptorTensors.map(function (t) { return t.data(); }))];
                    case 2:
                        faceDescriptorsForBatch = _a.sent();
                        faceDescriptorTensors.forEach(function (t) { return t.dispose(); });
                        return [2 /*return*/, netInput.isBatchInput
                                ? faceDescriptorsForBatch
                                : faceDescriptorsForBatch[0]];
                }
            });
        });
    };
    FaceRecognitionNet.prototype.loadQuantizedParams = function (uri) {
        return loadQuantizedParams_1.loadQuantizedParams(uri);
    };
    FaceRecognitionNet.prototype.extractParams = function (weights) {
        return extractParams_1.extractParams(weights);
    };
    return FaceRecognitionNet;
}(NeuralNetwork_1.NeuralNetwork));
exports.FaceRecognitionNet = FaceRecognitionNet;
//# sourceMappingURL=FaceRecognitionNet.js.map