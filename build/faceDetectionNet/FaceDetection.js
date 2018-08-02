"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rect_1 = require("../Rect");
var FaceDetection = /** @class */ (function () {
    function FaceDetection(score, relativeBox, imageDims) {
        var width = imageDims.width, height = imageDims.height;
        this._imageWidth = width;
        this._imageHeight = height;
        this._score = score;
        this._box = new Rect_1.Rect(relativeBox.x * width, relativeBox.y * height, relativeBox.width * width, relativeBox.height * height);
    }
    FaceDetection.prototype.getScore = function () {
        return this._score;
    };
    FaceDetection.prototype.getBox = function () {
        return this._box;
    };
    FaceDetection.prototype.getImageWidth = function () {
        return this._imageWidth;
    };
    FaceDetection.prototype.getImageHeight = function () {
        return this._imageHeight;
    };
    FaceDetection.prototype.getRelativeBox = function () {
        return new Rect_1.Rect(this._box.x / this._imageWidth, this._box.y / this._imageHeight, this._box.width / this._imageWidth, this._box.height / this._imageHeight);
    };
    FaceDetection.prototype.forSize = function (width, height) {
        return new FaceDetection(this._score, this.getRelativeBox(), { width: width, height: height });
    };
    return FaceDetection;
}());
exports.FaceDetection = FaceDetection;
//# sourceMappingURL=FaceDetection.js.map