export const getProjects = () => {
  const savedProjects = window.localStorage.getItem('projects');
  return savedProjects ? JSON.parse(savedProjects) : [];
}

export const setProjects = (projects: object) => {
  window.localStorage.setItem('projects', JSON.stringify(projects));
}

export const getHistory = () => {
  const historyString = window.localStorage.getItem('history');
  return historyString ? JSON.parse(historyString) : [];
}

export const setHistory = (history: object) => {
  window.localStorage.setItem('history', JSON.stringify(history));
}

export default {
  getProjects,
  getHistory,
}