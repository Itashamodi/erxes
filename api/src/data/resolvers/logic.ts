import { Pipelines, Stages } from '../../db/models';
import { ILogic } from '../../db/models/definitions/fields';

export default {
  async pipelineId(root: ILogic) {
    if (!root.stageId) {
      return null;
    }
    const stage = await Stages.findOne({ _id: root.stageId || '' }).lean();

    return stage.pipelineId;
  },

  async boardId(root: ILogic) {
    if (!root.stageId) {
      return null;
    }
    const stage = await Stages.findOne({ _id: root.stageId }).lean();
    const pipeLine = await Pipelines.findOne({ _id: stage.pipelineId }).lean();

    return pipeLine.boardId;
  }
};
