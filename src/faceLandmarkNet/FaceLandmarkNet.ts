import * as tf from '@tensorflow/tfjs-core';

import { convLayer } from '../commons/convLayer';
import { NeuralNetwork } from '../commons/NeuralNetwork';
import { ConvParams } from '../commons/types';
import { NetInput } from '../NetInput';
import { Point } from '../Point';
import { toNetInput } from '../toNetInput';
import { TNetInput } from '../types';
import { isEven } from '../utils';
import { extractParams } from './extractParams';
import { FaceLandmarks68 } from './FaceLandmarks68';
import { fullyConnectedLayer } from './fullyConnectedLayer';
import { loadQuantizedParams } from './loadQuantizedParams';
import { NetParams } from './types';

function conv(x: tf.Tensor4D, params: ConvParams): tf.Tensor4D {
  return convLayer(x, params, 'valid', true)
}

function maxPool(x: tf.Tensor4D, strides: [number, number] = [2, 2]): tf.Tensor4D {
  return tf.maxPool(x, [2, 2], strides, 'valid')
}

export class FaceLandmarkNet extends NeuralNetwork<NetParams> {

  constructor() {
    super('FaceLandmarkNet')
  }

  public forwardInput(input: NetInput): tf.Tensor2D {

    const { params } = this

    if (!params) {
      throw new Error('FaceLandmarkNet - load model before inference')
    }

    return tf.tidy(() => {
      const batchTensor = input.toBatchTensor(128, true)

      let out = conv(batchTensor, params.conv0)
      out = maxPool(out)
      out = conv(out, params.conv1)
      out = conv(out, params.conv2)
      out = maxPool(out)
      out = conv(out, params.conv3)
      out = conv(out, params.conv4)
      out = maxPool(out)
      out = conv(out, params.conv5)
      out = conv(out, params.conv6)
      out = maxPool(out, [1, 1])
      out = conv(out, params.conv7)
      const fc0 = tf.relu(fullyConnectedLayer(out.as2D(out.shape[0], -1), params.fc0))
      const fc1 = fullyConnectedLayer(fc0, params.fc1)

      const createInterleavedTensor = (fillX: number, fillY: number) =>
        tf.stack([
          tf.fill([68], fillX),
          tf.fill([68], fillY)
        ], 1).as2D(1, 136).as1D()

      /* shift coordinates back, to undo centered padding
        x = ((x * widthAfterPadding) - shiftX) / width
        y = ((y * heightAfterPadding) - shiftY) / height
      */

      const landmarkTensors = fc1
        .mul(tf.stack(Array.from(Array(input.batchSize), (_, batchIdx) =>
          createInterleavedTensor(
            input.getPaddings(batchIdx).x + input.getInputWidth(batchIdx),
            input.getPaddings(batchIdx).y + input.getInputHeight(batchIdx)
          )
        )))
        .sub(tf.stack(Array.from(Array(input.batchSize), (_, batchIdx) =>
          createInterleavedTensor(
            Math.floor(input.getPaddings(batchIdx).x / 2),
            Math.floor(input.getPaddings(batchIdx).y / 2)
          )
        )))
        .div(tf.stack(Array.from(Array(input.batchSize), (_, batchIdx) =>
          createInterleavedTensor(
            input.getInputWidth(batchIdx),
            input.getInputHeight(batchIdx)
          )
        )))

      return landmarkTensors as tf.Tensor2D
    })
  }

  public async forward(input: TNetInput): Promise<tf.Tensor2D> {
    return this.forwardInput(await toNetInput(input, true))
  }

  public async detectLandmarks(input: TNetInput): Promise<FaceLandmarks68 | FaceLandmarks68[]> {
    const netInput = await toNetInput(input, true)

    const landmarkTensors = tf.tidy(
      () => tf.unstack(this.forwardInput(netInput))
    )

    const landmarksForBatch = await Promise.all(landmarkTensors.map(
      async (landmarkTensor, batchIdx) => {
        const landmarksArray = Array.from(await landmarkTensor.data())
        const xCoords = landmarksArray.filter((_, i) => isEven(i))
        const yCoords = landmarksArray.filter((_, i) => !isEven(i))

        return new FaceLandmarks68(
          Array(68).fill(0).map((_, i) => new Point(xCoords[i], yCoords[i])),
          {
            height: netInput.getInputHeight(batchIdx),
            width : netInput.getInputWidth(batchIdx),
          }
        )
      }
    ))

    landmarkTensors.forEach(t => t.dispose())

    return netInput.isBatchInput
      ? landmarksForBatch
      : landmarksForBatch[0]
  }

  protected loadQuantizedParams(uri: string | undefined) {
    return loadQuantizedParams(uri)
  }

  protected extractParams(weights: Float32Array) {
    return extractParams(weights)
  }
}