import conversationModel from '../model/conversation.Model.js';

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit  = parseInt(req.query.limit)  || 50;
    const offset = parseInt(req.query.offset) || 0;

    const conversations = await conversationModel.getConversationByUser(userId, limit, offset);

    res.status(200).json({
      message: 'Conversations fetched',
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Error in getHistory:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHistoryByJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({ message: 'jobId is required' });
    }

    const conversations = await conversationModel.getConversationsByJob(userId, jobId);

    res.status(200).json({
      message: 'Job conversations fetched',
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Error in getHistoryByJob:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const usage  = await conversationModel.getTokenUsageSummary(userId);

    res.status(200).json({
      message: 'Usage fetched',
      usage
    });
  } catch (error) {
    console.error('Error in getUsage:', error);
    res.status(500).json({ message: 'Server error' });
  }
};