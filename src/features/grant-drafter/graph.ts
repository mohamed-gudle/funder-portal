import {
  Annotation,
  MessagesAnnotation,
  StateGraph
} from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  SystemMessage,
  BaseMessage
} from '@langchain/core/messages';

// Define the state for the grant proposal drafting process
export const GrantProposalState = Annotation.Root({
  ...MessagesAnnotation.spec,
  grantName: Annotation<string>(),
  focusArea: Annotation<string>(),
  requirements: Annotation<string>(),
  orgContext: Annotation<string>(),

  // Internal state
  research: Annotation<string>(),
  sections: Annotation<Record<string, string>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({})
  })
});

// Initialize the model
const model = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0
});

// Node: Assistant
// The main node that decides what to do based on the conversation history
const assistantNode = async (state: typeof GrantProposalState.State) => {
  const { messages, grantName, requirements, orgContext } = state;

  const systemPrompt = `You are an expert grant writer assistant.
  Current Context:
  - Grant Opportunity: ${grantName || 'Not specified'}
  - Requirements: ${requirements || 'Not specified'}
  - Organization Context: ${orgContext || 'Not specified'}
  
  Your goal is to help the user draft a grant proposal. 
  You can draft sections, review them, or answer questions about the grant process.
  
  If the user asks to draft a specific section (e.g., "Executive Summary"), do checks:
  1. Do you have enough info? If not, ask.
  2. If yes, generate the draft.
  
  Output the response as a natural language message.
  `;

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    ...messages
  ]);

  return { messages: [response] };
};

import { BaseCheckpointSaver } from '@langchain/langgraph';

// Define the graph
export const createGrantGraph = (checkpointer?: BaseCheckpointSaver) => {
  const workflow = new StateGraph(GrantProposalState)
    .addNode('assistant', assistantNode)
    .addEdge('__start__', 'assistant')
    .addEdge('assistant', '__end__');

  return workflow.compile({ checkpointer });
};
