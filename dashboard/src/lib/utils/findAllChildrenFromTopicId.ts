import { TopicOption } from "@/types/types";

export function findAllChildrenTopicsFromId(allTopics: TopicOption[], rootId: number | null): TopicOption[] {
  const result: TopicOption[] = [];

  const rootTopic = allTopics.find((t) => t.id === rootId);
  if (!rootTopic) return [];

  result.push(rootTopic);

  function collectChildrenRecursive(parentId: number |null) {
    const children = allTopics.filter((t) => t.parentId === parentId);
    for (const child of children) {
      result.push(child);
      collectChildrenRecursive(child.id);
    }
  }

  collectChildrenRecursive(rootId);

  return result;
}